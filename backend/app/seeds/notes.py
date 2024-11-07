from sqlalchemy.sql import text
from app.models.models import Label, Note
from app.models.db import db, environment, SCHEMA


def seed_notes():
    notes = [
        [Note(title=f"note{x}", content="uwu", board_id=y) for x in range(3)]
        for y in range(3)
    ]

    for board_notes in notes:
        for note in board_notes:
            labels = Label.query.filter(Label.board_id == note.board_id)
            note.labels = labels

            db.session.add(note)

    db.session.commit()


def undo_notes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.notes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM notes"))

    db.session.commit()
