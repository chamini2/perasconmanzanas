BEGIN;
SELECT plan(23);

SELECT has_table('app'::name, 'members'::name);
SELECT has_pk('app'::name, 'members'::name, 'Table app.members should have a PRIMARY KEY');
SELECT col_is_pk('app'::name, 'members'::name, ARRAY['user_id', 'account_id']::name[], 'Columns (app.members.user_id, app.members.account_id) should be the PRIMARY KEY');

SELECT has_column('app'::name, 'members'::name, 'user_id'::name, 'Column app.members.user_id should exist');
SELECT col_type_is('app'::name, 'members'::name, 'user_id'::name, 'integer'::name);
SELECT col_not_null('app'::name, 'members'::name, 'user_id'::name, 'Column app.members.user_id should be NOT NULL');
SELECT col_is_fk('app'::name, 'members'::name, 'user_id'::name, 'Column app.members.user_id should be a FOREIGN KEY');
SELECT fk_ok('app'::name, 'members'::name, 'user_id'::name, 'app'::name, 'users'::name, 'id'::name);

SELECT has_column('app'::name, 'members'::name, 'account_id'::name, 'Column app.members.account_id should exist');
SELECT col_type_is('app'::name, 'members'::name, 'account_id'::name, 'citext'::name);
SELECT col_not_null('app'::name, 'members'::name, 'account_id'::name, 'Column app.members.account_id should be NOT NULL');
SELECT col_is_fk('app'::name, 'members'::name, 'account_id'::name, 'Column app.members.account_id should be a FOREIGN KEY');
SELECT fk_ok('app'::name, 'members'::name, 'account_id'::name, 'app'::name, 'accounts'::name, 'id'::name);

SELECT has_column('app'::name, 'members'::name, 'admin'::name, 'Column app.members.admin should exist');
SELECT col_type_is('app'::name, 'members'::name, 'admin'::name, 'boolean'::name);
SELECT col_not_null('app'::name, 'members'::name, 'admin'::name, 'Column app.members.admin should be NOT NULL');
SELECT col_has_default('app'::name, 'members'::name, 'admin'::name, 'Column app.members.admin should have a DEFAULT');
SELECT col_default_is('app'::name, 'members'::name, 'admin'::name, 'false', 'Column app.members.admin should set DEFAULT to false');

SELECT has_column('app'::name, 'members'::name, 'created_at'::name, 'Column app.members.created_at should exist');
SELECT col_type_is('app'::name, 'members'::name, 'created_at'::name, 'timestamp with time zone'::name);
SELECT col_not_null('app'::name, 'members'::name, 'created_at'::name, 'Column app.members.created_at should be NOT NULL');
SELECT col_has_default('app'::name, 'members'::name, 'created_at'::name, 'Column app.members.created_at should have a DEFAULT');
SELECT col_default_is('app'::name, 'members'::name, 'created_at'::name, 'now()', 'Column app.members.created_at should set DEFAULT to now()');

SELECT finish();
ROLLBACK;
