from flask import Blueprint, make_response, request, session
from app.api.user_routes import create_tutorial_board
from app.models.models import db
from app.models.user import User
from app.models.models import Board
from app.forms import LoginForm
from app.forms import SignUpForm
from flask_login import current_user, login_user, logout_user, login_required

auth_routes = Blueprint("auth", __name__)


@auth_routes.route("/")
def authenticate():
    """
    Authenticates a user.
    """
    if current_user.is_authenticated:
        return current_user.to_dict()
    return {"errors": {"message": "Unauthorized"}}, 401


@auth_routes.route("/login", methods=["POST"])
def login():
    """
    Logs a user in
    """
    form = LoginForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    # Get the csrf_token from the request cookie and put it into the
    # form manually to validate_on_submit can be used
    if form.validate_on_submit():
        # Add the user to the session, we are logged in!
        user = User.query.filter(User.email == form.data["email"]).first()
        login_user(user)
        return user.to_dict()
    return {"errors": form.errors}, 401


@auth_routes.route("/logout")
def logout():
    """
    Logs a user out
    """
    logout_user()
    session.clear()
    [session.pop(key) for key in list(session.keys())]
    response = make_response()
    # response.set_cookie("session", "", expires=0)
    response.delete_cookie("session")
    return response


@auth_routes.route("/signup", methods=["POST"])
def sign_up():
    """
    Creates a new user and logs them in
    """
    form = SignUpForm()
    form["csrf_token"].data = request.cookies["csrf_token"]
    if form.validate_on_submit():
        user = User(
            username=form.data["username"],
            email=form.data["email"],
            password=form.data["password"],
        )
        db.session.add(user)
        db.session.commit()

        board = create_tutorial_board(user)
        user.root_board_id = board.id
        db.session.add(user)
        db.session.commit()

        login_user(user)
        return user.to_dict()
    return {"errors": form.errors}, 401


@auth_routes.route("/unauthorized")
def unauthorized():
    """
    Returns unauthorized JSON when flask-login authentication fails
    """
    return {"errors": {"message": "Unauthorized"}}, 401
