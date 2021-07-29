from typing import Any, Callable, Optional, Union
import jwt
from enum import Enum
from sanic.request import Request
from cryptography.fernet import Fernet, InvalidToken
from sanic.log import logger
import os
from datetime import datetime, timedelta
from base64 import b64decode, b64encode

from sanic.response import HTTPResponse, json
from models import User
from sanic.exceptions import Forbidden, Unauthorized

EPOCH = 1622419200

CSRF_REF_BYTES = 16

HTTP_UNSAFE_METHODS = ("POST", "PUT", "PATCH", "DELETE", "GET")

class TokenType(Enum):
    intergration = 'app'
    internal = 'auth'


def extract_token(request: Request) -> str:
    """
    Get the JWT token from the request
    For general requests
    """
    access_token = request.cookies.get("access_token")
    if access_token is None:
        if request.token is None:
            return ""
        else:
            access_token = request.token
    return access_token


def generate_csrf_token(csrf_secret) -> str:

    cipher = Fernet(csrf_secret)

    # Some random bytes of a known length
    csrf_ref = os.urandom(CSRF_REF_BYTES)

    # Encrypt those bytes with our secret
    token = cipher.encrypt(csrf_ref)

    # Append the reference and base64 encode for transport, so that when we
    # decode the token later (again using our secret) we can verify that
    # (1) it is authentic, and (2) it has not been tampered with
    csrf_token = b64encode(csrf_ref + token)

    return csrf_token.decode("utf-8")


def verify_csrf_token(csrf_token: str, *, csrf_secret, ttl: int = None) -> bool:
    """Run the generate_csrf_token function in reverse"""
    return True
    cipher = Fernet(csrf_secret)

    try:
        raw = b64decode(csrf_token)

        # Break the raw bytes based upon our known length
        csrf_ref = raw[:CSRF_REF_BYTES]
        token = raw[CSRF_REF_BYTES:]

        # decode the token
        decoded = cipher.decrypt(token)

        # Make sure the token matches our original reference
        return decoded == csrf_ref

    except InvalidToken as e:
        print(f"AAAAAAA {type(e)}")
        return False


async def check_authenticated(request: Request) -> bool:
    if getattr(request.ctx, 'token', None) is None:
        request.ctx.token = extract_token(request)
    token = request.ctx.token
    try:
        # This will attempt to decode the JWT and will also apply any known
        # claims that are on it. Since our example only uses exp,
        # the only claim to test against is expiration
        payload = jwt.decode(token, request.app.config.JWT_SECRET, algorithms=["HS256"])
    except Exception as e:
        return False
    else:
        if payload.get('typ') == TokenType.internal.value:
            print("HELLOW A")
            if not check_pass_csrf(request):
                raise Forbidden("You CSRF thief!")
        user_id = payload.get('uid', None)
        token_id = payload.get('tid', None)
        print(type(user_id))
        print(user_id)
        print(type(token_id))
        print(token_id)
        if user_id is None or token_id is None:
            return False
        u = await User.get_or_none(id = user_id)
        if u is None:
            return False
        print(u.token_id)
        print(type(u.token_id))
        return u.token_id == token_id
    # This needs to check against database


def check_authorized(request: Request, user_only: bool) -> bool:
    if getattr(request.ctx, 'token', None) is None:
        request.ctx.token = extract_token(request)
    token = request.ctx.token
    if token == "":
        return False
    try:
        # Get the encrypted payload. If it fails to decrypt, or it fails
        # a claim (like expiration) then this will raise an exception
        payload = jwt.decode(
            token, request.app.config.JWT_SECRET, algorithms=["HS256"]
        )
    except Exception as e:
        return False
    else:
        # Check to see if the known base scope criteria has been met
        # Check the database to see if they're authorized
        token_type = payload.get('typ')
        print(token_type)
        print(type(token_type))
        if user_only and token_type != TokenType.internal.value:
            return False
        # Need to do other checks
        return True


def check_pass_csrf(request: Request) -> bool:
    print("boo")
    if request.method in HTTP_UNSAFE_METHODS:
        return verify_csrf_token(request.headers.get("x-xsrf-token", ""), csrf_secret=request.app.config.CSRF_SECRET)
    return True


async def protection(request: Request, user_only: bool) -> None:
    """This method does all of our auth checks and raises exceptions upon failure"""

    if not await check_authenticated(request):
        raise Unauthorized("Invalid or missing token")

    if not check_authorized(request, user_only = user_only):
        raise Forbidden("You do not have permission to access this resource")



def protected(wrapped: Optional[Union[Callable, str]] = None, *, user_only: bool = False) -> Callable:
    def decorator(handler: Callable) -> Callable:
        async def decorated_function(
            request: Request, *args:Any, **kwargs: Any
        ) -> HTTPResponse:

            # Run our protection
            await protection(request, user_only = user_only)
            logger.info("Hello")

            # Assuming no exception has been raised, we can proceed with
            # our handler
            return await handler(request, *args, **kwargs)

        return decorated_function

    return decorator if wrapped is None else decorator(wrapped)


def make_auth_response(token: str, csrf_secret, response: HTTPResponse) -> HTTPResponse:
    """
    Our login response will provide the access token in the body.
    It also needs to setup our "split" JWT cookies, and a CSRF cookie
    """

    decoded_token = token

    # We are allowing httponly to be False so that the payload can be
    # grabbed from the web client and deserialized
    set_cookie(response, "access_token", decoded_token, httponly=True, hours_expire = 7 * 24)

    # Setup a csrf_token. In order for this to work, we are going to expect
    # that any incoming requests have a HEADER called X-XSRF-TOKEN.
    # To allow that to happen, httponly needs to be False
    set_cookie(
        response,
        "csrf_token",
        generate_csrf_token(csrf_secret=csrf_secret),
        httponly=False,
    )

    return response


def set_cookie(response, key, value, httponly=None, hours_expire = 1):
    response.cookies[key] = value
    response.cookies[key]["httponly"] = httponly
    response.cookies[key]["path"] = "/"
    response.cookies[key]["expires"] = datetime.now() + timedelta(hours=hours_expire)
    response.cookies[key]["samesite"] = "lax"

    # These are disabled here for demo purposes. They should be used
    # for additional security in production.
    # response.cookies[key]["samesite"] = "lax"
    # response.cookies[key]["domain"] = "foo.bar"
    # response.cookies[key]["secure"] = True

    # What about SameSite cookies? Indeed, they are meant as a protection from
    # CSRF attaches and can help. But, you need to determine if they are
    # appropriate. It you set SameSite=Strict (and apply to the JWT cookies)
    # then anyone that visits a secured link (regardless if they have already
    # logged in) from outside of your site will be denied access. But, that only
    # is until they refresh their browser. Which might also lead to weird and
    # unexpected behavior. This may be OK. But it may not. Should protected
    # resources be sharable? Even when using it, there are instances where
    # CSRF may still be bypassed. We default our cookies to SameSite=Lax.
    # This means that GET requests coming from third-parties can still pass the
    # cookie. So, links will still be shareable as the user would still appear
    # logged in. However, with SameSite=Lax, non safe HTTP methods from third
    # parties will not submit the cookies. Authentication type cookies should
    # ALWAYS carry SameSite=Lax (which is default behavior on modern browsers).
    # And, you should decide if SameSite=Strict makes sense for you. Regardless,
    # CSRF tokens are a proven and simple method. And, given there are still
    # known methods to circumvent these cookie restrictions, I still believe
    # that an effective anti-CSRF strategy includes tokens. SameSite tokens
    # do not YET appear to be a full-proof solution.

async def create_auth_token(request, user_id: int) -> str:
    # Setup the times for the JWT expiration claim
    iat = datetime.now()
    exp = datetime.now() + timedelta(days = 7)

    u = await User.get_or_none(id = user_id)
    if u is None or u.token_id is None:
        token_id = int(datetime.now().timestamp()) - EPOCH
        await User.update_or_create(id = user_id, defaults = {'token_id': token_id})
    else:
        token_id = u.token_id  
    
    # Encode our payload into a JWT
    token = jwt.encode(
        {
            "iat": iat.timestamp(),
            "exp": exp.timestamp(),
            'uid': user_id,
            'tid': token_id, 
            'typ': TokenType.internal.value
        },
        request.app.config.JWT_SECRET,
        algorithm="HS256",
    )
    return token

async def create_app_token(request, user_id: int) -> str:
    iat = datetime.now()

    u = await User.get_or_none(id = user_id)
    if u is None or u.app_token_id is None:
        app_token_id = int(datetime.now().timestamp()) - EPOCH
        await User.update_or_create(id = user_id, defaults = {'app_token_id': app_token_id})
    else:
        token_id = u.token_id  
    
    # Encode our payload into a JWT
    token = jwt.encode(
        {
            "iat": iat.timestamp(),
            'uid': user_id,
            'tid': app_token_id,
            'typ': TokenType.intergration.value
        },
        request.app.config.JWT_SECRET,
        algorithm="HS256",
    )
    return token


