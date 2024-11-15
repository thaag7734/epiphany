from flask_wtf import FlaskForm
from wtforms import FieldList, IntegerField, StringField
from wtforms.validators import DataRequired


class TeamForm(FlaskForm):
    emails = FieldList(StringField("emails", validators=[DataRequired()]))
