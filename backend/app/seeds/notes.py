from sqlalchemy.sql import text
from app.models.models import Label, Note
from app.models.db import db, environment, SCHEMA


def seed_notes():
    notes = [
        [Note(title=f"note{x}", content="uwu", board_id=y) for x in range(1, 5)]
        for y in range(1, 5)
    ]

    notes[0].append(Note(title="Welcome", content="Welcome to Epiphany! Feel free to epiphanize. This can be your destination for all your notes, reminders, tasks, and even just your random thoughts. Share a board, join a team, and brainstorm re-inventing the wheel with family and friends!", board_id=1))
    notes[0].append(Note(title="Demo", content="So what's on your mind today? Have you got any ideas on the quadratic equation that Einstein hadn't had a chance to complete. What color are your socks today? When was the last time you did laundry?", board_id=1))
    notes[1].append(Note(title="January", content="The bills are due on the 11th. Renew Netflix subscription before the 22nd. Go skydiving in a bathtub.", board_id=2))
    notes[1].append(Note(title="March", content="Plan big plans. Create huge agendas. Summon incredible aspirations. Stare at the wall.", board_id=2))
    notes[2].append(Note(title="Week Report", content="Crunch the numbers from the Arrow Firm deal. Speak to Dan about the offer he ran point on.", board_id=3))
    notes[2].append(Note(title="Retreat", content="Reservations at the Hillside Hotel. Lobby reception at 5:30pm. Arrange music and dessert", board_id=3))



    for board_notes in notes:
        for note in board_notes:
            labels = Label.query.filter(Label.board_id == note.board_id).all()
            note.labels = labels

            db.session.add(note)

    db.session.commit()


def undo_notes():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.notes RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM notes"))

    db.session.commit()
