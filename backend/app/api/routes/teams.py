from flask import Blueprint, request
from werkzeug.datastructures import ImmutableMultiDict
from app.forms.team_form import TeamForm
from app.models.models import Board, Team
from app.models.db import db
from flask_login import login_required, current_user
from app.models.user import User


teams: Blueprint = Blueprint("teams", __name__, url_prefix="/teams")


@teams.route("/<int:team_id>/users", methods=["PUT"])
@login_required
def modify_team_users(team_id: int):
    team: Team = Team.query.get(team_id)

    if not team:
        return {"message": "Team not found"}, 404

    if team.owner_id != current_user.id:
        return {"message": "You are not authorized to modify this team"}, 403

    user_list: list[User] = [User.query.get(current_user.id)]

    form_data = request.json

    if not form_data:
        return {"message": "Missing form data from request"}, 400

    processed_form_data = {
        f"emails-{i}": email for i, email in enumerate(form_data["emails"])
    }

    form = TeamForm(ImmutableMultiDict(processed_form_data))
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate():
        for entry in form.emails.entries:
            user = User.query.filter(User.email == entry.data).first()

            if user:
                user_list.append(user)

        try:
            team.users = user_list
            db.session.commit()

        except Exception:
            db.session.rollback()
            return {"message": "Internal server error"}, 500
        else:
            return {"message": "Team updated successfully", "team": team.to_dict()}, 200
    else:
        return {"errors": form.errors}, 400


@teams.route("/<int:team_id>", methods=["DELETE"])
@login_required
def delete_team(team_id: int):
    team: Team = Team.query.get(team_id)

    if not team:
        return {"message": "Team not found"}, 404

    if team.owner_id != current_user.id:
        return {"message": "This is not your Team"}, 403

    try:
        db.session.delete(team)

    except Exception:
        db.session.rollback()
        return {"message": "Internal server error"}, 500

    else:
        db.session.commit()

    return {"message": "Team deleted successfully"}, 200
