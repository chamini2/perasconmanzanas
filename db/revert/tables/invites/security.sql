-- Revert server:tables/invites/security from pg

BEGIN;

ALTER TABLE app.invites DISABLE ROW LEVEL SECURITY;

COMMIT;
