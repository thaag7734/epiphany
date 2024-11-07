from flask.testing import FlaskClient
from flask_sqlalchemy import SQLAlchemy

from app.config import Config
from app.models.user import User
from tests.conftest import login_user


class TestBoardRoutes:
    def test_has_db_config(self) -> None:
        """check to make sure the db url is set correctly"""

        # TODO account for using postgres here
        for component in ["sqlite:///", "dev.db"]:
            assert component in Config.SQLALCHEMY_DATABASE_URI

    def test_get_by_id(
        self, user: User, client_db: tuple[FlaskClient, SQLAlchemy]
    ) -> None:
        """
        test the GET /api/boards/:id route to ensure that it returns
        the correct information
        """
        client = client_db[0]
        # db = client_db[1]

        login_user(client, user)

        res = client.get("/api/boards/1")

        assert res.status_code == 200

        json = res.json

        # technically we can replace this with `assert res.is_json`
        # but my linter doesn't like it
        assert json is not None

        assert json["name"] == "test board"
        assert json["owner_id"] == user.id
