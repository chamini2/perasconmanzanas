BEGIN;
SELECT plan(3);

INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
VALUES (-1, 'user', 'user@example.com', 'John', 'Doe', DEFAULT);

INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
VALUES (-2, 'other', 'other@example.com', 'John', 'Doe', DEFAULT);

INSERT INTO auth.users (id, password)
VALUES (-1, 'password');

SELECT throws_ok(
    $$
        INSERT INTO auth.users (id, password)
        VALUES (-1, 'password')
    $$,
    23505
);

SELECT throws_ok(
    $$
        INSERT INTO auth.users (id, password)
        VALUES (-3, 'password')
    $$,
    23503
);

SELECT lives_ok(
    $$
        INSERT INTO auth.users (id, password)
        VALUES (-2, NULL)
    $$
);

SELECT finish();
ROLLBACK;
