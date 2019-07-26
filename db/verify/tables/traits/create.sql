-- Verify schema:tables/traits/create on pg

BEGIN;

SELECT name, account_id, description, created_at
FROM app.traits
WHERE FALSE;

ROLLBACK;
