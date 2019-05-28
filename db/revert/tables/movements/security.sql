-- Revert i:tables/movements/security from pg

BEGIN;

ALTER TABLE app.movements DISABLE ROW LEVEL SECURITY;

COMMIT;
