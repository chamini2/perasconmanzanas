BEGIN;
SELECT plan(9);

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

INSERT INTO app.traits (name, account_id, description)
VALUES
    ('Size', 'shorts', ''),
    ('Color', 'shorts', ''),
    ('Brand', 'shorts', ''),
    ('Waist Size', 'pantts', '');

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT results_eq(
    $$SELECT name FROM app.traits ORDER BY name$$,
    ARRAY['Brand', 'Color', 'Size']::citext[],
    'Should SELECT traits from selected account'
);

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT lives_ok(
    $$
        INSERT INTO app.traits (name, account_id, description)
        VALUES ('Length', 'shorts', '')
    $$,
    'Should INSERT traits in selected account with membership'
);

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT throws_ok(
    $$
        INSERT INTO app.traits (name, account_id, description)
        VALUES ('Length', 'pantts', 'The illegal trait')
    $$,
    42501
);

-- (pantts, 2, true)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT lives_ok(
    $$
        INSERT INTO app.traits (name, account_id, description)
        VALUES ('Length', 'pantts', 'This legal trait')
    $$,
    'Should INSERT traits in selected account with administration'
);

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT throws_ok(
    $$
        UPDATE app.traits SET
            description = description || '!!!'
        RETURNING name
    $$,
    42501
);

-- (pantts, 2, true)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$
        UPDATE app.traits SET
            description = description || '!!!'
        WHERE name = 'Waist Size'
        RETURNING  name
    $$,
    $$VALUES ('Waist Size'::citext)$$,
    'Should UPDATE traits in selected account with administration'
);

-- (pantts, 2, true)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT throws_ok(
    $$
        UPDATE app.traits SET
            account_id = 'shorts'
        WHERE name = 'Waist Size'
    $$,
    42501
);

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT throws_ok(
    $$
        DELETE FROM app.traits
        WHERE name = 'Size'
    $$,
    42501
);

-- (pantts, 2, true)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$
        DELETE FROM app.traits
        WHERE name = 'Waist Size'
        RETURNING name
    $$,
    $$VALUES ('Waist Size'::citext)$$,
    'Should DELETE traits in selected account with administration'
);

SELECT finish();
ROLLBACK;
