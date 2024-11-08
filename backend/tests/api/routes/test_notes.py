import json as JSON
from collections.abc import Callable
from flask_login.test_client import FlaskClient
from flask_sqlalchemy import SQLAlchemy
from werkzeug.test import TestResponse

from app.models.models import Board, Note, Team
from app.models.user import User
from tests.conftest import create_note, login_user


class TestNoteRoutes:
    def test_create_note(
        self,
        client_db: tuple[FlaskClient, SQLAlchemy],
        user: Callable[[str], User],
    ) -> None:
        """
        Test the POST /api/boards/:board_id/new_note route to ensure it
        behaves correctly
        """
        client, db = client_db

        user1 = user("test_user_1")
        user2 = user("test_user_2")
        login_user(client, user1)

        board1: Board = Board.query.get(1)
        board2: Board = Board.query.get(2)

        team = Team(owner_id=2, users=[user1, user2])
        db.session.add(team)
        db.session.commit()

        board3 = Board(team_id=team.id, owner_id=2, name="secret third board")
        db.session.add(board3)
        db.session.commit()

        # ensure a user cannot create notes on a board they don't own
        res1 = client.post(
            f"/api/boards/{board2.id}/new_note",
            data=JSON.dumps(
                {
                    "title": "nonexistent",
                    "content": "this note will never exist. sad!",
                    "priority": 0,
                }
            ),
            content_type="application/json",
        )

        try:
            assert res1.status_code == 403
            assert Note.query.get(1) is None
        except AssertionError:
            print("=== Response from server ===\n", res1.data)
            raise

        # ensure a user can create notes on a board they own
        res2 = client.post(
            f"/api/boards/{board1.id}/new_note",
            data=JSON.dumps(
                {
                    "title": "long forgotten",
                    "content": "[insert ancient forbidden knowledge here]",
                    "priority": 3,
                }
            ),
            content_type="application/json",
        )

        try:
            assert res2.status_code == 201

            new_note: Note = Note.query.get(1)
            assert new_note is not None
            assert new_note.title == "long forgotten"
            assert new_note.content == "[insert ancient forbidden knowledge here]"
            assert new_note.priority == 3
        except AssertionError:
            print("=== Response from server ===\n", res2.data)
            raise

        # ensure a user can create notes on a team board that's shared with them
        res3 = client.post(
            f"/api/boards/{board3.id}/new_note",
            data=JSON.dumps(
                {
                    "title": "teamwork teamwork",
                    "content": "everybody do your chores",
                    "priority": 2,
                }
            ),
            content_type="application/json",
        )

        try:
            assert res3.status_code == 201

            new_note: Note = Note.query.get(2)
            assert new_note is not None
            assert new_note.title == "teamwork teamwork"
            assert new_note.content == "everybody do your chores"
            assert new_note.priority == 2
        except AssertionError:
            print("=== Response from server ===\n", res3.data)
            raise

    def test_update_note(
        self, client_db: tuple[FlaskClient, SQLAlchemy], user: Callable[[str], User]
    ) -> None:
        """
        Test the PUT /api/notes/:note_id/edit route to ensure that it behaves correctly
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
            name="shared board", team_id=team.id, owner_id=team.owner_id
        )
        db.session.add(shared_board)
        db.session.commit()

        note1 = create_note(
            db,
            board1,
            title="bad note",
            content="bad notes get taken to the update chamber where they are updated",
        )
        note2 = create_note(
            db,
            board2,
            title="untouchable",
            content="the user will fail to update this board. rip",
        )
        note3 = create_note(
            db, shared_board, title="debate", content="i have an opinion"
        )

        # ensure that a user cannot update a note they don't have access to
        res1 = client.put(
            f"/api/notes/{note2.id}/edit",
            data=JSON.dumps({"title": "uwu", "content": "owo", "priority": 3}),
            content_type="application/json",
        )

        try:
            assert res1.status_code == 403

            new_note2: Note = Note.query.get(note2.id)
            assert new_note2.title == note2.title
            assert new_note2.content == note2.content
            assert new_note2.priority == note2.priority
        except AssertionError:
            print("=== Response from server ===\n", res1.data)
            raise

        # ensure that a user can update a note they own
        res2 = client.put(
            f"/api/notes/{note1.id}/edit",
            data=JSON.dumps({"title": "uwu", "content": "owo", "priority": 3}),
            content_type="application/json",
        )

        try:
            assert res2.status_code == 200

            new_note1: Note = Note.query.get(note1.id)
            assert new_note1.title == "uwu"
            assert new_note1.content == "owo"
            assert new_note1.priority == 3
        except AssertionError:
            print("=== Response from server ===\n", res2.data)
            raise

        # ensure that a user can update a note on a board that's shared with them
        res3 = client.put(
            f"/api/notes/{note3.id}/edit",
            data=JSON.dumps({"title": "uwu", "content": "owo", "priority": 2}),
            content_type="application/json",
        )

        try:
            assert res3.status_code == 200

            new_note3: Note = Note.query.get(note3.id)
            assert new_note3.title == "uwu"
            assert new_note3.content == "owo"
            assert new_note3.priority == 2
        except AssertionError:
            print("=== Response from server ===\n", res3.data)
            raise

    def test_delete_note(
        self, client_db: tuple[FlaskClient, SQLAlchemy], user: Callable[[str], User]
    ) -> None:
        """
        Test the DELETE /api/notes/:note_id/delete route to ensure it behaves correctly
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
            name="shared_board", owner_id=team.owner_id, team_id=team.id
        )
        db.session.add(shared_board)
        db.session.commit()

        note1 = create_note(db, board1, title="to the shredder", priority=1)
        note2 = create_note(db, board2, title="no access", priority=2)
        note3 = create_note(db, shared_board, title="not the owner", priority=3)

        # ensure that a user cannot delete notes they do not have access to
        res1 = client.delete(f"/api/notes/{note2.id}/delete")

        try:
            assert res1.status_code == 403

            new_note2 = Note.query.get(note2.id)
            assert new_note2 is not None
            assert new_note2.title == note2.title
            assert new_note2.board_id == note2.board_id
            assert new_note2.priority == note2.priority
        except AssertionError:
            print("=== Response from server ===\n", res1.data)
            raise

        # ensure that a user cannot delete notes that belong to a team they do not own
        res2 = client.delete(f"/api/notes/{note3.id}/delete")

        try:
            assert res2.status_code == 403

            new_note3 = Note.query.get(note3.id)
            assert new_note3 is not None
            assert new_note3.title == note3.title
            assert new_note3.board_id == note3.board_id
            assert new_note3.priority == note3.priority
        except AssertionError:
            print("=== Response from server ===\n", res2.data)
            raise

        # ensure that a user can delete notes they own
        res3 = client.delete(f"/api/notes/{note1.id}/delete")

        try:
            assert res3.status_code == 200

            new_note1 = Note.query.get(note1.id)
            assert new_note1 is None
        except AssertionError:
            print("=== Response from server ===\n", res3.data)
            raise
