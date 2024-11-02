from .db import db
from .config import Config
from flask import Flask

app: Flask = Flask()

app.config.from_object(Config())
db.init_app(app)