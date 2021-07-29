import jwt
from models import User
from sanic import Blueprint
from sanic.request import Request
from sanic.response import HTTPResponse, json, redirect
from datetime import datetime, timedelta
from src import discord_oauth

auth_blueprint = Blueprint(name = "Auth Blueprint")

from src.auth import create_auth_token, extract_token, make_auth_response, protected


@auth_blueprint.get("/auth")
async def do_auth(request: Request) -> HTTPResponse:
    """This is our "login" method. Hitting it sets the cookies."""
    user_id = 3 # This needs to be got from the discord api
    token = await create_auth_token(request, user_id)
    # Generate our authentication response
    response = json({"access_token": token})
    response = make_auth_response(token, csrf_secret=request.app.config.CSRF_SECRET, response = response)

    return response

@auth_blueprint.get("/callback")
async def callback(request: Request) -> HTTPResponse:
    code = request.args.get("code")
    discord_state = request.args.get("state")
    cookie_state = request.cookies.get("state", None)
    if discord_state != cookie_state or discord_state is None or cookie_state is None:
        return json({"error": "State changed during authorization, please try again"}, status = 400)
    r = await discord_oauth.exchange_code(code = code, session = request.app.ctx.session)
    token = r['access_token']
    user = await discord_oauth.identify_user(token = token, session = request.app.ctx.session)
    user_token = await create_auth_token(request, int(user['id']))
    print(user)
    await User.update_or_create(
        id = user['id'],
        defaults = {
            "access_token": token,
            "refresh_token": r['refresh_token'],
            "access_expires_at": (datetime.now() + timedelta(seconds = r['expires_in']))
        },
    )
    response = redirect(request.app.url_for("dashboard"))
    response = make_auth_response(user_token, csrf_secret=request.app.config.CSRF_SECRET, response = response)
    return response
    
@auth_blueprint.get('/me')
@protected
async def me(request: Request) -> HTTPResponse:
    token = extract_token(request)
    payload = jwt.decode(
        token, request.app.config.JWT_SECRET, algorithms=["HS256"]
    )
    user_id = payload['uid']
    user = await User.get(id = user_id)
    if False and user.access_expires_at.timestamp() > datetime.now().timestamp():
        refresh_response = await discord_oauth.refresh_token(user.refresh_token, session = request.app.ctx.session)
        user.access_token = refresh_response['access_token']
        user.access_expires_at = datetime.now() + timedelta(seconds = refresh_response['expires_in'])
        await user.save()
    
    discord_response: dict = await discord_oauth.identify_user(token = user.access_token, session = request.app.ctx.session)
    discord_response['avatar_url'] = f"https://cdn.discordapp.com/avatars/{user.id}/{discord_response['avatar']}.png"
    discord_response['full_name'] = f"{discord_response['username']}#{discord_response['discriminator']}"
    return json(discord_response)

@auth_blueprint.route("/pro", ["GET", "POST"])
@protected(user_only = True)
async def pro(request: Request) -> HTTPResponse:
    return json({"Yay": "hi"})
