secret_key = b")>\xb7yD\xcf\x99\xa3`\xd4A\x1a\xf21\xb8\x90"

default_values = {
    "support_invite": "https://discord.gg/xFZu29t",
    "docs": "https://docs.messagemanager.xyz",
    "invite": "https://discord.com/api/oauth2/authorize?client_id=735395698278924359&permissions=379968&scope=applications.commands%20bot",
    "privacy": "https://github.com/AnotherCat/message-manager/blob/master/PRIVACY_POLICY.md",
    "source": "https://github.com/AnotherCat/message-manager-site",
    "cloudflare_analytics_token": "f0efcb82c6ca420a952f6ec894ed9d05",
}


running_config = {  # Arguments to pass to app.run() https://sanicframework.org/en/guide/deployment/running.html
    "host": "localhost",
    "port": 8000,
    "access_log": False,
    "ssl": {
        "cert": "path",
        "key": "path",
    },
}
