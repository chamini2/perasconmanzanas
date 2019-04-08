-- Verify i:config/role_authenticator on pg

BEGIN;

SELECT 1/count(*) FROM pg_catalog.pg_roles WHERE rolname = 'authenticator';

ROLLBACK;
