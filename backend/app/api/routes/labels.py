from flask import Blueprint, request
from flask_login import current_user, login_required
from app.models.models import Label, Team, Board
from app.forms.label_form import LabelForm
from app.models.db import db
from werkzeug.datastructures import ImmutableMultiDict

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


@labels.route("/<int:label_id>/edit", methods=["PUT"])
@login_required
def update_label(label_id: int):
    if not current_user:
        return {"message": "Must be logged in to update a label"}, 401

    label = Label.query.get(label_id)

    if not label:
        return {"message": "Label does not exist Sorry"}, 404

    label_board = Board.query.get(label.board_id)

    if label_board.owner_id != current_user.id:
        return {"message": "This is not your Label"}, 403

    form_data = request.json

    if not form_data:
        return {"message": "Missing form data from request"}, 400

    form_data["csrf_token"].data = request.cookies["csrf_token"]
    form = LabelForm(ImmutableMultiDict(form_data))

    if form.validate():
        try:
            label.name = form.name.data

            db.session.commit()
        except Exception:
            db.session.rollback()
            return {"message": "Internal Server error"}, 500
        else:
            return {
                "message": "Label successfully updated",
                "label": label.to_dict(),
            }, 200
    else:
        return {"errors": form.errors}


@labels.route("/<int:label_id>/delete", methods=["DELETE"])
@login_required
def delete_label(label_id: int):
    if not current_user:
        return {"message": "Must be logged in to delete a label"}, 401

    label = Label.query.get(label_id)

    if not label:
        return {"message": "Label does not exist Sorry"}, 404

    label_board = Board.query.get(label.board_id)

    if label_board.owner_id != current_user.id:
        return {"message": "This is not your Label"}, 403

    try:
        db.session.delete(label)
    except Exception:
        db.session.rollback()
        return {"message": "Internal Server error"}, 500
    else:
        db.session.commit()
        return {"message": "Label successfully deleted"}, 200
