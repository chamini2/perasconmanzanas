BEGIN;
SELECT plan(12);

SELECT has_table('app', 'users', 'Table should exist in schema app');

INSERT INTO app.users (username, email, first_name, last_name, created_at)
VALUES ('user', 'user@example.com', 'John', 'Doe', DEFAULT);

SELECT results_eq(
    $$SELECT created_at FROM app.users WHERE username = 'user'$$,
    $$VALUES (CURRENT_TIMESTAMP)$$,
    'Should assign CURRENT_TIMESTAMP as default created_at'
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (username, email, first_name, last_name, created_at)
        VALUES ('user', 'other@example.com', 'John', 'Doe', DEFAULT)
    $$,
    23505
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (username, email, first_name, last_name, created_at)
        VALUES ('UseR', 'other@example.com', 'John', 'Doe', DEFAULT)
    $$,
    23505
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (username, email, first_name, last_name, created_at)
        VALUES ('invalid username', 'other@example.com', 'John', 'Doe', DEFAULT)
    $$,
    23514
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (username, email, first_name, last_name, created_at)
        VALUES ('other', 'user@example.com', 'John', 'Doe', DEFAULT)
    $$,
    23505
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (username, email, first_name, last_name, created_at)
        VALUES ('other', 'user@EXAMPLE.COM', 'John', 'Doe', DEFAULT)
    $$,
    23505
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (username, email, first_name, last_name, created_at)
        VALUES (NULL, 'other@example.com', 'John', 'Doe', DEFAULT)
    $$,
    23502
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (username, email, first_name, last_name, created_at)
        VALUES ('other', NULL, 'John', 'Doe', DEFAULT)
    $$,
    23502
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (username, email, first_name, last_name, created_at)
        VALUES ('other', 'other@example.com', NULL, 'Doe', DEFAULT)
    $$,
    23502
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (username, email, first_name, last_name, created_at)
        VALUES ('other', 'other@example.com', 'John', NULL, DEFAULT)
    $$,
    23502
);

SELECT throws_ok(
    $$
        INSERT INTO app.users (username, email, first_name, last_name, created_at)
        VALUES ('other', 'other@example.com', 'John', 'Doe', NULL)
    $$,
    23502
);


SELECT finish();
ROLLBACK;
