-- Verify x:tables/accounts/create on pg

BEGIN;

SELECT id, name, created_at
FROM app.accounts
LIMIT 1;

ROLLBACK;
