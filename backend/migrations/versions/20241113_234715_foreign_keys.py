"""create foreign key relations

Revision ID: e88bf513bb93
Revises:
Create Date: 2024-11-13 13:27:18.893922

"""

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "040ad73cbf6c"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_foreign_key(
        "fk_boards_owner_id",
        "boards",
        "users",
        ["owner_id"],
        ["id"],
        source_schema="epiphany",
        referent_schema="epiphany",
    )
    op.create_foreign_key(
        "fk_boards_team_id",
        "boards",
        "teams",
        ["team_id"],
        ["id"],
        source_schema="epiphany",
        referent_schema="epiphany",
    )
    op.create_foreign_key(
        "fk_teams_owner_id",
        "teams",
        "users",
        ["owner_id"],
        ["id"],
        source_schema="epiphany",
        referent_schema="epiphany",
    )
    op.create_foreign_key(
        "fk_users_root_board_id",
        "users",
        "boards",
        ["root_board_id"],
        ["id"],
        source_schema="epiphany",
        referent_schema="epiphany",
    )
    op.create_foreign_key(
        "fk_labels_board_id",
        "labels",
        "boards",
        ["board_id"],
        ["id"],
        source_schema="epiphany",
        referent_schema="epiphany",
    )
    op.create_foreign_key(
        "fk_notes_board_id",
        "notes",
        "boards",
        ["board_id"],
        ["id"],
        source_schema="epiphany",
        referent_schema="epiphany",
    )
    op.create_foreign_key(
        "fk_team_users_team_id",
        "team_users",
        "teams",
        ["team_id"],
        ["id"],
        source_schema="epiphany",
        referent_schema="epiphany",
    )
    op.create_foreign_key(
        "fk_team_users_user_id",
        "team_users",
        "users",
        ["user_id"],
        ["id"],
        source_schema="epiphany",
        referent_schema="epiphany",
    )
    op.create_foreign_key(
        "fk_note_labels_note_id",
        "note_labels",
        "notes",
        ["note_id"],
        ["id"],
        source_schema="epiphany",
        referent_schema="epiphany",
    )
    op.create_foreign_key(
        "fk_note_labels_label_id",
        "note_labels",
        "notes",
        ["label_id"],
        ["id"],
        source_schema="epiphany",
        referent_schema="epiphany",
    )
