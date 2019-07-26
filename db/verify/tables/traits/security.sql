-- Verify access:tables/traits/security on pg

BEGIN;

SELECT 1/count(*) FROM pg_catalog.pg_tables WHERE schemaname = 'app' AND tablename = 'traits' AND rowsecurity;

ROLLBACK;
