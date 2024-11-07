from flask import Blueprint, request
from app.models.models import Note, Board
from app.forms.note_form import NoteForm
from app.models.db import db
from werkzeug.datastructures import ImmutableMultiDict
from flask_login import current_user, login_required

notes: Blueprint = Blueprint("notes", __name__, url_prefix="/notes")

@notes.route("/<int:note_id>/edit", methods=["PUT"])
@login_required
def update_note(note_id: int):
    if not current_user:
        return {"message": "Must be logged in to update a note"}, 401

    note = Note.query.get(note_id)

    if not note:
        return {"message": "Note does not exist Sorry"}, 404

    note_board = Board.query.get(note.board_id)

    if note_board.owner_id != current_user.id:
        return {"message": "This is not your Note"}, 403

    form_data = request.json

    if not form_data:
        return {"message": "Missing form data from request"}, 400

    form_data["board_id"] = note_board.id
    form = NoteForm(ImmutableMultiDict(form_data))

    if form.validate():

        try:
            note.title = form.title.data
            note.content = form.content.data
            note.deadline = form.deadline.data
            note.priority = form.priority.data
    
            db.session.commit()        
        except Exception:
            db.session.rollback()
            return {"message": "Internal Server error"}, 500
        else:
            return {"message": "Note successfully updated", "note": note.to_dict()}, 200

@notes.route("/<int:note_id>/delete", methods=["DELETE"])
@login_required
def delete_note(note_id: int):
    if not current_user:
        return {"message": "Must be logged in to delete a note"}, 401

    note = Note.query.get(note_id)

    if not note:
        return {"message": "Note does not exist Sorry"}, 404

    note_board = Board.query.get(note.board_id)

    if note_board.owner_id != current_user.id:
        return {"message": "This is not your Note"}, 403
    
    try:
        db.session.delete(note)
    except Exception:
        db.session.rollback()
        return {"message": "Internal Server error"}, 500
    else:
        db.session.commit()
        return {"message": "Note successfully deleted"}, 200