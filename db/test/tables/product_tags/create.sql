BEGIN;
SELECT plan(20);

SELECT has_table('app'::name, 'product_tags'::name);
SELECT has_pk('app'::name, 'product_tags'::name, 'Table app.product_tags should have a PRIMARY KEY');
SELECT col_is_pk('app'::name, 'product_tags'::name, ARRAY['name', 'product_sku', 'account_id']::name[], 'Columns app.product_tags(name, product_sku, account_id) should be the PRIMARY KEY');

SELECT has_column('app'::name, 'product_tags'::name, 'name'::name, 'Column app.product_tags.name should exist');
SELECT col_type_is('app'::name, 'product_tags'::name, 'name'::name, 'citext'::name);
SELECT col_not_null('app'::name, 'product_tags'::name, 'name'::name, 'Column app.product_tags.name should be NOT NULL');

SELECT has_column('app'::name, 'product_tags'::name, 'account_id'::name, 'Column app.product_tags.account_id should exist');
SELECT col_type_is('app'::name, 'product_tags'::name, 'account_id'::name, 'citext'::name);
SELECT col_not_null('app'::name, 'product_tags'::name, 'account_id'::name, 'Column app.product_tags.account_id should be NOT NULL');
SELECT col_is_fk('app'::name, 'product_tags'::name, 'account_id'::name, 'Column app.product_tags.account_id should be a FOREIGN KEY');
SELECT fk_ok('app'::name, 'product_tags'::name, 'account_id'::name, 'app'::name, 'accounts'::name, 'id'::name);

SELECT has_column('app'::name, 'product_tags'::name, 'product_sku'::name, 'Column app.product_tags.product_sku should exist');
SELECT col_type_is('app'::name, 'product_tags'::name, 'product_sku'::name, 'citext'::name);
SELECT col_not_null('app'::name, 'product_tags'::name, 'product_sku'::name, 'Column app.product_tags.product_sku should be NOT NULL');

SELECT fk_ok('app'::name, 'product_tags'::name, ARRAY['product_sku', 'account_id']::name[], 'app'::name, 'products'::name, ARRAY['sku', 'account_id']::name[]);

SELECT has_column('app'::name, 'product_tags'::name, 'created_at'::name, 'Column app.product_tags.created_at should exist');
SELECT col_type_is('app'::name, 'product_tags'::name, 'created_at'::name, 'timestamp with time zone'::name);
SELECT col_not_null('app'::name, 'product_tags'::name, 'created_at'::name, 'Column app.product_tags.created_at should be NOT NULL');
SELECT col_has_default('app'::name, 'product_tags'::name, 'created_at'::name, 'Column app.product_tags.created_at should have a DEFAULT');
SELECT col_default_is('app'::name, 'product_tags'::name, 'created_at'::name, 'now()', 'Column app.product_tags.created_at should set DEFAULT to now()')::name;

SELECT finish();
ROLLBACK;
