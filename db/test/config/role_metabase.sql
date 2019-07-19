BEGIN;
SELECT plan(8);

SELECT has_role('metabase');

SELECT schema_privs_are('app', 'metabase', ARRAY['USAGE']);

SELECT table_privs_are('app', 'users', 'metabase', ARRAY['SELECT']);
SELECT table_privs_are('app', 'accounts', 'metabase', ARRAY['SELECT']);
SELECT table_privs_are('app', 'members', 'metabase', ARRAY['SELECT']);
SELECT table_privs_are('app', 'invites', 'metabase', ARRAY['SELECT']);
SELECT table_privs_are('app', 'products', 'metabase', ARRAY['SELECT']);
SELECT table_privs_are('app', 'movements', 'metabase', ARRAY['SELECT']);

SELECT finish();
ROLLBACK;
