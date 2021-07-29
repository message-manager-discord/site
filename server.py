from blueprints.api import api
import multiprocessing
import os
import pathlib
import secrets
from datetime import datetime, timedelta
import traceback
import sys

from typing import Any, Awaitable

from src.auth import protected, protection

from cryptography.fernet import Fernet
from jinja2 import Environment, FileSystemLoader, Template, select_autoescape
from sanic import Sanic
from sanic.exceptions import Forbidden, Unauthorized
from sanic.request import Request
from sanic.response import HTTPResponse, html, json, redirect
from tortoise.contrib.sanic import register_tortoise

from config import client_id, default_values, running_config, uri

from aiohttp import ClientSession


def get_complete_path(path: str) -> pathlib.Path:
    return pathlib.Path(
        os.path.join(pathlib.Path(__file__).parent.absolute(), pathlib.Path(path))
    )


env = Environment(
    loader=FileSystemLoader(get_complete_path("templates")),
    autoescape=select_autoescape(["html", "xml"]),
    enable_async=True,
)


app = Sanic("Message Manager Site")

app.config.JWT_SECRET = "Secret"
app.config.CSRF_SECRET = Fernet.generate_key()

app.blueprint(api)

register_tortoise(app, db_url=uri, modules={"models": ["models"]})

app.static("/robots.txt", get_complete_path("static/robots.txt"))
app.static("/sitemap.xml", get_complete_path("static/sitemap.xml"))

app.static("/static", get_complete_path("static"))

app.config.default_values = default_values


def render(template: Template, **kwargs: Any) -> Awaitable:
    if "default_values" not in kwargs:
        kwargs["default_values"] = default_values
    return template.render_async(url_for=app.url_for, **kwargs)


@app.route("/")
async def index(request: Request) -> HTTPResponse:
    template = env.get_template("index.html")
    return html(await render(template, title="Home - "))


@app.route("/invite")
async def invite(request: Request) -> HTTPResponse:
    return redirect(app.config.default_values["invite"])


@app.route("/invited")
@protected
async def invited(request: Request) -> HTTPResponse:
    return redirect(app.config.default_values["invite"])


@app.route("/docs")
async def docs(request: Request) -> HTTPResponse:
    return redirect(app.config.default_values["docs"])


@app.route("/privacy")
async def privacy(request: Request) -> HTTPResponse:
    return redirect(app.config.default_values["privacy"])

@app.route("/dashboard", name = "dashboard")
@protected(user_only = True)
async def dashboard(request: Request) -> HTTPResponse:
    return json({"Page": "Dashboard"})

@app.get("/login")
async def login(request: Request) -> HTTPResponse:
    try:
        await protection(request, user_only = True)
    except (Forbidden, Unauthorized) as e:
        print(e)
        state = secrets.token_urlsafe(20)
        response = redirect(f"https://discord.com/api/oauth2/authorize?client_id={client_id}&redirect_uri=http%3A%2F%2Flocalhost%3A7777%2Fapi%2Fv1%2Fcallback&response_type=code&scope=identify%20guilds&state={state}")
        response.cookies["state"] = state
        response.cookies["state"]["httponly"] = True
        response.cookies["state"]["path"] = "/"
        response.cookies["state"]["expires"] = datetime.now() + timedelta(minutes=40)
        response.cookies["state"]["samesite"] = "lax"
        return response

    else:
        return redirect(app.url_for('dashboard'))


@app.exception(Exception)
async def handle_exceptions(request: Request, exception: Exception) -> HTTPResponse:
    traceback.print_exception(
                type(exception), exception, exception.__traceback__, file=sys.stderr
            )
    if isinstance(exception, (Forbidden, Unauthorized)):
        return json(
            {"error": exception.__class__.__name__, "message": str(exception)},
            status=exception.status_code,
        )
    else:
        status_code: int = getattr(exception, "status_code", 500)
        message = str(exception)
        if message == "":
            message = "Unknown exception!"

        template = env.get_template("error.html")
        return html(
            await render(
                template,
                title=f"{status_code} - ",
                error_code=status_code,
                error=message,
            ),
            status=status_code,
        )


@app.on_response
async def disable_floc(request: Request, response: HTTPResponse) -> None:
    response.headers["Permissions-Policy"] = "interest-cohort=()"


if "workers" not in running_config:
    running_config["workers"] = multiprocessing.cpu_count()

@app.before_server_start
async def before_start(app, loop) -> None:
    session = ClientSession(loop = loop)
    app.ctx.session = session

if __name__ == "__main__":
    app.run(**running_config)  # type: ignore
