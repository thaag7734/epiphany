from flask.cli import AppGroup

from app.seeds.boards import seed_boards, undo_boards
from app.seeds.labels import seed_labels, undo_labels
from app.seeds.notes import seed_notes, undo_notes
from app.seeds.teams import seed_teams, undo_teams
from .users import seed_users, undo_users

from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup("seed")


# Creates the `flask seed all` command
@seed_commands.command("all")
def seed():
    if environment == "production":
        # Before seeding in production, you want to run the seed undo
        # command, which will  truncate all tables prefixed with
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_teams()
        undo_notes()
        undo_labels()
        undo_boards()
        undo_users()
    seed_users()
    seed_boards()
    seed_labels()
    seed_notes()
    seed_teams()
    # Add other seed functions here


# Creates the `flask seed undo` command
@seed_commands.command("undo")
def undo():
    undo_users()
    # Add other undo functions here
