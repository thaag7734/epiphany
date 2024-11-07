from sqlalchemy import CheckConstraint, ForeignKey, column
from .db import db, environment, SCHEMA, add_prefix_for_prod


team_user = db.Table(
    "team_users",
    db.Column("team_id", db.Integer, db.ForeignKey("teams.id"), primary_key=True),
    db.Column("user_id", db.Integer, db.ForeignKey("users.id"), primary_key=True),
)


class Team(db.Model):
    __tablename__ = "teams"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))

    users = db.relationship("User", secondary=team_user, back_populates="teams")
    owner = db.relationship("User")
    board = db.relationship("Board", back_populates="team")

    def to_dict(self):
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "users": [user.to_dict() for user in self.users],
            "owner": self.owner.to_dict(),
        }


note_label = db.Table(
    "note_labels",
    db.Column(
        "note_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("notes.id")),
        primary_key=True,
    ),
    db.Column(
        "label_id",
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("labels.id")),
        primary_key=True,
    ),
)


class Label(db.Model):
    __tablename__ = "labels"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(24))
    board_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("boards.id")))

    board = db.relationship("Board", back_populates="labels")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "board_id": self.board_id,
            "board": self.board.to_dict(),
        }


class Note(db.Model):
    __tablename__ = "notes"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(32), nullable=False)
    content = db.Column(db.String(2000))
    deadline = db.Column(db.Date)
    priority = db.Column(db.Integer, CheckConstraint("priority >= 0 AND priority <= 3"))
    board_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("boards.id")))

    board = db.relationship("Board", back_populates="notes")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "deadline": self.deadline,
            "priority": self.priority,
            "board_id": self.board_id,
            "board": self.board.to_dict(),
        }


class Board(db.Model):
    __tablename__ = "boards"

    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("teams.id")))
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    name = db.Column(db.String, nullable=False)

    team = db.relationship("Team", back_populates="board")
    labels = db.relationship("Label", back_populates="board")
    notes = db.relationship("Note", back_populates="board")
    owner = db.relationship("User", back_populates="boards", foreign_keys=[owner_id])

    def to_dict(self):
        return {
            "id": self.id,
            "team_id": self.team_id,
            "owner_id": self.owner_id,
            "name": self.name,
            "notes": [note.to_dict() for note in self.notes],
            "labels": [label.to_dict() for label in self.labels],
            "owner": self.owner.to_dict(),
        }
