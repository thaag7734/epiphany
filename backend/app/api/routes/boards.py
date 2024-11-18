from flask import Blueprint, request
from flask_wtf import FlaskForm
from werkzeug.datastructures import ImmutableMultiDict
from app.forms.label_form import LabelForm
from app.forms.note_form import NoteForm
from app.models.models import Board, Label, Team, Note
from app.models.db import db
from flask_login import login_required, current_user
from app.forms.board_form import BoardForm
from app.models.user import User

boards: Blueprint = Blueprint("boards", __name__, url_prefix="/boards")


@boards.route("/<int:board_id>")
@login_required
def get_board(board_id):
    board: Board = Board.query.get(board_id)
    if not board:
        return {"message": "Board does not exist Sorry"}, 404

    if board.owner_id != current_user.id:
        return {"message": "This is not your board"}, 403

    return {
        "id": board.id,
        "name": board.name,
        "owner_id": board.owner_id,
    }, 200


@boards.route("/new", methods=["POST"])
@login_required
def create_board():
    form_data = request.json

    if not form_data:
        return {"message": "Missing form data from request"}, 400

    form_data["owner_id"] = current_user.id
    form_data["csrf_token"] = request.cookies["csrf_token"]

    # wrap data in an ImmutableMultiDict here to fix AttributeError
    # when attempting to instantiate the form
    form = BoardForm(ImmutableMultiDict(form_data))

    if not current_user:
        return {"message": "Must be logged in to create a board"}, 401

    if form.validate():
        new_board = Board(
            team_id=form.team_id.data, owner_id=form.owner_id.data, name=form.name.data
        )

        try:
            db.session.add(new_board)
        except Exception:
            db.session.rollback()
            return {"message": "Internal Server error"}, 500
        else:
            db.session.commit()
            return {
                "message": "New board successfully created",
                "board": new_board.to_dict(),
            }, 201

    else:
        return {"message": "Failed to create new board"}, 400


@boards.route("/<int:board_id>", methods=["PUT"])
@login_required
def update_board(board_id):
    if not current_user:
        return {"message": "Must be logged in to update a board"}, 401

    board = Board.query.get(board_id)

    if not board:
        return {"message": "Board does not exist Sorry"}, 404

    if board.owner_id != current_user.id:
        return {"message": "This is not your board"}, 403

    form_data = request.json

    if not form_data:
        return {"message": "Missing form data from request"}, 400

    form_data["csrf_token"] = request.cookies["csrf_token"]
    form_data["owner_id"] = current_user.id
    form = BoardForm(ImmutableMultiDict(form_data))

    if form.validate():
        try:
            board.team_id = form.team_id.data
            board.name = form.name.data

            db.session.commit()

        except Exception:
            db.session.rollback()
            return {"message": "Internal Server error"}, 500

        else:
            return {
                "message": "Board successfully updated",
                "board": board.to_dict(),
            }, 200

    else:
        return {"message": "Failed to create new board"}, 400


@boards.route("/<int:board_id>", methods=["DELETE"])
@login_required
def delete_board(board_id):
    if not current_user:
        return {"message": "Must be logged in to update a board"}, 401

    board = Board.query.get(board_id)

    if not board:
        return {"message": "Board does not exist Sorry"}, 404

    if board.owner_id != current_user.id:
        return {"message": "This is not your board"}, 403

    if board.id == current_user.root_board_id:
        return {"message": "You cannot delete your home board"}, 403

    try:
        db.session.delete(board)

    except Exception:
        db.session.rollback()
        return {"message": "Internal Server error"}, 500
    else:
        db.session.commit()
        return {"message": "Board succesfully deleted"}, 200


@boards.route("/<int:board_id>/labels")
@login_required
def get_board_labels(board_id: int):
    if not current_user:
        return {"message": "Must be logged in to access labels for this board"}, 401

    board: Board = Board.query.get(board_id)

    if not board:
        return {"message": "Board not found"}, 404

    user_has_access = False

    if board.owner_id == current_user.id:
        user_has_access = True

    if not user_has_access and board.team_id is not None:
        team: Team = board.team

        for member in team.users:
            if member.id == current_user.id:
                user_has_access = True
                break

    if not user_has_access:
        return {
            "message": "You do not have permission to access this board's labels"
        }, 403

    return {"labels": board.to_dict()["labels"]}, 200


@boards.route("/<int:board_id>/new_label", methods=["POST"])
@login_required
def create_label(board_id: int):
    board: Board = Board.query.get(board_id)

    if not board:
        return {"message": "Board not found"}, 404

    user_has_access = False

    if board.owner_id == current_user.id:
        user_has_access = True

    if not user_has_access and board.team_id is not None:
        team: Team = board.team

        for member in team.users:
            if member.id == current_user.id:
                user_has_access = True
                break

    if not user_has_access:
        return {
            "message": "You do not have permission to access this board's labels"
        }, 403

    form_data = request.json

    if not form_data:
        return {"message": "Missing form data from request"}, 400

    form_data["csrf_token"] = request.cookies["csrf_token"]
    form_data["board_id"] = board_id
    form = LabelForm(ImmutableMultiDict(form_data))

    if form.validate():
        new_label = Label(name=form.name.data, board_id=board_id)

        try:
            db.session.add(new_label)
        except Exception:
            db.session.rollback()
            return {"message": "Internal Server error"}, 500
        else:
            db.session.commit()
            return {
                "message": "New label successfully created",
                "label": new_label.to_dict(),
            }, 201
    else:
        return {"errors": form.errors}, 400


@boards.route("/<int:board_id>/notes")
@login_required
def get_board_notes(board_id: int):
    if not current_user:
        return {"message": "Must be logged in to access notes for this board"}, 401

    board: Board = Board.query.get(board_id)

    if not board:
        return {"message": "Board not found"}, 404

    user_has_access = False

    if board.owner_id == current_user.id:
        user_has_access = True

    if not user_has_access and board.team_id is not None:
        team: Team = board.team

        for member in team.users:
            if member.id == current_user.id:
                user_has_access = True
                break

    if not user_has_access:
        return {
            "message": "You do not have permission to access this board's notes"
        }, 403

    return {"notes": board.to_dict()["notes"]}, 200


@boards.route("/<int:board_id>/new_note", methods=["POST"])
@login_required
def create_note(board_id: int):
    form_data = request.json

    if not form_data:
        return {"message": "Missing form data from request"}, 400

    board: Board = Board.query.get(board_id)

    if not board:
        return {"message": "Board not found"}, 404

    user_has_access = False

    if board.owner_id == current_user.id:
        user_has_access = True

    if not user_has_access and board.team_id is not None:
        team: Team = board.team

        for member in team.users:
            if member.id == current_user.id:
                user_has_access = True
                break

    if not user_has_access:
        return {
            "message": "You do not have permission to access this board's labels"
        }, 403

    form_data["csrf_token"] = request.cookies["csrf_token"]
    form_data["board_id"] = board_id
    form = NoteForm(ImmutableMultiDict(form_data))

    if form.validate():
        new_note = Note(
            title=form.title.data,
            content=form.content.data,
            deadline=form.deadline.data,
            priority=form.priority.data,
            board_id=board_id,
        )

        try:
            db.session.add(new_note)
        except Exception:
            db.session.rollback()
            return {"message": "Internal Server error"}, 500
        else:
            db.session.commit()
            return {
                "message": "New label successfully created",
                "note": new_note.to_dict(),
            }, 201
    else:
        return {"message": "Invalid form data"}, 400


@boards.route("/<int:board_id>/new_team", methods=["POST"])
@login_required
def create_team(board_id: int):
    board: Board = Board.query.get(board_id)

    if not board:
        return {"message": "Board not found"}, 404

    if board.owner_id != current_user.id:
        return {"message": "This is not your board"}, 403

    if board.team_id is not None:
        return {"message": "This board is already shared with a team"}, 403

    team = Team(owner_id=current_user.id)
    team.users = [User.query.get(current_user.id)]

    try:
        db.session.add(team)

    except Exception:
        db.session.rollback()
        return {"message": "Internal server error"}, 500

    db.session.commit()
    board.team_id = team.id
    db.session.commit()
    form_data = request.json

    if form_data:
        form_data["csrf_token"] = request.cookies["csrf_token"]

        if type(form_data["emails"]) is not list:
            return {"message": "Emails must be a list of emails"}, 400

        for email in form_data["emails"]:
            user = User.query.filter(User.email == email).first()

            if user:
                team.users.append(user)

        try:
            db.session.commit()

        except Exception:
            db.session.rollback()
            return {"message": "Internal server error"}, 500

    return {"message": "Team created successfully", "team": team.to_dict()}, 201
