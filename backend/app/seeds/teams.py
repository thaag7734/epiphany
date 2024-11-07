from sqlalchemy.sql import text
from app.models.user import User
from app.models.models import Board, Team
from app.models.db import db, environment, SCHEMA


def seed_teams():
    shared_board = Board(name="shared board", owner_id=1)

    db.session.add(shared_board)
    db.session.commit()

    user2 = User.query.get(2)
    user3 = User.query.get(3)

    team = Team(owner_id=1, users=[user2, user3])

    db.session.add(team)
    db.session.commit()


def undo_teams():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.teams RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM teams"))

    db.session.commit()
