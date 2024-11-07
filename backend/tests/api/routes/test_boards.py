import json as JSON
from collections.abc import Callable
from flask.testing import FlaskClient
from flask_sqlalchemy import SQLAlchemy

from app.config import Config
from app.models.user import User
from tests.conftest import login_user, create_board


class TestBoardRoutes:
    def test_has_db_config(self) -> None:
        """Check to make sure the db url is set correctly"""

        # TODO account for using postgres here
        for component in ["sqlite:///", "dev.db"]:
            assert component in Config.SQLALCHEMY_DATABASE_URI

    def test_get_by_id(
        self,
        user: Callable[[str], User],
        client_db: tuple[FlaskClient, SQLAlchemy],
    ) -> None:
        """
        Test the GET /api/boards/:id route to ensure that it returns
        the correct information
        """
        client, _ = client_db

        test_user = user("test_user")
        login_user(client, test_user)

        res = client.get("/api/boards/1")
        json = None

        try:
            assert res.status_code == 200

            json = res.json
            assert json is not None

            assert json["name"] == "test board"
            assert json["owner_id"] == test_user.id
        except AssertionError:
            print("=== Response from server ===\n", res.data)
            raise

    def test_get_user_boards(
        self,
        user: Callable[[str], User],
        client_db: tuple[FlaskClient, SQLAlchemy],
    ) -> None:
        """
        Test the GET /api/users/:id/boards route to ensure that it
        returns the correct information
        """
        client, db = client_db

        user1 = user("test_user_1")
        user2 = user("test_user_2")

        login_user(client, user1)

        boards = [create_board(db, user1, f"board_{x}") for x in range(0, 5)]
        [create_board(db, user2, f"other_board_{x}") for x in range(0, 5)]

        res = client.get(f"/api/users/{user1.id}/boards")
        json = None

        try:
            assert res.status_code == 200

            json = res.json
            assert json is not None
            assert "boards" in json
        except AssertionError:
            print("=== Response from server ===\n", res.data)
            raise

        res_boards = json["boards"]
        assert type(res_boards) is list

        for board in boards:
            board_name_found = False

            for res_board in res_boards:
                assert res_board["owner_id"] == user1.id

                if res_board["name"] == board.name:
                    board_name_found = True

            assert board_name_found

    def test_create_board(
        self, user: Callable[[str], User], client_db: tuple[FlaskClient, SQLAlchemy]
    ) -> None:
        """
        Test the POST /api/boards/new route to ensure that it creates
        a board with the provided information
        """
        client, _ = client_db

        test_user = user("test_user")
        login_user(client, test_user)

        board_data = {
            "name": "test_board_name",
            "owner_id": test_user.id,
        }

        res = client.post(
            "/api/boards/new",
            data=JSON.dumps(board_data),
            content_type="application/json",
        )
        try:
            assert res.status_code == 201

            json = res.json
            assert json is not None
            assert "message" in json
            assert "board" in json

            assert type(json["message"]) is str
            assert type(json["board"]) is dict

            assert "success" in json["message"].lower()

            for key in ["id", "owner_id", "name", "team", "labels", "notes", "owner"]:
                assert key in json["board"]
        except AssertionError:
            print("=== Response from server ===\n", res.data)
            raise

        assert json["board"]["name"] == board_data["name"]
        assert json["board"]["owner_id"] == board_data["owner_id"]
