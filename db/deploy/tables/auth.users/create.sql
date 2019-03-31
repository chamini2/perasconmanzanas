-- Deploy i:tables/auth.users/create to pg

BEGIN;

CREATE TABLE auth.users (
    id integer
       PRIMARY KEY
       REFERENCES app.users (id)
           ON UPDATE CASCADE
           ON DELETE CASCADE,
    password text
);

COMMIT;
