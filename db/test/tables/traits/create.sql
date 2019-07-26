BEGIN;
SELECT plan(19);

SELECT has_table('app'::name, 'traits'::name);
SELECT has_pk('app'::name, 'traits'::name, 'Table app.traits should have a PRIMARY KEY');
SELECT col_is_pk('app'::name, 'traits'::name, ARRAY['name', 'account_id']::name[], 'Columns app.traits(name, account_id) should be the PRIMARY KEY');

SELECT has_column('app'::name, 'traits'::name, 'name'::name, 'Column app.traits.name should exist');
SELECT col_type_is('app'::name, 'traits'::name, 'name'::name, 'citext'::name);
SELECT col_not_null('app'::name, 'traits'::name, 'name'::name, 'Column app.traits.name should be NOT NULL');

SELECT has_column('app'::name, 'traits'::name, 'account_id'::name, 'Column app.traits.account_id should exist');
SELECT col_type_is('app'::name, 'traits'::name, 'account_id'::name, 'citext'::name);
SELECT col_not_null('app'::name, 'traits'::name, 'account_id'::name, 'Column app.traits.account_id should be NOT NULL');
SELECT col_is_fk('app'::name, 'traits'::name, 'account_id'::name, 'Column app.traits.account_id should be a FOREIGN KEY');
SELECT fk_ok('app'::name, 'traits'::name, 'account_id'::name, 'app'::name, 'accounts'::name, 'id'::name);

SELECT has_column('app'::name, 'traits'::name, 'description'::name, 'Column app.traits.description should exist');
SELECT col_type_is('app'::name, 'traits'::name, 'description'::name, 'text'::name);
SELECT col_not_null('app'::name, 'traits'::name, 'description'::name, 'Column app.traits.description should be NOT NULL');

SELECT has_column('app'::name, 'traits'::name, 'created_at'::name, 'Column app.traits.created_at should exist');
SELECT col_type_is('app'::name, 'traits'::name, 'created_at'::name, 'timestamp with time zone'::name);
SELECT col_not_null('app'::name, 'traits'::name, 'created_at'::name, 'Column app.traits.created_at should be NOT NULL');
SELECT col_has_default('app'::name, 'traits'::name, 'created_at'::name, 'Column app.traits.created_at should have a DEFAULT');
SELECT col_default_is('app'::name, 'traits'::name, 'created_at'::name, 'now()', 'Column app.traits.created_at should set DEFAULT to now()')::name;

SELECT finish();
ROLLBACK;
