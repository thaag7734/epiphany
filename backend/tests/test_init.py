from app.config import Config


class TestAppInitialization:
    def test_has_db_config(self) -> None:
        """Check to make sure the db url is set correctly"""

        # TODO account for using postgres here
        for component in ["sqlite:///", "dev.db"]:
            assert component in Config.SQLALCHEMY_DATABASE_URI
