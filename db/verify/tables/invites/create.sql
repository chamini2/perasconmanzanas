-- Verify i:tables/invites/create on pg

BEGIN;

SELECT id, account_id, notes, claimed_by_id, claimed_at, created_at
FROM app.invites
WHERE FALSE;

ROLLBACK;
