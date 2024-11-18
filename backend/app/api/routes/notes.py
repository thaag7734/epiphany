from flask import Blueprint, request
from app.models.models import Note, Board, Team, Label
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

    user_has_access = False

    if note_board.owner_id == current_user.id:
        user_has_access = True

    if not user_has_access and note_board.team_id is not None:
        team: Team = note_board.team

        for member in team.users:
            if member.id == current_user.id:
                user_has_access = True
                break

    if not user_has_access:
        return {"message": "You do not have permission to edit this note"}, 403

    form_data = request.json

    if not form_data:
        return {"message": "Missing form data from request"}, 400

    form_data["board_id"] = note_board.id
    form = NoteForm(ImmutableMultiDict(form_data))
    form["csrf_token"].data = request.cookies["csrf_token"]

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

        return {"message": "Note successfully updated", "note": note.to_dict()}, 200
    else:
        return {"message": "Invalid form data", "errors": form.errors}, 400


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


@notes.route("/<int:note_id>/labels", methods=["POST"])
@login_required
def add_label_to_note(note_id: int):
    note = Note.query.get(note_id)

    if not note:
        return {"message": f"Note {note_id} does not exist Sorry"}, 404

    if note.board.owner_id != current_user.id:
        return {"message": "You are not the owner of this note"}, 403

    form_data = request.json

    if not form_data:
        return {"message": "Missing form data from request."}, 400

    label_id = form_data["labelId"]

    if label_id is None:
        return {"message": "Label id is required"}, 400

    label = Label.query.get(label_id)

    if not label:
        return {"message": "Label not found"}, 404

    if label.board_id != note.board_id:
        return {
            "message": "You can't add a label to a note from a different board"
        }, 403

    try:
        note.labels.append(label)
        db.session.commit()
    except Exception:
        db.session.rollback()
        return {"message": "Internal Server error"}, 500
    else:
        return {"message": "Label added successfully", "note": note.to_dict()}, 200


@notes.route("/<int:note_id>/labels", methods=["DELETE"])
@login_required
def remove_note_label(note_id: int):
    note = Note.query.get(note_id)

    if not note:
        return {"message": f"Note {note_id} does not exist Sorry"}, 404

    if note.board.owner_id != current_user.id:
        return {"message": "You are not the owner of this note"}, 403

    form_data = request.json

    if not form_data:
        return {"message": "Missing form data from request."}, 400

    label_id = form_data["labelId"]

    if label_id is None:
        return {"message": "Label id is required"}, 400

    label = Label.query.get(label_id)

    if not label:
        return {"message": "Label not found"}, 404

    if len([lbl for lbl in note.labels if lbl.id == label.id]) == 0:
        return {"message": "Note does not have this label"}, 403

    try:
        note.labels = [lbl for lbl in note.labels if lbl.id != label.id]
        db.session.commit()
    except Exception:
        db.session.rollback()
        return {"message": "Internal Server error"}, 500
    else:
        return {"message": "Label removed successfully", "note": note.to_dict()}, 200
