BEGIN;
SELECT plan(1);

SELECT has_extension('public'::name, 'citext'::name);

SELECT finish();
ROLLBACK;
