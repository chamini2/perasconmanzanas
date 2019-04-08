BEGIN;
SELECT plan(5);

SELECT has_role('api');

SELECT schema_privs_are('auth', 'api', ARRAY['USAGE']);
SELECT table_privs_are('auth', 'users', 'api', ARRAY['SELECT', 'INSERT']);

SELECT schema_privs_are('app', 'api', ARRAY['USAGE']);
SELECT table_privs_are('app', 'users', 'api', ARRAY['SELECT', 'INSERT']);

SELECT finish();
ROLLBACK;
