-- Verify i:tables/users/create on pg

BEGIN;

SELECT id, username, email, first_name, last_name, created_at
FROM app.users
WHERE FALSE;

ROLLBACK;
