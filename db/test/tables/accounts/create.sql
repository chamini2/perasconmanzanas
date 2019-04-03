BEGIN;
SELECT plan(14);

SELECT has_table('app'::name, 'accounts'::name);
SELECT has_pk('app'::name, 'accounts'::name, 'Table app.accounts should have a PRIMARY KEY');
SELECT col_is_pk('app'::name, 'accounts'::name, 'id'::name, 'Column app.accounts.id should be the PRIMARY KEY');

SELECT has_column('app'::name, 'accounts'::name, 'id'::name, 'Column app.accounts.id should exist');
SELECT col_not_null('app'::name, 'accounts'::name, 'id'::name, 'Column app.accounts.id should be NOT NULL');
SELECT col_type_is('app'::name, 'accounts'::name, 'id'::name, 'citext'::name);

SELECT has_column('app'::name, 'accounts'::name, 'name'::name, 'Column app.accounts.name should exist');
SELECT col_not_null('app'::name, 'accounts'::name, 'name'::name, 'Column app.accounts.name should be NOT NULL');
SELECT col_type_is('app'::name, 'accounts'::name, 'name'::name, 'text'::name);

SELECT has_column('app'::name, 'accounts'::name, 'created_at'::name, 'Column app.accounts.created_at should exist');
SELECT col_not_null('app'::name, 'accounts'::name, 'created_at'::name, 'Column app.accounts.created_at should be NOT NULL');
SELECT col_has_default('app'::name, 'accounts'::name, 'created_at'::name, 'Column app.accounts.created_at should have a DEFAULT');
SELECT col_default_is('app'::name, 'accounts'::name, 'created_at'::name, 'now()', 'Column app.accounts.created_at should set DEFAULT to now()')::name;
SELECT col_type_is('app'::name, 'accounts'::name, 'created_at'::name, 'timestamp with time zone'::name);

SELECT finish();
ROLLBACK;
