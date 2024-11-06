from collections.abc import Generator
from flask import Request
from flask.testing import FlaskClient
from flask_sqlalchemy import SQLAlchemy
from flask_wtf import FlaskForm
from werkzeug.security import generate_password_hash
from werkzeug.test import TestResponse
from app.forms.login_form import LoginForm
from app.models.user import User
from app.models.models import Board
from app import app, db
import pytest


TEST_PASSWORD = "test_password"


@pytest.fixture(scope="module")
def client_db() -> Generator[tuple[FlaskClient, SQLAlchemy], None, None]:
    app.config["TESTING"] = True
    app.config["WTF_CSRF_ENABLED"] = False
    app.config["DEBUG"] = False
    app.config["SQLALCHEMY_ECHO"] = False
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"

    with app.test_client() as client:
        with app.app_context():
            db.engine.dispose()
            db.init_app(app)

            db.create_all()
            yield (client, db)


@pytest.fixture(scope="module")
def user(client_db: tuple[FlaskClient, SQLAlchemy]) -> Generator[User, None, None]:
    db = client_db[1]

    new_user = User(
        username="test_user",
        email="test_email@test.test",
        password=TEST_PASSWORD,
    )

    db.session.add(new_user)
    db.session.commit()

    # TODO find an elegant way to make the properties of the board accessible
    # to tests that use this fixture
    new_board = Board(owner_id=new_user.id, name="test board")

    db.session.add(new_board)
    db.session.commit()

    yield new_user


def login_user(client: FlaskClient, user: User) -> Request:
    res: TestResponse = client.post(
        "/api/auth/login",
        data={
            "email": user.email,
            "password": TEST_PASSWORD,
        },
        content_type="application/x-www-form-urlencoded",
    )

    print("REQUEST ===>", res.request)
    print("RES DATA ===>", res.data)
