from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField, TextAreaField, DateField, validators
from wtforms.validators import DataRequired, length, NumberRange


class NoteForm(FlaskForm):
    title = StringField("title", validators=[DataRequired(), length(1, 32)])
    content = TextAreaField("content")
    deadline = DateField("deadline")
    priority = IntegerField("priority", validators=[NumberRange(0, 3)])
    board_id = IntegerField("board_id", validators=[DataRequired()])
