-- Deploy i:functions/trigger_function_account_has_at_least_one_member to pg

BEGIN;

CREATE FUNCTION account_has_at_least_one_member() RETURNS trigger
  LANGUAGE plpgsql
  AS $$
  BEGIN
    PERFORM 1
    FROM app.accounts
    WHERE id = OLD.account_id;

    IF NOT FOUND
    THEN
      -- The whole account is being deleted
      RETURN OLD;
    END IF;

    PERFORM 1
    FROM app.members
    WHERE account_id = OLD.account_id
      AND admin;

    IF NOT FOUND
    THEN
      RAISE EXCEPTION 'account (%) cannot remain without members', OLD.account_id;
    END IF;

    RETURN OLD;
  END;
  $$;

COMMIT;
