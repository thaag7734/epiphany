from collections.abc import Callable, Generator
from flask.testing import FlaskClient
from flask_sqlalchemy import SQLAlchemy
from werkzeug.test import TestResponse
from app.models.user import User
from app.models.models import Board, Note
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


@pytest.fixture(autouse=True)
def clean_session(client_db: tuple[FlaskClient, SQLAlchemy]) -> None:
    db = client_db[1]

    db.session.rollback()
    db.session.expunge_all()

    db.drop_all()
    db.create_all()

    db.session.remove()


@pytest.fixture()
def user(
    client_db: tuple[FlaskClient, SQLAlchemy],
) -> Callable[[str], User]:
    def create_user(username: str) -> User:
        db = client_db[1]

        new_user = User(
            username=username,
            email=f"{username}@test.test",
            password=TEST_PASSWORD,
        )

        db.session.add(new_user)
        db.session.commit()

        # TODO find an elegant way to make the properties of the board accessible
        # to tests that use this fixture
        new_board = Board(owner_id=new_user.id, name="test board")

        db.session.add(new_board)
        db.session.commit()

        new_user.root_board_id = new_board.id
        db.session.commit()

        return new_user

    return create_user


def login_user(client: FlaskClient, user: User) -> TestResponse:
    return client.post(
        "/api/auth/login",
        data={
            "email": user.email,
            "password": TEST_PASSWORD,
        },
        content_type="application/x-www-form-urlencoded",
    )


def create_board(db: SQLAlchemy, owner: User, *, name: str, depth: int = 0) -> Board:
    if depth == 4:
        raise Exception("Board creation failed too many times!")
    elif depth > 0:
        print(f"Board creation failed, retrying ({depth}/3)")

    board = Board(name=name, owner_id=owner.id)

    try:
        db.session.add(board)
    except Exception:
        db.session.rollback()
        create_board(db, owner, name=name, depth=depth + 1)

    return board
