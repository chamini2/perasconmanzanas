-- Revert access:tables/traits/security from pg

BEGIN;

ALTER TABLE app.traits DISABLE ROW LEVEL SECURITY;

COMMIT;
