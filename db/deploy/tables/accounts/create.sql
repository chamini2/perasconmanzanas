-- Deploy x:tables/accounts/create to pg

BEGIN;

CREATE TABLE app.accounts (
     PRIMARY KEY (id),
     id         citext,
     name       text
                NOT NULL,
     created_at timestamp with time zone
                DEFAULT now()
                NOT NULL
);

COMMIT;
