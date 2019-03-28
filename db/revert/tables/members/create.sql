-- Revert i:tables/members/create from pg

BEGIN;

DROP TABLE app.members;

COMMIT;
