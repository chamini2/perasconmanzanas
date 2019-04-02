-- Verify i:tables/auth.users/create on pg

BEGIN;

SELECT id, password
FROM auth.users
WHERE FALSE;

ROLLBACK;
