BEGIN;
SELECT plan(6);

INSERT INTO app.users (id, username, email, full_name)
VALUES
    (1, 'john', 'john@example.com', 'John Doe'),
    (2, 'matt', 'matt@example.com', 'Matt Patt');

INSERT INTO app.accounts (id, name, owner_id)
VALUES
    ('shorts', 'Shorts Store', 1),
    ('pantts', 'Pantts Store', 2);

INSERT INTO app.members (account_id, user_id, admin)
VALUES
    ('shorts', 2, false),
    ('shorts', 1, true),
    ('pantts', 2, true);

INSERT INTO app.products (sku, account_id, description)
VALUES
    ('L-GRAY', 'shorts', 'The gray large ones'),
    ('M-GRAY', 'shorts', 'The gray medium ones'),
    ('S-GRAY', 'shorts', 'The gray small ones'),
    ('L-JEAN', 'pantts', 'The large jeans'),
    ('M-JEAN', 'pantts', 'The medium jeans');

INSERT INTO app.movements (product_sku, account_id, user_id, quantity, description)
VALUES
    ('L-GRAY', 'shorts', 1, 20, 'Inventory start'),
    ('M-GRAY', 'shorts', 2, 2, 'Inventory start'),
    ('M-JEAN', 'pantts', 2, 5, 'Inventory start');

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT results_eq(
    $$SELECT product_sku FROM app.movements ORDER BY product_sku$$,
    ARRAY['L-GRAY', 'M-GRAY']::citext[],
    'Should SELECT movements from selected account'
);

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT lives_ok(
    $$
        INSERT INTO app.movements (product_sku, account_id, user_id, quantity, description)
        VALUES ('S-GRAY', 'shorts', 2, 10, 'Inventory arrived')
    $$,
    'Should INSERT products in selected account with membership'
);

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT throws_ok(
    $$
        INSERT INTO app.movements (product_sku, account_id, user_id, quantity, description)
        VALUES ('L-JEAN', 'pantts', 2, 10, 'Inventory arrived to other account')
    $$,
    42501
);

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT throws_ok(
    $$
        INSERT INTO app.movements (product_sku, account_id, user_id, quantity, description)
        VALUES ('S-GRAY', 'shorts', 1, 10, 'Inventory logged by other user')
    $$,
    42501
);

-- (pantts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$
        UPDATE app.movements
        SET description = description || '!'
        RETURNING product_sku
    $$,
    ARRAY['M-JEAN']::citext[],
    'Should only be able to UPDATE owned movements of the selected account'
);

-- (shorts, 1, false)
SET "request.jwt.claim.user" TO 1;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$DELETE FROM app.movements RETURNING product_sku$$,
    ARRAY['L-GRAY']::citext[],
    'Should only be able to DELETE owned movements of the selected account'
);

SELECT finish();
ROLLBACK;
