# To-do

- [ ] Add security for users table in PostgREST
- [ ] Change `auth` schema name for `internal` or something like that
- [ ] Add security for specific columns, like `app.invites.claimed_at` (only through trigger)

# Ideas

- [ ] Add Metabase
- [ ] Add Analytics

# To-do for deployment

- [ ] Reverse proxy (nginx) to differentiate between `db.*` and `api.*`
- [ ] SSL with Let's Encrypt
- [ ] Figure out how to deploy React App (S3, probably)
