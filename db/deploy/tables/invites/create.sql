-- Deploy i:tables/invites/create to pg

BEGIN;

CREATE TABLE app.invites (
    id            uuid
                  DEFAULT uuid_generate_v4()
                  PRIMARY KEY,
    account_id    citext
                  NOT NULL
                  REFERENCES app.accounts (id)
                      ON UPDATE CASCADE
                      ON DELETE CASCADE,
    notes         text
                  NOT NULL,
    claimed_by_id integer
                  REFERENCES app.users (id)
                      ON UPDATE CASCADE
                      ON DELETE CASCADE,
    claimed_at    timestamp with time zone,
    CONSTRAINT    claimed_or_not CHECK (claimed_by_id IS NOT NULL AND claimed_at IS NOT NULL OR claimed_by_id IS NULL AND claimed_at IS NULL),
    created_at    timestamp with time zone
                  DEFAULT now()
                  NOT NULL
);

COMMIT;
