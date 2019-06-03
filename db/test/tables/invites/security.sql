BEGIN;
SELECT plan(5);

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

INSERT INTO app.invites (account_id, notes)
VALUES
    ('shorts', 'For Matt Patt'),
    ('shorts', 'For Chris'),
    ('skirts', 'For anyone');

-- (shorts, 1, true)
SET "request.jwt.claim.user" TO 1;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$SELECT account_id::text FROM app.invites$$,
    $$VALUES ('shorts'), ('shorts')$$,
    'Should SELECT invites from selected account'
);

-- (shorts, 1, true)
SET "request.jwt.claim.user" TO 1;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_admin;
SELECT lives_ok(
    $$
      INSERT INTO app.invites (account_id, notes)
      VALUES ('shorts', 'For anon')
    $$,
    'Should INSERT invites in selected account with administration'
);

-- (skirts, 3, true)
SET "request.jwt.claim.user" TO 3;
SET "request.jwt.claim.account" TO 'skirts';
SET SESSION AUTHORIZATION web_admin;
SELECT throws_ok(
    $$
      INSERT INTO app.invites (account_id, notes)
      VALUES ('pantts', 'For John')
    $$,
    42501
);

-- (shorts, 1, true)
SET "request.jwt.claim.user" TO 1;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$
        UPDATE app.invites SET
            notes = notes || '?'
        RETURNING account_id
    $$,
    $$VALUES ('shorts'::citext), ('shorts'::citext), ('shorts'::citext)$$,
    'Should UPDATE invites from selected account'
);

-- (shorts, 1, true)
SET "request.jwt.claim.user" TO 1;
SET "request.jwt.claim.account" TO 'shorts';
SET SESSION AUTHORIZATION web_admin;
SELECT results_eq(
    $$
        DELETE FROM app.invites
        RETURNING account_id
    $$,
    $$VALUES ('shorts'::citext), ('shorts'::citext), ('shorts'::citext)$$,
    'Should DELETE invites from selected account'
);

SELECT finish();
ROLLBACK;
