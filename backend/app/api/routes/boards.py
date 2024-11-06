from flask import Blueprint, request
from app.models.models import Board
from app.models.db import db
from flask_login import login_required, current_user
from app.forms.board_form import BoardForm

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
    form = BoardForm(form_data)

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
                "message": "New Board succesfully created",
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

    form_data["owner_id"] = current_user.id
    form = BoardForm(form_data)

    if form.validate():
        try:
            board.team_id = (form.team_id.data,)
            board.owner_id = (form.owner_id.data,)
            board.name = form.name.data

            db.session.commit()

        except Exception:
            db.session.rollback()
            return {"message": "Internal Server error"}, 500

        else:
            return {
                "message": "New Board succesfully updated",
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

    try:
        db.session.delete(board)

    except Exception:
        db.session.rollback()
        return {"message": "Internal Server error"}, 500
    else:
        db.session.commit()
        return {"message": "New Board succesfully deleted"}, 201
