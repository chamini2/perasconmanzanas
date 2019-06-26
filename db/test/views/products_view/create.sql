BEGIN;
SELECT plan(1);

SELECT has_view('app', 'products_view', 'View products_view should exist');

SELECT finish();
ROLLBACK;
