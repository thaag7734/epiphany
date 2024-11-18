from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired

class BoardForm(FlaskForm):
      team_id = IntegerField("team_id")
      owner_id = IntegerField("owner_id", validators=[DataRequired()])
      name = StringField("board_name", validators=[DataRequired()])