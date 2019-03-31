-- Revert i:tables/auth.users/create from pg

BEGIN;

DROP TABLE auth.users;

COMMIT;
