-- Revert access:tables/product_tags/security from pg

BEGIN;

ALTER TABLE app.product_tags DISABLE ROW LEVEL SECURITY;

COMMIT;
