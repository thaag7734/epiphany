from collections.abc import Generator
from flask.testing import FlaskClient
from werkzeug.security import generate_password_hash
from app.config import Config
from app.models.user import User
from app.models.models import Board
import pytest
from sqlite3 import Cursor, connect


@pytest.fixture(scope="module")
def client() -> Generator[FlaskClient, None, None]:
    from app import app

    app.config["TESTING"] = True
    app.config["WTF_CSRF_ENABLED"] = False
    app.config["DEBUG"] = False

    with app.test_client() as client:
        with app.app_context():
            from app.models.db import db

            db.drop_all()
            db.create_all()
        yield client


@pytest.fixture(scope="module")
def cursor() -> Generator[Cursor, None, None]:
    with connect(Config.SQLALCHEMY_DATABASE_URI) as con:
        yield con.cursor()


@pytest.fixture(scope="module")
def userInstance(client: FlaskClient, cur: Cursor) -> Generator[User, None, None]:
    username = "test_user"
    email = "test_email@test.test"
    password = generate_password_hash("test_password")

    cur.execute(
        f"INSERT INTO users (username, email, hashed_password, root_board_id) VALUES ('{username}', '{email}', {password})"
    )

    # TODO finish this
