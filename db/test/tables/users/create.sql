BEGIN;
SELECT plan(14);

SELECT has_table('app', 'users', 'Table should exist in schema app');

INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
VALUES (-1, 'user', 'user@example.com', 'John', 'Doe', DEFAULT);

SELECT results_eq(
    $$SELECT created_at FROM app.users WHERE username = 'user'$$,
    $$VALUES (CURRENT_TIMESTAMP)$$,
    'Should assign CURRENT_TIMESTAMP as default created_at'
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
        VALUES (-1, 'other', 'other@example.com', 'John', 'Doe', DEFAULT)
    $$,
    23505
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
        VALUES (DEFAULT, 'user', 'other@example.com', 'John', 'Doe', DEFAULT)
    $$,
    23505
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
        VALUES (DEFAULT, 'UseR', 'other@example.com', 'John', 'Doe', DEFAULT)
    $$,
    23505
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
        VALUES (DEFAULT, 'invalid username', 'other@example.com', 'John', 'Doe', DEFAULT)
    $$,
    23514
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
        VALUES (DEFAULT, '', 'other@example.com', 'John', 'Doe', DEFAULT)
    $$,
    23514
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
        VALUES (DEFAULT, 'other', 'user@example.com', 'John', 'Doe', DEFAULT)
    $$,
    23505
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
        VALUES (DEFAULT, 'other', 'user@EXAMPLE.COM', 'John', 'Doe', DEFAULT)
    $$,
    23505
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
        VALUES (DEFAULT, NULL, 'other@example.com', 'John', 'Doe', DEFAULT)
    $$,
    23502
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
        VALUES (DEFAULT, 'other', NULL, 'John', 'Doe', DEFAULT)
    $$,
    23502
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
        VALUES (DEFAULT, 'other', 'other@example.com', NULL, 'Doe', DEFAULT)
    $$,
    23502
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
        VALUES (DEFAULT, 'other', 'other@example.com', 'John', NULL, DEFAULT)
    $$,
    23502
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
        VALUES (DEFAULT, 'other', 'other@example.com', 'John', 'Doe', NULL)
    $$,
    23502
);

SELECT finish();
ROLLBACK;
