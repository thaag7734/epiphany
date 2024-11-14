from flask_sqlalchemy import SQLAlchemy as sa
from dotenv import load_dotenv
import os

load_dotenv()

environment = os.environ.get("FLASK_ENV")
SCHEMA = os.environ.get("SCHEMA")


db: sa = sa()


# helper function for adding prefix to foreign key column references in production
def add_prefix_for_prod(attr):
    if environment == "production":
        return f"{SCHEMA}.{attr}"
    else:
        return attr
