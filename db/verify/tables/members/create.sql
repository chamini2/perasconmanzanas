-- Verify i:tables/members/create on pg

BEGIN;

SELECT user_id, account_id, admin, created_at
FROM app.members
WHERE FALSE;

ROLLBACK;
