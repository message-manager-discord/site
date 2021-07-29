from .auth import auth_blueprint
from sanic import Blueprint

api = Blueprint.group(auth_blueprint, version = 1, version_prefix="/api/v")