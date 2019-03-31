-- Revert i:config/schema_auth from pg

BEGIN;

DROP SCHEMA auth;

COMMIT;
