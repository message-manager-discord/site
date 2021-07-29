-- upgrade --
ALTER TABLE "users" ADD "app_token_id" INT;
ALTER TABLE "users" ADD "access_token" VARCHAR(250);
ALTER TABLE "users" ADD "access_expires_at" TIMESTAMPTZ;
ALTER TABLE "users" ADD "refresh_token" VARCHAR(250);
-- downgrade --
ALTER TABLE "users" DROP COLUMN "app_token_id";
ALTER TABLE "users" DROP COLUMN "access_token";
ALTER TABLE "users" DROP COLUMN "access_expires_at";
ALTER TABLE "users" DROP COLUMN "refresh_token";
