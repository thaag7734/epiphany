import os
from dotenv import load_dotenv


API_BASE_URL = "http://localhost:5000"
TEMP_DIR = os.path.join(os.getcwd(), ".testfiles")
DB_FILE = os.path.join(TEMP_DIR, "dev.db")


class FlaskConfig:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    FLASK_RUN_PORT = 5000
    SQLALCHEMY_DATABASE_URI = "sqlite://" + DB_FILE
    SQLALCHEMY_ECHO = False


print(FlaskConfig.SQLALCHEMY_DATABASE_URI)


if __name__ == "__main__":
    if not os.path.exists(TEMP_DIR):
        os.mkdir(TEMP_DIR)
    elif not os.path.isdir(TEMP_DIR):
        raise IOError(f"{TEMP_DIR} exists but is not a directory!")
