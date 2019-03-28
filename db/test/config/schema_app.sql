BEGIN;
SELECT plan(1);

SELECT has_schema('app');

SELECT finish();
ROLLBACK;
