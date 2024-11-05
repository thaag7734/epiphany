from flask import Blueprint
from app.models.models import Board

boards: Blueprint = Blueprint("boards", __name__, url_prefix="/boards")

@boards.route('/')
def getUserBoards():
      