BEGIN;
SELECT plan(6);

INSERT INTO app.users (id, username, email, first_name, last_name, created_at)
VALUES
    (1, 'john', 'john@example.com', 'John', 'Doe', DEFAULT),
    (2, 'matt', 'matt@example.com', 'Matt', 'Patt', DEFAULT),
    (3, 'chris', 'chris@example.com', 'Chris', 'Peters', DEFAULT);

INSERT INTO app.accounts (id, name, created_at)
VALUES
    ('store', 'The Store', DEFAULT);

INSERT INTO app.members (user_id, account_id, admin, created_at)
VALUES
    (1, 'store', true, DEFAULT),
    (2, 'store', false, DEFAULT),
    (3, 'store', true, DEFAULT);

SELECT throws_ok(
    $$
        INSERT INTO app.members (user_id, account_id, admin, created_at)
        VALUES (1, 'store', DEFAULT, DEFAULT)
    $$,
    23505
);

SELECT throws_ok($$DELETE FROM app.members$$, 'P0001');

SELECT lives_ok(
    $$DELETE FROM app.members WHERE user_id = 3$$,
    'Should be able to DELETE members while there are more left'
);

SELECT throws_ok(
    $$DELETE FROM app.members WHERE user_id = 1$$,
    'P0001',
    NULL,
    'Should not be able to DELETE all admin members'
);

SELECT lives_ok(
    $$DELETE FROM app.accounts WHERE id = 'store'$$,
    'Should be able to DELETE the whole account'
);
SELECT row_eq(
    $$SELECT count(*)::integer FROM app.members$$,
    ROW (0)
);

SELECT finish();
ROLLBACK;
