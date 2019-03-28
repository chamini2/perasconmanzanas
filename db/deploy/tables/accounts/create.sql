-- Deploy x:tables/accounts/create to pg

BEGIN;

CREATE TABLE app.accounts (
     id         citext
                PRIMARY KEY,
     name       text
                NOT NULL,
     created_at timestamp with time zone
                DEFAULT now()
                NOT NULL
);

COMMIT;
