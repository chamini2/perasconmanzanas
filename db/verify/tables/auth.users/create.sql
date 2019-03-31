-- Verify i:tables/auth.users/create on pg

BEGIN;

SELECT id, password
FROM auth.users
LIMIT 1;

ROLLBACK;
