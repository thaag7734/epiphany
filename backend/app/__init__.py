from os import environ
from flask import Flask, Response, request, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import generate_csrf
from flask_login import LoginManager
from app.models.db import db
from app.models.user import User
from app.api.user_routes import user_routes
from app.api.auth_routes import auth_routes
from app.api.routes.boards import boards
from app.seeds import seed_commands
from app.config import Config

app = Flask(__name__, static_folder="../react-vite/dist", static_url_path="/")

# Setup login manager
login = LoginManager(app)
login.login_view = "auth.unauthorized"


@login.user_loader
def load_user(id):
    return User.query.get(int(id))


# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix="/api/users")
app.register_blueprint(auth_routes, url_prefix="/api/auth")
app.register_blueprint(boards, url_prefix="/api/boards")
db.init_app(app)
Migrate(app, db)

# Application Security
CORS(app)


# Since we are deploying with Docker and Flask,
# we won't be using a buildpack when we deploy to Heroku.
# Therefore, we need to make sure that in production any
# request made over http is redirected to https.
# Well.........
@app.before_request
def https_redirect():
    if environ.get("FLASK_ENV") == "production":
        if request.headers.get("X-Forwarded-Proto") == "http":
            url = request.url.replace("http://", "https://", 1)
            code = 301
            return redirect(url, code=code)


@app.before_request
def check_csrf():
    if not app.config["TESTING"]:
        csrf_token = request.cookies.get("csrf_token")
        form_token = request.form.get("csrf_token")

        if not csrf_token or csrf_token != form_token:
            return Response({"message": "Invalid or missing CSRF token"}, status=400)


@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        "csrf_token",
        generate_csrf(),
        secure=True if environ.get("FLASK_ENV") == "production" else False,
        samesite="Strict" if environ.get("FLASK_ENV") == "production" else None,
        httponly=True,
    )
    return response


@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ["GET", "POST", "PUT", "PATCH", "DELETE"]
    route_list = {
        rule.rule: [
            [method for method in rule.methods if method in acceptable_methods],
            app.view_functions[rule.endpoint].__doc__,
        ]
        for rule in app.url_map.iter_rules()
        if rule.endpoint != "static"
    }
    return route_list


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == "favicon.ico":
        return app.send_from_directory("public", "favicon.ico")
    return app.send_static_file("index.html")


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file("index.html")
