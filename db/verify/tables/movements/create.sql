-- Verify i:tables/movements/create on pg

BEGIN;

SELECT id, account_id, product_sku, quantity, description, created_at
FROM app.movements
WHERE FALSE;

ROLLBACK;
