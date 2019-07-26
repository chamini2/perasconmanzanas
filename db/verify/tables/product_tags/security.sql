-- Verify access:tables/product_tags/security on pg

BEGIN;

SELECT 1/count(*) FROM pg_catalog.pg_tables WHERE schemaname = 'app' AND tablename = 'product_tags' AND rowsecurity;

ROLLBACK;
