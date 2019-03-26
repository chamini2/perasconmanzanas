-- Verify x:extensions/citext on pg

BEGIN;

SELECT 1/count(*) FROM pg_catalog.pg_extension WHERE extname = 'citext';

ROLLBACK;
