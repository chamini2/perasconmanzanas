-- Deploy x:tables/accounts/create to pg

BEGIN;

CREATE TABLE app.accounts (
    id         citext
               PRIMARY KEY,
    CONSTRAINT valid_id CHECK (id ~ '^[a-z0-9_.]+$'),
    name       text
               NOT NULL,
    owner_id   integer
               NOT NULL
               REFERENCES app.users (id)
                   ON UPDATE CASCADE
                   ON DELETE CASCADE,
    created_at timestamp with time zone
               DEFAULT now()
               NOT NULL
);

COMMIT;
