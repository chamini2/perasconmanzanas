-- Revert i:tables/users/create from pg

BEGIN;

DROP TABLE app.users;

COMMIT;
