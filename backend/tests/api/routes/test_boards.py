from flask.testing import FlaskClient
import sqlite3
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy

from app.config import Config
from app.models.user import User
from tests.conftest import login_user

load_dotenv()


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

        json = res.json

        # technically we can replace this with `assert res.is_json`
        # but my linter doesn't like it
        assert json is not None

        res_data = json.to_dict()

        assert res_data["name"] == "test board"
        assert res_data["owner_id"] == user.id
