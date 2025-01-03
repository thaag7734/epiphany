from sqlalchemy.sql import text
from app.models.user import User
from app.models.models import Board, Team
from app.models.db import db, environment, SCHEMA


def seed_teams():
    user1 = User.query.get(1)
    user2 = User.query.get(2)
    user3 = User.query.get(3)

    team = Team(id=1, owner_id=1, users=[user1, user2, user3])

    db.session.add(team)
    db.session.commit()

    shared_board = Board(id=4, name="shared board", owner_id=1, team_id=1)

    db.session.add(shared_board)
    db.session.commit()


def undo_teams():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.teams RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM teams"))

    db.session.commit()
