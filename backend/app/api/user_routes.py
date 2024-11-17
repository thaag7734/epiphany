from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models.db import db
from app.models.models import Board
from app.models.user import User

user_routes = Blueprint("users", __name__)


@user_routes.route("/")
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {"users": [user.to_dict() for user in users]}


@user_routes.route("/<int:id>")
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary
    """
    user = User.query.get(id)
    return user.to_dict()


@user_routes.route("/boards")
@login_required
def get_user_boards():
    user = User.query.get(current_user.id)

    return {
        "boards": [
            *[board.to_dict() for board in user.boards],
            *[board.to_dict() for board in (team.board for team in user.teams)],
        ]
    }, 200


@user_routes.route("/boards/set_root", methods=["PUT"])
@login_required
def set_root_board():
    data = request.json

    if not (data and data["board_id"]):
        return {"message": "You must provide a board ID"}, 400

    board = Board.query.get(data["board_id"])

    if not board:
        return {"message": "Board not found"}, 404

    if board.owner_id != current_user.id:
        return {
            "message": "You cannot set a board you don't own as your home board"
        }, 403

    try:
        current_user.root_board_id = board.id
        db.session.commit()
    except Exception:
        db.session.rollback()
        return {"message": "Internal server error"}, 500

    return {"message": "Home board set successfully"}
