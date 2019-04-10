-- Verify i:tables/products/security on pg

BEGIN;

SELECT 1/count(*) FROM pg_catalog.pg_tables WHERE schemaname = 'app' AND tablename = 'products' AND rowsecurity;

ROLLBACK;
