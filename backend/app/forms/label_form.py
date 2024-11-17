from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired


class LabelForm(FlaskForm):
    name = StringField("name", validators=[DataRequired()])
    board_id = IntegerField("board_id", validators=[DataRequired()])
