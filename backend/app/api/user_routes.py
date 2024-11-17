from flask import Blueprint, jsonify
from flask_login import current_user, login_required
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

    for team in user.teams:
        print(team.board)

    return {
        "boards": [
            *[board.to_dict() for board in user.boards],
            *[board.to_dict() for board in (team.board for team in user.teams)],
        ]
    }, 200
