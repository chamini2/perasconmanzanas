-- Verify i:config/role_web_admin on pg

BEGIN;

SELECT 1/count(*) FROM pg_catalog.pg_roles WHERE rolname = 'web_admin';

ROLLBACK;
