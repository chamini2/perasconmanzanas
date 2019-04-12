BEGIN;
SELECT plan(27);

SELECT has_table('app'::name, 'users'::name);
SELECT has_pk('app'::name, 'users'::name, 'Table app.users should have a PRIMARY KEY');
SELECT col_is_pk('app'::name, 'users'::name, 'id'::name, 'Column app.users.id should be the PRIMARY KEY');

SELECT has_column('app'::name, 'users'::name, 'id'::name, 'Column app.users.id should exist');
SELECT col_type_is('app'::name, 'users'::name, 'id'::name, 'integer'::name);
SELECT col_not_null('app'::name, 'users'::name, 'id'::name, 'Column app.users.id should be NOT NULL');
SELECT col_has_default('app'::name, 'users'::name, 'id'::name, 'Column app.users.id should have a DEFAULT');

SELECT has_column('app'::name, 'users'::name, 'username'::name, 'Column app.users.username should exist');
SELECT col_type_is('app'::name, 'users'::name, 'username'::name, 'citext'::name);
SELECT col_not_null('app'::name, 'users'::name, 'username'::name, 'Column app.users.username should be NOT NULL');
SELECT col_is_unique('app'::name, 'users'::name, 'username'::name);
SELECT col_has_check('app'::name, 'users'::name, 'username'::name, 'Column should have CHECK constraint');
SELECT throws_ok(
    $$
        INSERT INTO app.users (id, username, email, full_name)
        VALUES (DEFAULT, 'invalid username', '1@example.com', 'John Doe')
    $$,
    23514
);
SELECT throws_ok(
    $$
        INSERT INTO app.users (id, username, email, full_name)
        VALUES (DEFAULT, '', '2@example.com', 'John Doe')
    $$,
    23514
);
SELECT lives_ok(
    $$
        INSERT INTO app.users (id, username, email, full_name)
        VALUES (DEFAULT, 'Shorts_2.0', '3@example.com', 'John Doe')
    $$
);

SELECT has_column('app'::name, 'users'::name, 'email'::name, 'Column app.users.email should exist');
SELECT col_type_is('app'::name, 'users'::name, 'email'::name, 'citext'::name);
SELECT col_not_null('app'::name, 'users'::name, 'email'::name, 'Column app.users.email should be NOT NULL');
SELECT col_is_unique('app'::name, 'users'::name, 'email'::name);

SELECT has_column('app'::name, 'users'::name, 'full_name'::name, 'Column app.users.full_name should exist');
SELECT col_type_is('app'::name, 'users'::name, 'full_name'::name, 'text'::name);
SELECT col_not_null('app'::name, 'users'::name, 'full_name'::name, 'Column app.users.full_name should be NOT NULL');

SELECT has_column('app'::name, 'users'::name, 'created_at'::name, 'Column app.users.created_at should exist');
SELECT col_type_is('app'::name, 'users'::name, 'created_at'::name, 'timestamp with time zone'::name);
SELECT col_not_null('app'::name, 'users'::name, 'created_at'::name, 'Column app.users.created_at should be NOT NULL');
SELECT col_has_default('app'::name, 'users'::name, 'created_at'::name, 'Column app.users.created_at should have a DEFAULT');
SELECT col_default_is('app'::name, 'users'::name, 'created_at'::name, 'now()', 'Column app.users.created_at should set DEFAULT to now()')::name;

SELECT finish();
ROLLBACK;
