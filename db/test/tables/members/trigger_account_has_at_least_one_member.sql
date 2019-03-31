BEGIN;
SELECT plan(4);

INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
VALUES (-1, 'user', 'user@example.com', 'John', 'Doe', DEFAULT);

INSERT INTO app.accounts (id, name, created_at)
VALUES ('store', 'The Store', DEFAULT);

INSERT INTO app.members (user_id, account_id, admin, created_at)
VALUES (-1, 'store', DEFAULT, DEFAULT);

SELECT throws_ok(
    $$
        INSERT INTO app.members (user_id, account_id, admin, created_at)
        VALUES (-1, 'store', DEFAULT, DEFAULT)
    $$,
    23505
);

SELECT throws_ok(
    $$DELETE FROM app.members$$,
    'P0001'
);

SELECT lives_ok(
    $$DELETE FROM app.accounts WHERE id = 'store'$$
);
SELECT results_eq(
    $$SELECT count(*)::integer FROM app.members$$,
    $$VALUES (0)$$
);

SELECT finish();
ROLLBACK;
