BEGIN;
SELECT plan(3);

SELECT has_role('web_admin');
-- TODO: test GRANT web_admin TO authenticator
-- TODO: test GRANT web_user TO web_admin

SELECT schema_privs_are('app', 'web_admin', ARRAY['USAGE']);
SELECT table_privs_are('app', 'members', 'web_admin', ARRAY[
    'INSERT', 'UPDATE',
    'SELECT', 'DELETE' -- inherited
]);

SELECT finish();
ROLLBACK;
