from flask import Blueprint

labels: Blueprint = Blueprint("labels", __name__, url_prefix="/labels")

@labels.route("/", methods=["GET"])
async def get_labels():
    pass