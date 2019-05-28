-- Verify i:extensions/uuid-ossp on pg

BEGIN;

SELECT 1/count(*) FROM pg_catalog.pg_extension WHERE extname = 'uuid-ossp';

ROLLBACK;
