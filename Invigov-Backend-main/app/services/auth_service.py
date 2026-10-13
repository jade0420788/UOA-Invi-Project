import uuid
import secrets
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
import resend

from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.core.config import settings
from app.models.user import User, Workspace
from app.models.entitlement import Entitlement
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, ResetPasswordRequest


def _generate_verification_token() -> str:
    """Generate a URL-safe verification token."""
    return secrets.token_urlsafe(32)


def _send_verification_email(to_email: str, token: str, workspace_name: str) -> None:
    """Send email verification link via Resend."""
    if not settings.RESEND_API_KEY:
        return  # Skip in development if no API key

    resend.api_key = settings.RESEND_API_KEY

    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#F9FAFB;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9FAFB;padding:40px 0;">
            <tr><td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:8px;box-shadow:0 1px 3px 0 rgba(0,0,0,0.1);">
                    <tr><td style="padding:32px 40px;border-bottom:1px solid #E5E7EB;">
                        <h1 style="margin:0;font-size:20px;font-weight:600;color:#111827;">INVIGOV</h1>
                        <p style="margin:4px 0 0 0;font-size:12px;color:#6B7280;">Federal Compliance Monitoring Platform</p>
                    </td></tr>
                    <tr><td style="padding:32px 40px;">
                        <h2 style="margin:0 0 16px 0;font-size:18px;color:#111827;">Verify your email address</h2>
                        <p style="margin:0 0 8px 0;font-size:14px;color:#374151;">
                            Welcome to INVIGOV! Please verify your email to activate your <strong>{workspace_name}</strong> workspace.
                        </p>
                        <p style="margin:0 0 24px 0;font-size:14px;color:#374151;">
                            Click the button below to verify your email address:
                        </p>
                        <table cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
                            <tr><td style="background-color:#2563EB;border-radius:6px;text-align:center;">
                                <a href="{verify_url}" style="display:inline-block;padding:12px 32px;font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;">
                                    Verify Email Address
                                </a>
                            </td></tr>
                        </table>
                        <p style="margin:0 0 8px 0;font-size:13px;color:#6B7280;">
                            Or copy and paste this link into your browser:
                        </p>
                        <p style="margin:0 0 24px 0;font-size:12px;color:#2563EB;word-break:break-all;">
                            {verify_url}
                        </p>
                        <p style="margin:0;font-size:13px;color:#6B7280;">
                            This link expires in 24 hours. If you didn't create an account, you can safely ignore this email.
                        </p>
                    </td></tr>
                    <tr><td style="padding:24px 40px;background-color:#F9FAFB;border-top:1px solid #E5E7EB;">
                        <p style="margin:0;font-size:12px;color:#9CA3AF;">
                            &copy; 2026 INVIGOV. All rights reserved.
                        </p>
                    </td></tr>
                </table>
            </td></tr>
        </table>
    </body>
    </html>
    """

    params = {
        "from": f"INVIGOV <{settings.EMAIL_FROM}>",
        "to": [to_email],
        "subject": "Verify your email address - INVIGOV",
        "html": html_content,
    }

    resend.Emails.send(params)


def _send_password_reset_email(to_email: str, token: str) -> None:
    """Send password reset link via Resend."""
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={token}"

    if not settings.RESEND_API_KEY:
        # Local/dev without Resend: print link so reset can still be tested
        print(
            f"[DEV] Password reset email skipped (no RESEND_API_KEY).\n"
            f"[DEV] To: {to_email}\n"
            f"[DEV] Open this link: {reset_url}",
            flush=True,
        )
        return

    resend.api_key = settings.RESEND_API_KEY

    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;background-color:#F9FAFB;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9FAFB;padding:40px 0;">
            <tr><td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border-radius:8px;box-shadow:0 1px 3px 0 rgba(0,0,0,0.1);">
                    <tr><td style="padding:32px 40px;border-bottom:1px solid #E5E7EB;">
                        <h1 style="margin:0;font-size:20px;font-weight:600;color:#111827;">INVIGOV</h1>
                        <p style="margin:4px 0 0 0;font-size:12px;color:#6B7280;">Federal Compliance Monitoring Platform</p>
                    </td></tr>
                    <tr><td style="padding:32px 40px;">
                        <h2 style="margin:0 0 16px 0;font-size:18px;color:#111827;">Reset your password</h2>
                        <p style="margin:0 0 24px 0;font-size:14px;color:#374151;">
                            We received a request to reset your INVIGOV password. Click the button below to choose a new password.
                        </p>
                        <table cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
                            <tr><td style="background-color:#2563EB;border-radius:6px;text-align:center;">
                                <a href="{reset_url}" style="display:inline-block;padding:12px 32px;font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;">
                                    Reset Password
                                </a>
                            </td></tr>
                        </table>
                        <p style="margin:0 0 8px 0;font-size:13px;color:#6B7280;">
                            Or copy and paste this link into your browser:
                        </p>
                        <p style="margin:0 0 24px 0;font-size:12px;color:#2563EB;word-break:break-all;">
                            {reset_url}
                        </p>
                        <p style="margin:0;font-size:13px;color:#6B7280;">
                            This link expires in 1 hour. If you did not request a password reset, you can safely ignore this email.
                        </p>
                    </td></tr>
                    <tr><td style="padding:24px 40px;background-color:#F9FAFB;border-top:1px solid #E5E7EB;">
                        <p style="margin:0;font-size:12px;color:#9CA3AF;">
                            &copy; 2026 INVIGOV. All rights reserved.
                        </p>
                    </td></tr>
                </table>
            </td></tr>
        </table>
    </body>
    </html>
    """

    params = {
        "from": f"INVIGOV <{settings.EMAIL_FROM}>",
        "to": [to_email],
        "subject": "Reset your password - INVIGOV",
        "html": html_content,
    }

    resend.Emails.send(params)


def request_password_reset(db: Session, email: str) -> dict:
    """
    Start password reset. Always returns a generic message (does not reveal whether email exists).
    """
    generic = {"message": "If an account with that email exists, a password reset link has been sent."}
    user = db.query(User).filter(User.email == email).first()
    if not user or not user.is_active:
        return generic

    token = _generate_verification_token()
    user.password_reset_token = token
    user.password_reset_token_expires_at = datetime.utcnow() + timedelta(hours=1)
    db.commit()

    try:
        _send_password_reset_email(user.email, token)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Password reset email could not be sent: {exc}",
        ) from exc

    return generic


def reset_password(db: Session, payload: ResetPasswordRequest) -> dict:
    """
    Set a new password using a valid reset token.
    """
    user = db.query(User).filter(User.password_reset_token == payload.token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset link",
        )

    if (
        user.password_reset_token_expires_at
        and user.password_reset_token_expires_at < datetime.utcnow()
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset link has expired. Please request a new one.",
        )

    user.hashed_password = hash_password(payload.password)
    user.password_reset_token = None
    user.password_reset_token_expires_at = None
    db.commit()

    return {"message": "Password updated. You can sign in with your new password."}


def register_user(db: Session, payload: RegisterRequest) -> dict:
    """
    Register a new user.
    Creates: workspace → user (owner) → entitlement row (both statuses = 'inactive').
    Sends verification email. Returns message instead of tokens.
    """
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    # 1. Create workspace
    workspace = Workspace(name=payload.workspace_name)
    db.add(workspace)
    db.flush()

    # 2. Generate verification token
    verification_token = _generate_verification_token()

    # 3. Create user (owner role) — store Terms/Privacy acceptance timestamp
    # Local testing (no RESEND_API_KEY): auto-verify so login works without inbox email
    local_testing = not bool(settings.RESEND_API_KEY)
    user = User(
        workspace_id=workspace.id,
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role="owner",
        email_verified=local_testing,
        verification_token=None if local_testing else verification_token,
        verification_token_expires_at=None if local_testing else (datetime.utcnow() + timedelta(hours=24)),
        terms_accepted_at=datetime.utcnow(),
    )
    db.add(user)
    db.flush()

    # 4. Create entitlement row (both statuses default to 'inactive')
    entitlement = Entitlement(workspace_id=workspace.id)
    db.add(entitlement)

    db.commit()
    db.refresh(user)

    # 5. Send verification email (skipped only when RESEND_API_KEY is empty)
    if not local_testing:
        try:
            _send_verification_email(payload.email, verification_token, payload.workspace_name)
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Verification email could not be sent: {exc}",
            ) from exc

    return {
        "message": (
            "Account created. You can sign in now (local testing — email verification skipped)."
            if local_testing
            else "Account created. Please check your email to verify your account."
        ),
        "email": payload.email,
    }


def verify_email(db: Session, token: str) -> TokenResponse:
    """
    Verify user email with token. Returns JWT tokens on success.
    """
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid verification link",
        )

    if user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already verified",
        )

    if user.verification_token_expires_at and user.verification_token_expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification link has expired. Please request a new one.",
        )

    user.email_verified = True
    user.verification_token = None
    user.verification_token_expires_at = None
    db.commit()

    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


def resend_verification(db: Session, email: str) -> dict:
    """
    Resend verification email.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Don't reveal if email exists
        return {"message": "If an account with that email exists, a verification email has been sent."}

    if user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified",
        )

    # Generate new token
    user.verification_token = _generate_verification_token()
    user.verification_token_expires_at = datetime.utcnow() + timedelta(hours=24)
    db.commit()

    # Get workspace name
    workspace = db.query(Workspace).filter(Workspace.id == user.workspace_id).first()
    workspace_name = workspace.name if workspace else "Your workspace"

    try:
        _send_verification_email(user.email, user.verification_token, workspace_name)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Verification email could not be sent: {exc}",
        ) from exc

    return {"message": "If an account with that email exists, a verification email has been sent."}


def login_user(db: Session, payload: LoginRequest) -> TokenResponse:
    """
    Authenticate user and return JWT tokens.
    """
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled",
        )

    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before signing in. Check your inbox for the verification link.",
        )

    user.last_login_at = datetime.utcnow()
    db.commit()

    access_token = create_access_token(str(user.id))
    refresh_token = create_refresh_token(str(user.id))

    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


def refresh_access_token(db: Session, refresh_token: str) -> TokenResponse:
    """
    Issue a new access token given a valid refresh token.
    """
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before signing in.",
        )

    new_access_token = create_access_token(str(user.id))
    new_refresh_token = create_refresh_token(str(user.id))

    return TokenResponse(access_token=new_access_token, refresh_token=new_refresh_token)
