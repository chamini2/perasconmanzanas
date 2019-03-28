-- Verify i:tables/users/create on pg

BEGIN;

SELECT username, email, first_name, last_name, created_at
FROM app.users
LIMIT 1;

ROLLBACK;
