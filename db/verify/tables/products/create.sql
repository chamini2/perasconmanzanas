-- Verify i:tables/products/create on pg

BEGIN;

SELECT sku, account_id, description, created_at
FROM app.products
WHERE FALSE;

ROLLBACK;
