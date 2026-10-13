from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.api.v1.deps import get_current_user
from app.services.payment_service import create_tier_checkout, cancel_pending_checkout
from app.services.trial_service import start_trial

router = APIRouter()


@router.post("/checkout/{tier}")
def checkout_tier(
    tier: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Paid subscribe/upgrade — Stripe Checkout collects a card. Not used for free trials."""
    return create_tier_checkout(db, current_user.workspace_id, current_user, tier)


@router.post("/start-trial/{tier}")
def start_trial_tier(
    tier: str,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Start a 7-day free trial with no Stripe session and no card required."""
    return start_trial(db, current_user.workspace_id, current_user, tier)


@router.post("/cancel-checkout")
def cancel_checkout(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel an abandoned Stripe checkout session state."""
    return cancel_pending_checkout(db, current_user.workspace_id, current_user)
