from flask import Blueprint
from flask_login import current_user, login_required

from app.models.models import Label, Team

labels: Blueprint = Blueprint("labels", __name__, url_prefix="/labels")


@labels.route("/<int:id>", methods=["GET"])
@login_required
def get_label(id):
    label: Label = Label.query.get(id)

    if not label:
        return {"message": "Label not found"}, 404

    board = label.board

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
        return {"message": "You do not have permission to access this label"}, 403

    return label.to_dict(), 200
