from .db import db
from sqlalchemy import CheckConstraint

class Note(db.Model):
      __tablename__ = 'notes'

      id = db.Column(db.Integer, primary_key=True)
      title = db.Column(db.String(32), nullable=False)
      content = db.Column(db.String(2000))
      deadline = db.Column(db.Date)
      priority = db.Column(db.Integer, CheckConstraint('priority >= 0 AND priority <= 3'))
      # add the relationships