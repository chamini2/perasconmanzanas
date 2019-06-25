BEGIN;
SELECT plan(8);

SELECT has_role('api');

SELECT schema_privs_are('auth', 'api', ARRAY['USAGE']);

SELECT table_privs_are('auth', 'users', 'api', ARRAY['SELECT', 'INSERT', 'UPDATE']);

SELECT schema_privs_are('app', 'api', ARRAY['USAGE']);

SELECT table_privs_are('app', 'users', 'api', ARRAY['SELECT', 'INSERT']);
SELECT table_privs_are('app', 'accounts', 'api', ARRAY['SELECT']);
SELECT table_privs_are('app', 'members', 'api', ARRAY['SELECT', 'INSERT']);
SELECT table_privs_are('app', 'invites', 'api', ARRAY['SELECT', 'UPDATE']);

SELECT finish();
ROLLBACK;
