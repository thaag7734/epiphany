from sqlalchemy import CheckConstraint, Column, ForeignKey
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
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    users = db.relationship("User", secondary=team_user, back_populates="teams")


note_label = db.Table(
    "note_labels",
    db.Column("note_id", db.Integer, db.ForeignKey("notes.id"), primary_key=True),
    db.Column("label_id", db.Integer, db.ForeignKey("labels.id"), primary_key=True),
)


class Label(db.Model):
    __tablename__ = "labels"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(24))
    board_id = db.Column(db.Integer, db.ForeignKey("boards.id"))


class Note(db.Model):
    __tablename__ = "notes"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(32), nullable=False)
    content = db.Column(db.String(2000))
    deadline = db.Column(db.Date)
    priority = db.Column(db.Integer, CheckConstraint("priority >= 0 AND priority <= 3"))
    board_id = db.Column(db.Integer, db.ForeignKey("boards.id"))


class Board(db.Model):
    __tablename__ = "boards"

    id = db.Column(db.Integer, primary_key=True)
    team_id = db.Column(db.Integer)
    owner_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    name = db.Column(db.String, nullable=False)

    labels = db.relationship("Label", back_populates="board")
    notes = db.relationship("Note", back_populates="board")
