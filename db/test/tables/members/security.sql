BEGIN;
SELECT plan(8);

INSERT INTO app.users (id, username, email, full_name)
VALUES
    (1, 'john', 'john@example.com', 'John Doe'),
    (2, 'matt', 'matt@example.com', 'Matt Patt'),
    (3, 'chris', 'chris@example.com', 'Chris Fritz');

INSERT INTO app.accounts (id, name, owner_id)
VALUES
    ('shorts', 'Shorts Store', 1),
    ('pantts', 'Pantts Store', 3),
    ('skirts', 'Skirts Store', 3);

INSERT INTO app.members (account_id, user_id, admin)
VALUES
    ('shorts', 1, true),
    ('shorts', 2, false),
    ('shorts', 3, false),
    ('pantts', 2, true),
    ('skirts', 3, false);

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT results_eq(
    $$SELECT account_id::text, user_id, admin FROM app.members ORDER BY user_id$$,
    $$VALUES ('shorts', 1, true), ('shorts', 2, false), ('shorts', 3, false)$$,
    'Should SELECT members from selected account'
);

-- (pantts, 2, true)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT lives_ok(
    $$
        INSERT INTO app.members (account_id, user_id, admin)
        VALUES ('pantts', 1, false)
    $$,
    'Should INSERT members in selected account with administration'
);

-- (pantts, 1, false)
SET "request.jwt.claim.user" TO 1;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_user;
SELECT throws_ok(
    $$
        INSERT INTO app.members (account_id, user_id, admin)
        VALUES ('pantts', 3, false)
    $$,
    42501
);

-- (pantts, 2, true)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$
        UPDATE app.members SET
            admin = false
        WHERE user_id = 1
        RETURNING account_id, user_id
    $$,
    $$VALUES ('pantts'::citext, 1)$$,
    'Should UPDATE members in selected account with administration'
);

-- (shorts, 1, true)
SET "request.jwt.claim.user" TO 1;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_admin;
SELECT throws_ok(
    $$
        UPDATE app.members SET
            account_id = 'skirts'
        WHERE user_id = 1 AND account_id = 'shorts'
    $$,
    42501
);

-- (pantts, 1, false)
SET "request.jwt.claim.user" TO 1;
SET "request.jwt.claim.account" TO 'pantts';
SET SESSION AUTHORIZATION web_user;
SELECT throws_ok(
    $$
        UPDATE app.members SET
            admin = true
        WHERE user_id = 1
    $$,
    42501
);

-- (shorts, 1, true)
SET "request.jwt.claim.user" TO 1;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$
        DELETE FROM app.members
        WHERE user_id = 3
        RETURNING account_id, user_id
    $$,
    $$VALUES ('shorts'::citext, 3)$$,
    'Should DELETE members in selected account with administration'
);

-- (shorts, 2, false)
SET "request.jwt.claim.user" TO 2;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_user;
SELECT results_eq(
    $$
        DELETE FROM app.members
        RETURNING account_id, user_id
    $$,
    $$VALUES ('shorts'::citext, 2)$$,
    'Should DELETE themselves from selected account without administration'
);

SELECT finish();
ROLLBACK;
