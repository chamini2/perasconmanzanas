-- Revert x:tables/accounts/create from pg

BEGIN;

DROP TABLE app.accounts;

COMMIT;
