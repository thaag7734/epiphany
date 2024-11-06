from flask.testing import FlaskClient
import pytest
import sqlite3
from dotenv import load_dotenv

from app.config import Config
from tests import DB_FILE

load_dotenv()


class TestBoardRoutes:
    def has_db_config(self) -> None:
        for component in ["sqlite:///", "dev.db"]:
            assert component in Config.SQLALCHEMY_DATABASE_URI

    def get_by_id(self, client: FlaskClient) -> None:
        con = sqlite3.connect(Config.SQLALCHEMY_DATABASE_URI)

        with con.cursor() as cur:
            cur.execute("INSERT INTO boards (team_id, owner_id, name) VALUES ()")

        res = client.get("/api/boards/1")
