-- Verify i:tables/movements/create on pg

BEGIN;

SELECT id, account_id, product_sku, user_id, quantity, description, created_at
FROM app.movements
WHERE FALSE;

ROLLBACK;
