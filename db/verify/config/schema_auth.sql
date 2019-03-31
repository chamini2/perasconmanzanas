-- Verify i:config/schema_auth on pg

BEGIN;

SELECT pg_catalog.has_schema_privilege('auth', 'usage');

ROLLBACK;
