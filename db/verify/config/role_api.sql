-- Verify i:config/role_api on pg

BEGIN;

SELECT 1/count(*) FROM pg_catalog.pg_roles WHERE rolname = 'api';

ROLLBACK;
