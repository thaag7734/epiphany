from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required
from app.models.db import db
from app.models.models import Board, Label, Note
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
            *[
                board.to_dict()
                for board in [team.board for team in user.teams]
                if board is not None
            ],
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


def create_tutorial_board(user: User) -> Board:
    board = Board(owner_id=user.id, name=f"Welcome, {user.username}!")
    db.session.add(board)
    db.session.commit()

    note = Note(
        board_id=board.id,
        title="Welcome to Epiphany!",
        content="""You can view and manage your boards by clicking 'Manage Boards' in the dropdown menu at the top right of the screen. Each board can have any number of notes, and each note can have any number of labels attached to it. Labels and notes are not shared between boards, so you can easily organize your thoughts into categories of different sizes. To edit a label, you can double-click on it in the side panel.

Collaborating with other users is easy with teams! Teams are limited to sharing only one board, but there is no limit to the amount of boards or teams that you can have. When sharing a board with a team, only the owner can do things like delete notes or assign labels, but anyone can edit the notes. You can create a team on a particular board by clicking the 'Create Team' button in the dropdown on that board's page. If you want to stop sharing a board, you can simply delete the team and all content on your board will remain available to you.

If you want to delete a board, you can do so on the 'Manage Boards' page by clicking and holding its delete button for 1.5 seconds. You can delete labels the same way in the side panel.""",
        priority=1,
    )
    db.session.add(note)
    db.session.commit()

    label = Label(board_id=board.id, name="I'm a label!")
    db.session.add(label)
    db.session.commit()

    note.labels = [
        label,
    ]
    db.session.commit()

    return board
