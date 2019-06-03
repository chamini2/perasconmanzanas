-- Verify i:tables/invites/create on pg

BEGIN;

SELECT id, account_id, notes
FROM app.invites
WHERE FALSE;

ROLLBACK;
