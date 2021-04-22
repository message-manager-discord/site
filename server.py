import multiprocessing
import os
import pathlib

from typing import Any, Awaitable

from jinja2 import Environment, FileSystemLoader, Template, select_autoescape
from sanic import Sanic
from sanic.request import Request
from sanic.response import HTTPResponse, html, redirect

from config import default_values, running_config


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


@app.route("/docs")
async def docs(request: Request) -> HTTPResponse:
    return redirect(app.config.default_values["docs"])


@app.route("/privacy")
async def privacy(request: Request) -> HTTPResponse:
    return redirect(app.config.default_values["privacy"])


@app.exception(Exception)
async def handle_exceptions(request: Request, exception: Exception) -> HTTPResponse:
    status_code: int = getattr(exception, "status_code", 500)
    message = str(exception)
    if message == "":
        message = "Unknown exception!"

    template = env.get_template("error.html")
    return html(
        await render(
            template, title=f"{status_code} - ", error_code=status_code, error=message
        ),
        status=status_code,
    )


@app.on_response
async def disable_floc(request: Request, response: HTTPResponse) -> None:
    response.headers["Permissions-Policy"] = "interest-cohort=()"


if "workers" not in running_config:
    running_config["workers"] = multiprocessing.cpu_count()

if __name__ == "__main__":
    app.run(**running_config)  # type: ignore
