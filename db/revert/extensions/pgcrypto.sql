-- Revert i:extensions/pgcrypto from pg

BEGIN;

DROP EXTENSION pgcrypto;

COMMIT;
