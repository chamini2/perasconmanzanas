-- Revert i:config/schema_app from pg

BEGIN;

DROP SCHEMA app;

COMMIT;
