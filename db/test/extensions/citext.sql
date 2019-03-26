BEGIN;
SELECT plan(1);

SELECT results_eq(
    $$SELECT extname::text FROM pg_catalog.pg_extension WHERE extname = 'citext'$$,
    $$VALUES ('citext')$$
);

SELECT finish();
ROLLBACK;
