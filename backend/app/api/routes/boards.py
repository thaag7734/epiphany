from flask import Blueprint, Response, request
from app.models.models import Board
from app.models.db import db
from flask_login import login_required, current_user
from forms.board_form import BoardForm

boards: Blueprint = Blueprint("boards", __name__, url_prefix="/boards")


@boards.route('/<int:board_id>')
@login_required
def get_board(board_id):
      board = Board.query.get(board_id)
      if not board:
            return Response({"message": "Board does not exist Sorry"}, status=404)
      if board.owner_id != current_user.id:
            return Response({"message": "This is not your board"}, status=403)
      return board.to_dict()


@boards.route('/new', methods=["POST"])
@login_required
def create_board():
      form_data = request.json.to_dict()
      form_data["owner_id"]=current_user.id
      form = BoardForm(form_data)

      if not current_user:
            return Response({"message":"Must be logged in to create a board"}, status=401)

      if form.validate():
            new_board = Board(
                  team_id = form.team_id.data,
                  owner_id = form.owner_id.data,
                  name = form.name.data
            )

            try:
                  db.session.add(new_board)
            except:
                  db.session.rollback()
                  return Response({"message":"Internal Server error"}, status=500)
            else:
                  db.session.commit()
                  return Response({"message":"New Board succesfully created","board": new_board}, status=201)
            
      else:
            return Response({"message":"Failed to create new board"}, status=400)


@boards.route("/<int:board_id>", methods=["PUT"])
@login_required
def update_board(board_id):
      if not current_user:
            return Response({"message":"Must be logged in to update a board"}, status=401)
      
      board = Board.query.get(board_id)
      
      if not board: 
            return Response({"message": "Board does not exist Sorry"}, status=404)

      if board.owner_id != current_user.id: 
            return Response({"message": "This is not your board"}, status=403)

      form_data = request.json.to_dict()
      form_data["owner_id"]=current_user.id
      form = BoardForm(form_data)

      if form.validate():
                  
            try:
                  board.team_id = form.team_id.data,
                  board.owner_id = form.owner_id.data,
                  board.name = form.name.data

                  db.session.commit()

            except:
                  db.session.rollback()
                  return Response({"message":"Internal Server error"}, status=500)
            
            else:
                  return Response({"message":"New Board succesfully updated","board": board}, status=200)
            
      else:
            return Response({"message":"Failed to create new board"}, status=400)
      

@boards.route("/<int:board_id>", methods=["DELETE"])
@login_required
def delete_board(board_id):
      if not current_user:
            return Response({"message":"Must be logged in to update a board"}, status=401)
      
      board = Board.query.get(board_id)
      
      if not board: 
            return Response({"message": "Board does not exist Sorry"}, status=404)

      if board.owner_id != current_user.id: 
            return Response({"message": "This is not your board"}, status=403)
      
      try: 
            db.session.delete(board)

      except:
                  db.session.rollback()
                  return Response({"message":"Internal Server error"}, status=500)
      else:
            db.session.commit()
            return Response({"message":"New Board succesfully deleted"}, status=201)