BEGIN;
SELECT plan(4);

SELECT has_table('app', 'members', 'Table should exist in schema app');

INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
VALUES (-1, 'user', 'user@example.com', 'John', 'Doe', DEFAULT);

INSERT INTO app.accounts (id, name, created_at)
VALUES ('store', 'The Store', DEFAULT);

INSERT INTO app.members (user_id, account_id, admin, created_at)
VALUES (-1, 'store', DEFAULT, DEFAULT);

SELECT results_eq(
    $$SELECT created_at FROM app.members WHERE user_id = -1$$,
    $$VALUES (CURRENT_TIMESTAMP)$$,
    'Should assign CURRENT_TIMESTAMP as default created_at'
);

SELECT results_eq(
    $$SELECT admin FROM app.members WHERE user_id = -1$$,
    $$VALUES (FALSE)$$,
    'Should assign FALSE as default admin'
);

SELECT throws_ok(
    $$
        INSERT INTO app.members (user_id, account_id, admin, created_at)
        VALUES (-1, 'store', DEFAULT, DEFAULT)
    $$,
    23505
);

SELECT finish();
ROLLBACK;
