from sqlalchemy.sql import text
from app.models.models import Label
from app.models.db import db, environment, SCHEMA


def seed_labels():
    labels = [
        [Label(name=f"label{x}", board_id=y) for x in range(1, 5)] for y in range(1, 5)
    ]
    labels[0].append(Label(name="welcome", board_id=1))
    labels[0].append(Label(name="demo", board_id=1))
    labels[1].append(Label(name="tuesday", board_id=2))
    labels[1].append(Label(name="family", board_id=2))
    labels[2].append(Label(name="due", board_id=3))
    labels[2].append(Label(name="office", board_id=3))

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
