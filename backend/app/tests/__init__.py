from flask import Flask
import os
from flask_sqlalchemy import SQLAlchemy
from app.api import user_routes, auth_routes
from app.api.routes import boards, labels, notes, teams
from app.api.forms import board_form, login_form, signup_form


API_BASE_URL = "http://localhost:5000"
TEMP_DIR = os.path.join(os.getcwd(), ".testfiles")
DB_FILE = os.path.join(TEMP_DIR, "dev.db")


class FlaskConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    FLASK_RUN_PORT = 5000
    SQLALCHEMY_DATABASE_URI = DB_FILE
    SQLALCHEMY_ECHO = False


app = None
db = None

if __name__ == "__main__":
    if not os.path.exists(TEMP_DIR):
        os.mkdir(TEMP_DIR)
    elif not os.path.isdir(TEMP_DIR):
        raise IOError(f"{TEMP_DIR} exists but is not a directory!")

    app = Flask(__name__)
    app.config.from_object(FlaskConfig)
    app.register_blueprint(user_routes.user_routes, url_prefix="/api/users")
    app.register_blueprint(auth_routes.auth_routes, url_prefix="/api/auth")
    app.register_blueprint(boards.boards, url_prefix="/api/boards")
    db = SQLAlchemy(app)
