"""create tables

Revision ID: e88bf513bb93
Revises:
Create Date: 2024-11-13 13:27:18.893922

"""

from alembic import op
import sqlalchemy as sa
from dotenv import load_dotenv
import os

load_dotenv()

environment = os.environ.get("FLASK_ENV")
schema = os.environ.get("SCHEMA") if environment == "production" else None

# revision identifiers, used by Alembic.
revision = "e88bf513bb93"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "boards",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("team_id", sa.Integer(), nullable=True),
        sa.Column("owner_id", sa.Integer(), nullable=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        schema=schema,
    )
    op.create_table(
        "teams",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        schema=schema,
    )
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=40), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("root_board_id", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("username"),
        schema=schema,
    )
    op.create_table(
        "labels",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=24), nullable=True),
        sa.Column("board_id", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        schema=schema,
    )
    op.create_table(
        "notes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=32), nullable=False),
        sa.Column("content", sa.String(length=2000), nullable=True),
        sa.Column("deadline", sa.Date(), nullable=True),
        sa.Column("priority", sa.Integer(), nullable=True),
        sa.Column("board_id", sa.Integer(), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        schema=schema,
    )
    op.create_table(
        "team_users",
        sa.Column("team_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("team_id", "user_id"),
        schema=schema,
    )
    op.create_table(
        "note_labels",
        sa.Column("note_id", sa.Integer(), nullable=False),
        sa.Column("label_id", sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint("note_id", "label_id"),
        schema=schema,
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("note_labels")
    op.drop_table("team_users")
    op.drop_table("notes")
    op.drop_table("labels")
    op.drop_table("users")
    op.drop_table("teams")
    op.drop_table("boards")
    # ### end Alembic commands ###
