-- Revert schema:tables/traits/create from pg

BEGIN;

DROP TABLE app.traits;

COMMIT;
