from aiohttp import ClientSession
from config import client_id, client_secret

DISCORD_API_BASE = "https://discord.com/api/v9"

__all__ = ["exchange_code"]


async def exchange_code(code: str, session: ClientSession):
    data = {
        'client_id': client_id,
        'client_secret': client_secret,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': "http://localhost:7777/api/v1/callback"
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    async with session.post(url = f"{DISCORD_API_BASE}/oauth2/token", data = data, headers = headers) as r:
        return await r.json()

async def refresh_token(refresh_token: str, session: ClientSession):
    data = {
        'client_id': client_id,
        'client_secret': client_secret,
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    async with session.post(url = f"{DISCORD_API_BASE}/oauth2/token", data = data, headers = headers) as r:
        return await r.json()

async def identify_user(token: str, session:ClientSession):
    headers = {
        'Authorization': f'Bearer {token}'
    }
    async with session.get(url = f"{DISCORD_API_BASE}/users/@me", headers = headers) as r:
        return await r.json()

async def get_guilds(token: str, session: ClientSession):
    headers = {
        'Authorization': f'Bearer {token}'
    }
    async with session.get(url = f"{DISCORD_API_BASE}/users/@me/guilds", headers = headers) as r:
        return await r.json()