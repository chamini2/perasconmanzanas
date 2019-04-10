BEGIN;
SELECT plan(12);

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

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT results_eq(
    $$SELECT sku FROM app.products ORDER BY sku$$,
    ARRAY['L-GRAY', 'M-GRAY', 'S-GRAY']::citext[],
    'Should SELECT products from selected account'
);

-- (pantts, 2, true)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$SELECT sku FROM app.products ORDER BY sku$$,
    ARRAY['L-JEAN', 'M-JEAN']::citext[],
    'Should SELECT products from selected account'
);

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT lives_ok(
    $$
        INSERT INTO app.products (sku, account_id, description)
        VALUES ('XS-GRAY', 'shorts', 'The gray EXTRA small ones')
    $$,
    'Should INSERT products in selected account with membership'
);

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT throws_ok(
    $$
        INSERT INTO app.products (sku, account_id, description)
        VALUES ('M-JOGGERS', 'pantts', 'The illegal pants')
    $$,
    42501
);

-- (pantts, 2, true)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT lives_ok(
    $$
        INSERT INTO app.products (sku, account_id, description)
        VALUES ('S-JEAN', 'pantts', 'The NEW small jeans')
    $$,
    'Should INSERT products in selected account with administration'
);

-- (pantts, 2, true)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT throws_ok(
    $$
        INSERT INTO app.products (sku, account_id, description)
        VALUES ('M-LONG', 'shorts', 'Long shorts are pantts')
    $$,
    42501
);

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT results_eq(
    $$
        UPDATE app.products SET
            description = description || '!!!'
        WHERE sku ~ '^L-'
        RETURNING  sku
    $$,
    $$VALUES ('L-GRAY'::citext)$$,
    'Should UPDATE products in selected account with membership'
);

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT throws_ok(
    $$
        UPDATE app.products SET
            account_id = 'pantts'
        WHERE sku ~ '^L-'
    $$,
    42501
);

-- (pantts, 2, true)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$
        UPDATE app.products SET
            description = description || '!!!'
        WHERE sku ~ '^L-'
        RETURNING  sku
    $$,
    $$VALUES ('L-JEAN'::citext)$$,
    'Should UPDATE products in selected account with administration'
);

-- (pantts, 2, true)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT throws_ok(
    $$
        UPDATE app.products SET
            account_id = 'shorts'
        WHERE sku ~ '^L-'
    $$,
    42501
);

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT throws_ok(
    $$
        DELETE FROM app.products
        WHERE sku ~ '^L-'
    $$,
    42501
);

-- (pantts, 2, true)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$
        DELETE FROM app.products
        WHERE sku ~ '^L-'
        RETURNING sku
    $$,
    $$VALUES ('L-JEAN'::citext)$$,
    'Should DELETE products in selected account with administration'
);

SELECT finish();
ROLLBACK;
