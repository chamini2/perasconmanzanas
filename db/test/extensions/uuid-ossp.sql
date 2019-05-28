BEGIN;
SELECT plan(1);

SELECT has_extension('public'::name, 'uuid-ossp'::name);

SELECT finish();
ROLLBACK;
