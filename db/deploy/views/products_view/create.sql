-- Deploy schema:views/products_view/create to pg

BEGIN;

CREATE VIEW app.products_view
AS
  SELECT
    p.sku,
    p.account_id,
    p.description,
    p.created_at,
    coalesce(sum(m.quantity), 0) AS stock
  FROM app.products p
    LEFT JOIN app.movements m ON ((m.product_sku, m.account_id) = (p.sku, p.account_id))
  WHERE
    -- Apply RLS
    p.account_id = current_setting('request.jwt.claim.account', true)
  GROUP BY (p.sku, p.account_id);

COMMIT;
