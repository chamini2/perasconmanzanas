BEGIN;
SELECT plan(10);

SELECT pass('Test tables/product_tags/security');

SELECT finish();
ROLLBACK;
