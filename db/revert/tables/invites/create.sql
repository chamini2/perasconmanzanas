-- Revert i:tables/invites/create from pg

BEGIN;

DROP TABLE app.invites;

COMMIT;
