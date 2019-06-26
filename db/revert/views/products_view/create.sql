-- Revert schema:views/products_view/create from pg

BEGIN;

DROP VIEW app.products_view;

COMMIT;
