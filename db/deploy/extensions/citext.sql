-- Deploy x:extensions/citext to pg

BEGIN;

CREATE EXTENSION citext;

COMMIT;
