# error_handlers.py
"""
Message Manager - A bot for discord
Copyright (C) 2020  AnotherCat

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
"""
from quart import Blueprint, render_template

blueprint = Blueprint("error_handlers", __name__)


@blueprint.app_errorhandler(404)
async def handle404() -> str:
    return await render_template(
        "error.html", title="404 - ", error_code=404, error="That page does not exist!"
    )
