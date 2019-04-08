BEGIN;
SELECT plan(11);

SELECT has_table('auth'::name, 'users'::name);
SELECT has_pk('auth'::name, 'users'::name, 'Table auth.users should have a PRIMARY KEY');
SELECT col_is_pk('auth'::name, 'users'::name, 'id'::name, 'Column auth.users.id should be the PRIMARY KEY');

SELECT has_column('auth'::name, 'users'::name, 'id'::name, 'Column auth.users.id should exist');
SELECT col_type_is('auth'::name, 'users'::name, 'id'::name, 'integer'::name);
SELECT col_not_null('auth'::name, 'users'::name, 'id'::name, 'Column auth.users.id should be NOT NULL');
SELECT col_is_fk('auth'::name, 'users'::name, 'id'::name, 'Column auth.users.id should be a FOREIGN KEY');
SELECT fk_ok('auth'::name, 'users'::name, 'id'::name, 'app'::name, 'users'::name, 'id'::name);

SELECT has_column('auth'::name, 'users'::name, 'password'::name, 'Column auth.users.password should exist');
SELECT col_type_is('auth'::name, 'users'::name, 'password'::name, 'text'::name);
SELECT col_is_null('auth'::name, 'users'::name, 'password'::name, 'Column auth.users.password should be NULL');

SELECT finish();
ROLLBACK;
