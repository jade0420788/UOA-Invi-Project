"""Add trialing status and trial fields to entitlements

Revision ID: 011
Revises: 010
Create Date: 2026-04-06
"""
from alembic import op
import sqlalchemy as sa

revision = "011"
down_revision = "010"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("ALTER TYPE subscription_status_v2 ADD VALUE IF NOT EXISTS 'trialing'")
    op.add_column(
        "entitlements",
        sa.Column("trial_ends_at", sa.DateTime(), nullable=True),
    )
    op.add_column(
        "entitlements",
        sa.Column(
            "trial_used",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )


def downgrade() -> None:
    op.drop_column("entitlements", "trial_used")
    op.drop_column("entitlements", "trial_ends_at")
    # Enum value 'trialing' is left in place (Postgres cannot easily remove enum values)
