-- Verify i:extensions/pgcrypto on pg

BEGIN;

SELECT 1/count(*) FROM pg_catalog.pg_extension WHERE extname = 'pgcrypto';

ROLLBACK;
