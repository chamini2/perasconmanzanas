-- Revert i:tables/products/security from pg

BEGIN;

ALTER TABLE app.products DISABLE ROW LEVEL SECURITY;

COMMIT;
