-- Revert schema:tables/product_tags/create from pg

BEGIN;

DROP TABLE app.product_tags;

COMMIT;
