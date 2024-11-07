from flask import Blueprint, request
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
    
    user_list: list[User] = []

    form_data = request.json

    if not form_data:
        return {"message": "Missing form data from request"}, 400

    users = form_data["users"]

    if type(users) is not list:
        return {"message": "Users must be a list of emails"}, 400
    
    for email in users:
        user = User.query.filter(User.email == email).first()

        if user:
            user_list.append(user)

            try: 
                team.users = user_list
                db.session.commit()

            except Exception:
                db.session.rollback()
                return {"message": "Internal server error"}, 500
            
    return {
        "message": "Team updated successfully",
        "team": team.to_dict()
    }, 201


@teams.route("/<int:team_id>", methods=["DELETE"])
@login_required
def delete_team(team_id: int):
    
