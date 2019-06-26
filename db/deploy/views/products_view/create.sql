-- Deploy schema:views/products_view/create to pg

BEGIN;

CREATE VIEW app.products_view AS
  SELECT
    p.sku,
    p.account_id,
    p.description,
    p.created_at,
    sum(m.quantity) AS stock
  FROM app.products p
    INNER JOIN app.movements m ON ((m.product_sku, m.account_id) = (p.sku, p.account_id))
  GROUP BY (p.sku, p.account_id);

COMMIT;
