base url: `https://messagemanager.xyz/api/v<version>`

current version: `1`

# auth

## jwt tokens

### include:
    created_at / iat
    user_id 
    expire_after (0 for never) / exp
    type (either 'bot' or 'access' or 'refresh') / ttyp

    access tokens 1 hour validity
        

### invalidating:
    for all tokens a secret is generated for each user, to allow for invalidating all tokens related to a user
    for 'bot' tokens that created_at time is stored and this is checked, this allows for invalidating without resetting all token

token included in "Authorization" header
ie
"Authorization": "BEARER <token>"

Refresh tokens stored as http-only same-site: lax secure: true cookies and only sent when accessing the get access token endpoints



# non-api endpoints (without /api/v...)
## `/callback` - neither
    handles the "callback" from discord's oauth
## `/login` - user 
    redirects to discord oauth or to "dashboard" if logged in
## `/dashboard`
    general dashboard 
    
# api endpoints 

note: `/auth` from sanic-jwt needs to be changed somehow for oauth
also see if can override how refresh tokens are created to make them a jwt
checkout https://github.com/ahopkins/sanic-jwt/issues/52

possible store secret per user?

(format, path - method - requires default authorization (header and bearer token))

## `/auth/verify` - GET - True
    check if token valid

## `/auth/me` - GET - True
    get user info

## `/auth/refresh` - POST - True 
    get access token, see issue linked above




 

