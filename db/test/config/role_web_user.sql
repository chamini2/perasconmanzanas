BEGIN;
SELECT plan(5);

SELECT has_role('web_user');
-- TODO: test GRANT web_user TO authenticator

SELECT schema_privs_are('app', 'web_user', ARRAY['USAGE']);
SELECT table_privs_are('app', 'users', 'web_user', ARRAY['SELECT', 'UPDATE']);
SELECT table_privs_are('app', 'accounts', 'web_user', ARRAY['SELECT', 'INSERT', 'UPDATE', 'DELETE']);
SELECT table_privs_are('app', 'members', 'web_user', ARRAY['SELECT', 'DELETE']);

SELECT finish();
ROLLBACK;
