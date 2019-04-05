-- Verify x:tables/accounts/create on pg

BEGIN;

SELECT id, name, owner_id, created_at
FROM app.accounts
WHERE FALSE;

ROLLBACK;
