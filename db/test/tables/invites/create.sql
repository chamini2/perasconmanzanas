BEGIN;
SELECT plan(15);

SELECT has_table('app'::name, 'invites'::name);
SELECT has_pk('app'::name, 'invites'::name, 'Table app.invites should have a PRIMARY KEY');
SELECT col_is_pk('app'::name, 'invites'::name, 'id'::name, 'Column app.invites.id should be the PRIMARY KEY');

SELECT has_column('app'::name, 'invites'::name, 'id'::name, 'Column app.invites.id should exist');
SELECT col_type_is('app'::name, 'invites'::name, 'id'::name, 'uuid'::name);
SELECT col_not_null('app'::name, 'invites'::name, 'id'::name, 'Column app.invites.id should be NOT NULL');
SELECT col_has_default('app'::name, 'invites'::name, 'id'::name, 'Column app.invites.id should have a DEFAULT');

SELECT has_column('app'::name, 'invites'::name, 'account_id'::name, 'Column app.invites.account_id should exist');
SELECT col_type_is('app'::name, 'invites'::name, 'account_id'::name, 'citext'::name);
SELECT col_not_null('app'::name, 'invites'::name, 'account_id'::name, 'Column app.invites.account_id should be NOT NULL');
SELECT col_is_fk('app'::name, 'invites'::name, 'account_id'::name, 'Column app.invites.account_id should be a FOREIGN KEY');
SELECT fk_ok('app'::name, 'invites'::name, 'account_id'::name, 'app'::name, 'accounts'::name, 'id'::name);

SELECT has_column('app'::name, 'invites'::name, 'notes'::name, 'Column app.invites.notes should exist');
SELECT col_type_is('app'::name, 'invites'::name, 'notes'::name, 'text'::name);
SELECT col_not_null('app'::name, 'invites'::name, 'notes'::name, 'Column app.invites.notes should be NOT NULL');

SELECT finish();
ROLLBACK;
