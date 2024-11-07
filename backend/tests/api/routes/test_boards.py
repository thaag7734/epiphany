import json as JSON
from collections.abc import Callable
from flask.testing import FlaskClient
from flask_sqlalchemy import SQLAlchemy

from app.models.models import Board
from app.models.user import User
from tests.conftest import login_user, create_board


class TestBoardRoutes:
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

        boards = [create_board(db, user1, name=f"board_{x}") for x in range(0, 5)]
        [create_board(db, user2, name=f"other_board_{x}") for x in range(0, 5)]

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

    def test_update_board(
        self, user: Callable[[str], User], client_db: tuple[FlaskClient, SQLAlchemy]
    ) -> None:
        """
        Test the PUT /api/boards/:id route to ensure that it updates the data correctly
        """
        client, _ = client_db

        user1 = user("test_user_1")
        user("test_user_2")
        login_user(client, user1)

        board1: Board = Board.query.get(1)
        board2: Board = Board.query.get(2)

        # ensure user can't update other users' boards
        res1 = client.put(
            f"/api/boards/{board2.id}",
            data=JSON.dumps({"owner_id": 1, "name": "hijacked"}),
            content_type="application/json",
        )

        try:
            assert res1.status_code == 403

            new_board2 = Board.query.get(2)
            assert new_board2.name == board2.name
            assert new_board2.owner_id == 2
        except AssertionError:
            print("=== Response from server ===\n", res1.data)
            raise

        # ensure user can't transfer ownership of a board to an arbitrary user id
        res2 = client.put(
            f"/api/boards/{board1.id}",
            data=JSON.dumps({"owner_id": 2, "name": "failed the reverse pickpocket"}),
            content_type="application/json",
        )

        try:
            assert res2.status_code == 200

            new_board1 = Board.query.get(1)
            assert new_board1.name == "failed the reverse pickpocket"
            assert new_board1.owner_id == 1
        except AssertionError:
            print("=== Response from server ===\n", res2.data)
            raise

        # ensure user can update their own board
        res3 = client.put(
            f"/api/boards/{board1.id}",
            data=JSON.dumps({"name": "alter ego"}),
            content_type="application/json",
        )

        try:
            assert res3.status_code == 200

            new_board1 = Board.query.get(1)
            assert new_board1.name == "alter ego"
            assert new_board1.owner_id == 1

            json = res3.json
            assert json is not None
            assert "message" in json
            assert "board" in json

            assert type(json["message"]) is str
            assert type(json["board"]) is dict

            assert "success" in json["message"].lower()

            for key in ["id", "owner_id", "name", "team", "labels", "notes", "owner"]:
                assert key in json["board"]
        except AssertionError:
            print("=== Response from server ===\n", res3.data)
            raise

    def test_delete_board(
        self, user: Callable[[str], User], client_db: tuple[FlaskClient, SQLAlchemy]
    ) -> None:
        """
        Test the DELETE /api/boards/:id route to ensure that it behaves properly
        """
        client, db = client_db

        user1 = user("test_user_1")
        user2 = user("test_user_2")
        login_user(client, user1)

        # TODO replace this with something better in the user fixture
        root_board: Board = Board.query.get(1)
        board1: Board = Board(name="to_be_deleted", owner_id=user1.id)
        board2: Board = Board(name="invinciboard", owner_id=user2.id)

        db.session.add(board1)
        db.session.add(board2)
        db.session.commit()

        # ensure user can't delete the root board
        res1 = client.delete(f"/api/boards/{root_board.id}")

        try:
            assert res1.status_code == 403
            assert Board.query.get(board1.id).name == board1.name
        except Exception:
            print("=== Response from server ===\n", res1.data)
            raise

        # ensure user can't delete other users' boards
        res2 = client.delete(f"/api/boards/{board2.id}")

        try:
            assert res2.status_code == 403
            assert Board.query.get(board2.id).name == board2.name
        except:
            print("=== Response from server ===\n", res2.data)
            raise

        # ensure user can delete their own boards if they aren't the root board
        res3 = client.delete(f"/api/boards/{board1.id}")

        try:
            assert res3.status_code == 200
            assert Board.query.get(board1.id) is None
        except:
            print("=== Response from server ===\n", res2.data)
            raise
