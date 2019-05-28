-- Deploy i:extensions/uuid-ossp to pg

BEGIN;

CREATE EXTENSION "uuid-ossp";

COMMIT;
