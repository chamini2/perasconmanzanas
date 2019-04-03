BEGIN;
SELECT plan(19);

SELECT has_table('app'::name, 'products'::name);
SELECT has_pk('app'::name, 'products'::name, 'Table app.products should have a PRIMARY KEY');
SELECT col_is_pk('app'::name, 'products'::name, ARRAY['sku', 'account_id']::name[], 'Columns (app.products.sku, app.products.account_id) should be the PRIMARY KEY');

SELECT has_column('app'::name, 'products'::name, 'sku'::name, 'Column app.products.sku should exist');
SELECT col_not_null('app'::name, 'products'::name, 'sku'::name, 'Column app.products.sku should be NOT NULL');
SELECT col_type_is('app'::name, 'products'::name, 'sku'::name, 'citext'::name);

SELECT has_column('app'::name, 'products'::name, 'account_id'::name, 'Column app.products.account_id should exist');
SELECT col_not_null('app'::name, 'products'::name, 'account_id'::name, 'Column app.products.account_id should be NOT NULL');
SELECT col_type_is('app'::name, 'products'::name, 'account_id'::name, 'citext'::name);
SELECT col_is_fk('app'::name, 'products'::name, 'account_id'::name, 'Column app.products.account_id should be a FOREIGN KEY');
SELECT fk_ok('app'::name, 'products'::name, 'account_id'::name, 'app'::name, 'accounts'::name, 'id'::name);

SELECT has_column('app'::name, 'products'::name, 'description'::name, 'Column app.products.description should exist');
SELECT col_not_null('app'::name, 'products'::name, 'description'::name, 'Column app.products.description should be NOT NULL');
SELECT col_type_is('app'::name, 'products'::name, 'description'::name, 'text'::name);

SELECT has_column('app'::name, 'products'::name, 'created_at'::name, 'Column app.products.created_at should exist');
SELECT col_not_null('app'::name, 'products'::name, 'created_at'::name, 'Column app.products.created_at should be NOT NULL');
SELECT col_has_default('app'::name, 'products'::name, 'created_at'::name, 'Column app.products.created_at should have a DEFAULT');
SELECT col_default_is('app'::name, 'products'::name, 'created_at'::name, 'now()', 'Column app.products.created_at should set DEFAULT to now()')::name;
SELECT col_type_is('app'::name, 'products'::name, 'created_at'::name, 'timestamp with time zone'::name);

SELECT finish();
ROLLBACK;
