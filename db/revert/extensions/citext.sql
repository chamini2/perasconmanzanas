-- Revert x:extensions/citext from pg

BEGIN;

DROP EXTENSION citext;

COMMIT;
