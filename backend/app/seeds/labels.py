from sqlalchemy.sql import text
from app.models.models import Label
from app.models.db import db, environment, SCHEMA


def seed_labels():
    labels = [[Label(name=f"label{x}", board_id=y) for x in range(3)] for y in range(3)]

    for board_labels in labels:
        for label in board_labels:
            db.session.add(label)

    db.session.commit()


def undo_labels():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.labels RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM labels"))

    db.session.commit()
