"""
App-managed 7-day free trials.

No Stripe session and no card collection at trial start.
When the trial ends, access returns to Free with no automatic charge.
"""
from datetime import datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.entitlement import Entitlement
from app.models.user import User
from app.models.audit_log import AuditLog

TRIAL_DAYS = 7
PAID_TIERS = ("intelligence", "complete")
TIER_RANK = {"free": 0, "intelligence": 1, "complete": 2}


def expire_trial_if_needed(db: Session, entitlement: Entitlement | None) -> Entitlement | None:
    """If a trial window has elapsed, revert to Free. Never creates a Stripe charge."""
    if not entitlement:
        return entitlement
    if entitlement.subscription_status != "trialing":
        return entitlement
    if not entitlement.trial_ends_at or entitlement.trial_ends_at > datetime.utcnow():
        return entitlement

    previous_tier = entitlement.subscription_tier
    previous_status = entitlement.subscription_status
    entitlement.subscription_tier = "free"
    entitlement.subscription_status = "active"
    entitlement.subscription_start_at = None
    entitlement.subscription_end_at = None
    entitlement.trial_ends_at = None
    # trial_used stays True — one trial per workspace

    db.add(
        AuditLog(
            workspace_id=entitlement.workspace_id,
            actor_type="system",
            actor_id="trial_expiry",
            event_type="entitlement.subscription.trial_ended",
            previous_state=f"{previous_tier}:{previous_status}",
            new_state="free:active",
            extra_data={"reason": "trial_period_elapsed", "charged": False},
        )
    )
    db.commit()
    db.refresh(entitlement)
    return entitlement


def has_tier_access(entitlement: Entitlement | None, allowed_tiers: tuple[str, ...]) -> bool:
    if not entitlement:
        return False
    return (
        entitlement.subscription_tier in allowed_tiers
        and entitlement.subscription_status in ("active", "trialing")
    )


def start_trial(db: Session, workspace_id, current_user: User, tier: str) -> dict:
    """Grant paid-tier access for TRIAL_DAYS without Stripe."""
    if tier not in PAID_TIERS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": "invalid_tier",
                "message": f"Invalid tier '{tier}'. Must be 'intelligence' or 'complete'.",
            },
        )

    entitlement = db.query(Entitlement).filter_by(workspace_id=workspace_id).first()
    if not entitlement:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Entitlement record not found")

    expire_trial_if_needed(db, entitlement)
    db.refresh(entitlement)

    if entitlement.subscription_status == "active" and entitlement.subscription_tier in PAID_TIERS:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": "already_subscribed",
                "message": "You already have an active paid subscription.",
            },
        )

    if entitlement.subscription_status == "trialing":
        # Allow elevating to a higher trial tier without restarting the clock
        if TIER_RANK.get(tier, 0) <= TIER_RANK.get(entitlement.subscription_tier or "free", 0):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "code": "trial_active",
                    "message": "A free trial is already active for this workspace.",
                },
            )
        previous = f"{entitlement.subscription_tier}:{entitlement.subscription_status}"
        entitlement.subscription_tier = tier
        db.add(
            AuditLog(
                workspace_id=workspace_id,
                actor_type="user",
                actor_id=str(current_user.id),
                event_type="entitlement.subscription.trial_upgraded",
                previous_state=previous,
                new_state=f"{tier}:trialing",
                extra_data={"trial_ends_at": entitlement.trial_ends_at.isoformat() if entitlement.trial_ends_at else None},
            )
        )
        db.commit()
        db.refresh(entitlement)
        return _trial_payload(entitlement)

    if entitlement.trial_used:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "code": "trial_already_used",
                "message": "This workspace has already used its free trial. Upgrade to continue with paid features.",
            },
        )

    # Abandoned Stripe checkout should not block a no-card trial
    if entitlement.subscription_status == "pending_checkout":
        entitlement.subscription_status = "active"
        entitlement.subscription_tier = "free"
        db.add(
            AuditLog(
                workspace_id=workspace_id,
                actor_type="user",
                actor_id=str(current_user.id),
                event_type="entitlement.subscription.checkout_abandoned",
                previous_state="pending_checkout",
                new_state="free:active",
                extra_data={"reason": "cleared_to_start_trial"},
            )
        )
        db.commit()
        db.refresh(entitlement)

    now = datetime.utcnow()
    ends = now + timedelta(days=TRIAL_DAYS)
    previous = f"{entitlement.subscription_tier}:{entitlement.subscription_status}"

    entitlement.subscription_tier = tier
    entitlement.subscription_status = "trialing"
    entitlement.subscription_start_at = now
    entitlement.subscription_end_at = ends
    entitlement.trial_ends_at = ends
    entitlement.trial_used = True

    db.add(
        AuditLog(
            workspace_id=workspace_id,
            actor_type="user",
            actor_id=str(current_user.id),
            event_type="entitlement.subscription.trial_started",
            previous_state=previous,
            new_state=f"{tier}:trialing",
            extra_data={
                "trial_days": TRIAL_DAYS,
                "trial_ends_at": ends.isoformat(),
                "card_required": False,
                "auto_charge": False,
            },
        )
    )
    db.commit()
    db.refresh(entitlement)
    return _trial_payload(entitlement)


def _trial_payload(entitlement: Entitlement) -> dict:
    return {
        "subscription_tier": entitlement.subscription_tier,
        "subscription_status": entitlement.subscription_status,
        "trial_ends_at": entitlement.trial_ends_at.isoformat() if entitlement.trial_ends_at else None,
        "trial_used": bool(entitlement.trial_used),
        "message": "Trial started. No credit card required. Access ends when the trial expires unless you upgrade.",
    }


def expire_all_trials(db: Session) -> dict:
    """Batch job: end all elapsed trials with no charge."""
    now = datetime.utcnow()
    rows = (
        db.query(Entitlement)
        .filter(
            Entitlement.subscription_status == "trialing",
            Entitlement.trial_ends_at.isnot(None),
            Entitlement.trial_ends_at <= now,
        )
        .all()
    )
    expired = 0
    for entitlement in rows:
        expire_trial_if_needed(db, entitlement)
        expired += 1
    return {"expired": expired}
