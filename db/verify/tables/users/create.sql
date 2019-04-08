-- Verify i:tables/users/create on pg

BEGIN;

SELECT id, username, email, full_name, created_at
FROM app.users
WHERE FALSE;

ROLLBACK;
