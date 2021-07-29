from typing import Optional, Union

from tortoise import Model, fields


class User(Model):
    id = fields.BigIntField(pk=True)
    token_id = fields.IntField(null=True)
    app_token_id = fields.IntField(null=True)
    access_token = fields.CharField(max_length = 250, null = True)
    refresh_token = fields.CharField(max_length = 250, null = True)
    access_expires_at = fields.DatetimeField(null = True)

    class Meta:
        table = "users"

    def __str__(self) -> str:
        return str(self.id)
