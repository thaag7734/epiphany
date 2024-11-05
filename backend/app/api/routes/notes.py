from flask import Blueprint
from app.models.models import Note

notes: Blueprint = Blueprint("notes", __name__, url_prefix="/notes")

@notes.route("/", methods=["GET"])
def get_labels():
    pass

    # curr_board = 
    # all_notes = Note.query