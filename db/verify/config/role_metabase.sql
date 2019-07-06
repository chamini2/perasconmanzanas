-- Verify access:config/role_metabase on pg

BEGIN;

SELECT 1/count(*) FROM pg_catalog.pg_roles WHERE rolname = 'metabase';

ROLLBACK;
