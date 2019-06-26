-- Verify schema:views/products_view/create on pg

BEGIN;

SELECT
  sku,
  account_id,
  description,
  created_at,
  stock
FROM app.products_view
WHERE FALSE;

ROLLBACK;
