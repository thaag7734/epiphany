import json as JSON
from flask.testing import FlaskClient
from flask_sqlalchemy import SQLAlchemy
from app.models.user import User
from app.models.models import Board, Team, Label
from collections.abc import Callable
from tests.conftest import create_note, login_user


class TestLabelRoutes:
    def test_create_label(
        self, client_db: tuple[FlaskClient, SQLAlchemy], user: Callable[[str], User]
    ) -> None:
        """
        Test the POST /api/boards/:board_id/new_label route to ensure it behaves correctly
        """
        client, db = client_db

        user1 = user("test_user_1")
        user2 = user("test_user_2")
        login_user(client, user1)

        board1: Board = Board.query.get(1)
        board2: Board = Board.query.get(2)

        team = Team(owner_id=user2.id, users=[user1, user2])
        db.session.add(team)
        db.session.commit()

        shared_board = Board(
            name="shared board", owner_id=team.owner_id, team_id=team.id
        )
        db.session.add(shared_board)
        db.session.commit()

        # ensure the user cannot create a label on a board they don't have access to
        res1 = client.post(
            f"/api/boards/{board2.id}/new_label",
            data=JSON.dumps({"name": "doomed label"}),
            content_type="application/json",
        )

        try:
            assert res1.status_code == 403

            new_label: Label | None = Label.query.filter(
                Label.board_id == board2.id
            ).first()
            assert new_label is None
        except AssertionError:
            print("=== Response from server ===\n", res1.data)
            raise

        # ensure the user can create a label on a board they have access to via a team
        res2 = client.post(
            f"/api/boards/{shared_board.id}/new_label",
            data=JSON.dumps({"name": "shared label"}),
            content_type="application/json",
        )

        try:
            assert res2.status_code == 201

            new_label: Label | None = Label.query.filter(
                Label.board_id == shared_board.id
            ).first()
            assert new_label is not None
            assert new_label.name == "shared label"
        except AssertionError:
            print("=== Response from server ===\n", res2.data)
            raise

        # ensure the user can create a label on a board they own
        res3 = client.post(
            f"/api/boards/{board1.id}/new_label",
            data=JSON.dumps({"name": "my label"}),
            content_type="application/json",
        )

        try:
            assert res3.status_code == 201

            new_label: Label | None = Label.query.filter(
                Label.board_id == board1.id
            ).first()
            assert new_label is not None
            assert new_label.name == "my label"
        except AssertionError:
            print("=== Response from server ===\n", res3.data)
            raise
