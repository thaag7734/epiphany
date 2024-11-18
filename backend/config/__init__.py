from flask_wtf import FlaskForm
from os import environ

class Config(FlaskForm):
   SECRET_KEY = environ.get("SECRET_KEY")
   FLASK_DATABASE_URI = 'sqlite:///dev.db'