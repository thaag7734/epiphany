from sqlalchemy.sql import text
from app.models.db import db, environment, SCHEMA
from app.models.models import Board
from app.models.user import User


def seed_boards():
    board1 = Board(name="Demo Board", owner_id=1)
    board2 = Board(name="Board 2", owner_id=2)
    board3 = Board(name="Board 3", owner_id=3)

    db.session.add(board1)
    db.session.add(board2)
    db.session.add(board3)
    db.session.commit()

    user1: User = User.query.get(1)
    user2: User = User.query.get(2)
    user3: User = User.query.get(3)

    user1.root_board_id = 1
    user2.root_board_id = 2
    user3.root_board_id = 3
    db.session.commit()


def undo_boards():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.boards RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM boards"))

    db.session.commit()
