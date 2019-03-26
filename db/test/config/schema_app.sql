BEGIN;

SELECT no_plan();
SELECT has_schema('app');
SELECT finish();

ROLLBACK;
