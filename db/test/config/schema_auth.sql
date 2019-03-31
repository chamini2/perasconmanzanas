BEGIN;
SELECT plan(1);

SELECT has_schema('auth');

SELECT finish();
ROLLBACK;
