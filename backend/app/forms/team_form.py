from flask_wtf import FlaskForm
from wtforms import FieldList, IntegerField, StringField
from wtforms.validators import DataRequired

from app.forms.login_form import user_exists


class TeamForm(FlaskForm):
    emails = FieldList(StringField("emails", validators=[DataRequired(), user_exists]))
