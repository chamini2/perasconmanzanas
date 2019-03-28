BEGIN;
SELECT plan(4);

SELECT has_table('app', 'members', 'Table should exist in schema app');

INSERT INTO app.users (username, email, first_name, last_name, created_at)
VALUES ('user', 'user@example.com', 'John', 'Doe', DEFAULT);

INSERT INTO app.accounts (id, name, created_at)
VALUES ('store', 'The Store', DEFAULT);

INSERT INTO app.members (user_username, account_id, admin, created_at)
VALUES ('user', 'store', DEFAULT, DEFAULT);

SELECT results_eq(
    $$SELECT created_at FROM app.members WHERE user_username = 'user'$$,
    $$VALUES (CURRENT_TIMESTAMP)$$,
    'Should assign CURRENT_TIMESTAMP as default created_at'
);

SELECT results_eq(
    $$SELECT admin FROM app.members WHERE user_username = 'user'$$,
    $$VALUES (FALSE)$$,
    'Should assign FALSE as default admin'
);

SELECT throws_ok(
    $$
        INSERT INTO app.members (user_username, account_id, admin, created_at)
        VALUES ('user', 'store', DEFAULT, DEFAULT)
    $$,
    23505
);

SELECT finish();
ROLLBACK;
