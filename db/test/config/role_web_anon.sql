BEGIN;
SELECT plan(2);

SELECT has_role('web_anon');
-- TODO: test GRANT web_anon TO authenticator

SELECT schema_privs_are('app', 'web_anon', ARRAY['USAGE']);

SELECT finish();
ROLLBACK;
