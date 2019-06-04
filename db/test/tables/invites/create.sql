BEGIN;
SELECT plan(33);

SELECT has_table('app'::name, 'invites'::name);
SELECT has_pk('app'::name, 'invites'::name, 'Table app.invites should have a PRIMARY KEY');
SELECT col_is_pk('app'::name, 'invites'::name, 'id'::name, 'Column app.invites.id should be the PRIMARY KEY');

SELECT has_column('app'::name, 'invites'::name, 'id'::name, 'Column app.invites.id should exist');
SELECT col_type_is('app'::name, 'invites'::name, 'id'::name, 'uuid'::name);
SELECT col_not_null('app'::name, 'invites'::name, 'id'::name, 'Column app.invites.id should be NOT NULL');
SELECT col_has_default('app'::name, 'invites'::name, 'id'::name, 'Column app.invites.id should have a DEFAULT');

SELECT has_column('app'::name, 'invites'::name, 'account_id'::name, 'Column app.invites.account_id should exist');
SELECT col_type_is('app'::name, 'invites'::name, 'account_id'::name, 'citext'::name);
SELECT col_not_null('app'::name, 'invites'::name, 'account_id'::name, 'Column app.invites.account_id should be NOT NULL');
SELECT col_is_fk('app'::name, 'invites'::name, 'account_id'::name, 'Column app.invites.account_id should be a FOREIGN KEY');
SELECT fk_ok('app'::name, 'invites'::name, 'account_id'::name, 'app'::name, 'accounts'::name, 'id'::name);

SELECT has_column('app'::name, 'invites'::name, 'notes'::name, 'Column app.invites.notes should exist');
SELECT col_type_is('app'::name, 'invites'::name, 'notes'::name, 'text'::name);
SELECT col_not_null('app'::name, 'invites'::name, 'notes'::name, 'Column app.invites.notes should be NOT NULL');

SELECT has_column('app'::name, 'invites'::name, 'claimed_by_id'::name, 'Column app.invites.claimed_by_id should exist');
SELECT col_type_is('app'::name, 'invites'::name, 'claimed_by_id'::name, 'integer'::name);
SELECT col_is_null('app'::name, 'invites'::name, 'claimed_by_id'::name, 'Column app.invites.claimed_by_id should be NULL');
SELECT col_is_fk('app'::name, 'invites'::name, 'claimed_by_id'::name, 'Column app.invites.claimed_by_id should be a FOREIGN KEY');
SELECT fk_ok('app'::name, 'invites'::name, 'claimed_by_id'::name, 'app'::name, 'users'::name, 'id'::name);

SELECT has_column('app'::name, 'invites'::name, 'claimed_at'::name, 'Column app.invites.claimed_at should exist');
SELECT col_type_is('app'::name, 'invites'::name, 'claimed_at'::name, 'timestamp with time zone'::name);
SELECT col_is_null('app'::name, 'invites'::name, 'claimed_at'::name, 'Column app.invites.claimed_at should be NULL');

SELECT has_check('app'::name, 'invites'::name, 'Table app.invites should have a CHECK constraint');

INSERT INTO app.users (id, username, email, full_name)
VALUES (1, 'john', 'john@example.com', 'John Doe');

INSERT INTO app.accounts (id, name, owner_id)
VALUES ('shorts', 'Shorts store', 1);

SELECT throws_ok(
    $$
        INSERT INTO app.invites (account_id, notes, claimed_by_id, claimed_at)
        VALUES ('shorts', '', 1, NULL)
    $$,
    23514
);
SELECT throws_ok(
    $$
        INSERT INTO app.invites (account_id, notes, claimed_by_id, claimed_at)
        VALUES ('shorts', '', NULL, CURRENT_TIMESTAMP)
    $$,
    23514
);
SELECT lives_ok(
    $$
        INSERT INTO app.invites (account_id, notes, claimed_by_id, claimed_at)
        VALUES ('shorts', '', 1, CURRENT_TIMESTAMP)
    $$
);
SELECT lives_ok(
    $$
        INSERT INTO app.invites (account_id, notes, claimed_by_id, claimed_at)
        VALUES ('shorts', '', NULL, NULL)
    $$
);

SELECT has_column('app'::name, 'invites'::name, 'created_at'::name, 'Column app.invites.created_at should exist');
SELECT col_type_is('app'::name, 'invites'::name, 'created_at'::name, 'timestamp with time zone'::name);
SELECT col_not_null('app'::name, 'invites'::name, 'created_at'::name, 'Column app.invites.created_at should be NOT NULL');
SELECT col_has_default('app'::name, 'invites'::name, 'created_at'::name, 'Column app.invites.created_at should have a DEFAULT');
SELECT col_default_is('app'::name, 'invites'::name, 'created_at'::name, 'now()', 'Column app.invites.created_at should set DEFAULT to now()');

SELECT finish();
ROLLBACK;
