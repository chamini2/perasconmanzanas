-- Revert x:tables/accounts/create from pg

BEGIN;

DROP TABLE accounts;

COMMIT;
