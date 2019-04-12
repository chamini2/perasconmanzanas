-- Revert i:tables/movements/create from pg

BEGIN;

DROP TABLE app.movements;

COMMIT;
