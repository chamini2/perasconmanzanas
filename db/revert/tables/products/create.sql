-- Revert i:tables/products/create from pg

BEGIN;

DROP TABLE app.products;

COMMIT;
