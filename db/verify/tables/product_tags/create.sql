-- Verify schema:tables/product_tags/create on pg

BEGIN;

SELECT name, account_id, product_sku, created_at
FROM app.product_tags
WHERE FALSE;

ROLLBACK;
