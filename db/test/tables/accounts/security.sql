BEGIN;
SELECT plan(9);

INSERT INTO app.users (id, username, email, full_name)
VALUES
    (1, 'john', 'john@example.com', 'John Doe'),
    (2, 'matt', 'matt@example.com', 'Matt Patt'),
    (3, 'chris', 'chris@example.com', 'Chris Fritz');

INSERT INTO app.accounts (id, name, owner_id)
VALUES
    ('shorts', 'Shorts Store', 1),
    ('pantts', 'Pantts Store', 3);

INSERT INTO app.members (account_id, user_id, admin)
VALUES
    ('shorts', 1, true),
    ('shorts', 2, false),
    ('shorts', 3, false),
    ('pantts', 2, true);

-- (shorts, 1, true)
SET "request.jwt.claim.user" TO 1;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$SELECT id FROM app.accounts$$,
    ARRAY['shorts']::citext[],
    'Should only be able to SELECT accounts with membership or ownership'
);

-- (NULL, 3, false)
SET "request.jwt.claim.user" TO 3;
RESET "request.jwt.claim.account";
SET SESSION AUTHORIZATION web_user;
SELECT results_eq(
    $$SELECT id FROM app.accounts$$,
    ARRAY['shorts', 'pantts']::citext[],
    'Should only be able to SELECT accounts with membership or ownership'
);

-- (shorts, 1, true)
SET "request.jwt.claim.user" TO 1;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$
        INSERT INTO app.accounts (id, name, owner_id)
        VALUES ('skirts', 'Skirts Store', 1)
        RETURNING id
    $$,
    ARRAY['skirts']::citext[],
    'Should only be able to INSERT new accounts to be owner'
);

-- (shorts, 1, true)
SET "request.jwt.claim.user" TO 1;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_admin;
SELECT throws_ok(
    $$
        INSERT INTO app.accounts (id, name, owner_id)
        VALUES ('sweaters', 'Sweaters Store', 2)
    $$,
    42501
);

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT results_eq(
    $$UPDATE app.accounts SET name = name || ' For Kids' RETURNING id$$,
    ARRAY[]::citext[],
    'Should only be able to UPDATE accounts with administration or ownership'
);

-- (pantts, 2, true)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$UPDATE app.accounts SET name = name || ' For Kids' RETURNING id$$,
    ARRAY['pantts']::citext[],
    'Should only be able to UPDATE accounts with administration or ownership'
);

-- (pantts, 3, owner)
SET "request.jwt.claim.user" TO 3;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$UPDATE app.accounts SET name = 'Small ' || name RETURNING id$$,
    ARRAY['pantts']::citext[],
    'Should only be able to UPDATE accounts with administration or ownership'
);

-- (shorts, 3, false)
SET "request.jwt.claim.user" TO 3;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT results_eq(
    $$DELETE FROM app.accounts RETURNING id$$,
    ARRAY[]::citext[],
    'Should only be able to DELETE accounts with administration'
);

-- (pantts, 3, owner)
SET "request.jwt.claim.user" TO 3;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$DELETE FROM app.accounts RETURNING id$$,
    ARRAY['pantts']::citext[],
    'Should only be able to DELETE accounts with administration'
);

SELECT finish();
ROLLBACK;
