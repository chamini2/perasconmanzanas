BEGIN;
SELECT plan(6);

SELECT has_table('app', 'accounts', 'Table accounts should exist in schema app');

INSERT INTO app.accounts (id, name, created_at) VALUES ('store', 'The Store', DEFAULT);

SELECT results_eq(
    $$SELECT created_at FROM app.accounts WHERE id = 'store'$$,
    $$VALUES (CURRENT_TIMESTAMP)$$,
    'Should assign CURRENT_TIMESTAMP as default created_at'
);

SELECT throws_ok(
    $$INSERT INTO app.accounts (id, name, created_at) VALUES ('store', 'Not The Store', DEFAULT)$$,
    23505
);

SELECT throws_ok(
    $$INSERT INTO app.accounts (id, name, created_at) VALUES (NULL, 'Not The Store', DEFAULT)$$,
    23502
);

SELECT throws_ok(
    $$INSERT INTO app.accounts (id, name, created_at) VALUES ('another_store', NULL, DEFAULT)$$,
    23502
);

SELECT throws_ok(
    $$INSERT INTO app.accounts (id, name, created_at) VALUES ('another_store', 'Another Store', NULL)$$,
    23502
);

SELECT finish();
ROLLBACK;
