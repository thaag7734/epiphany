from labels import labels
from notes import notes
from ..app import app



app.register_blueprint(labels)
app.register_blueprint(notes)
