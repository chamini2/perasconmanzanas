-- Deploy i:tables/invites/create to pg

BEGIN;

CREATE TABLE app.invites (
    id         uuid
               DEFAULT uuid_generate_v4()
               PRIMARY KEY,
    account_id citext
               NOT NULL
               REFERENCES app.accounts (id)
                   ON UPDATE CASCADE
                   ON DELETE CASCADE,
    notes      text
               NOT NULL
);

COMMIT;
