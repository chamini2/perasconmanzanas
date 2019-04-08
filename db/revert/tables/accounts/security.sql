-- Revert i:tables/accounts/security from pg

BEGIN;

ALTER TABLE app.accounts DISABLE ROW LEVEL SECURITY;

COMMIT;
