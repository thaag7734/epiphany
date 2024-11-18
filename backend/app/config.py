from os import environ
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = environ.get("SECRET_KEY")
    FLASK_RUN_PORT = environ.get("FLASK_RUN_PORT")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    # SQLAlchemy 1.4 no longer supports url strings that start with 'postgres'
    # (only 'postgresql') but heroku's postgres add-on automatically sets the
    # url in the hidden config vars to start with postgres.
    # so the connection uri must be updated here (for production)
    SQLALCHEMY_DATABASE_URI = (
        environ.get("DATABASE_URL").replace("postgres://", "postgresql://")
        if environ.get("DATABASE_URL")
        else "sqlite:///dev.db"
    )
    SQLALCHEMY_ECHO = True
