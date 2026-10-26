# Vercel API and shared database

The Vercel deployment uses `api/` serverless functions. Persistent shared data is stored in the Neon Postgres table `ussf_app_state`; Vercel's filesystem is not used for application writes.

## Required environment variables

Configure these in Vercel Project Settings for Preview and Production, and in `.env.local` for local use:

- `DATABASE_URL`: Neon Postgres connection string. Use a pooled connection string for serverless requests.
- `USSF_ADMIN_API_TOKEN`: a randomly generated secret of at least 32 bytes. Do not add the value to source control or a `VITE_` variable.

The admin token is entered when an administrator first performs a group-spec or asset write in a browser tab. The frontend keeps it only in that tab's `sessionStorage`; the server verifies it for every protected mutation.

## One-time seed migration

Back up `data/ussf-database.json` before using it as the initial seed. Set `DATABASE_URL` in `.env.local`, review the seed file, then run:

```powershell
npm run migrate:neon
```

The migration creates the state table and inserts the checked-in snapshot only when row `id = 1` does not already exist. Re-running it does not replace existing Neon data. It does not clear or reset an existing database.

After setting both Vercel environment variables and confirming the migration succeeded, deploy a Preview build first. Verify `GET /api/state`, group-spec reads/writes, asset create/update/delete from two browser sessions, application submission, and account-link submission. Promote to Production only after that verification and explicit approval.

## API routes

- `GET /api/state`, `GET /api/group-info`, `GET /api/assets`: shared persisted reads.
- `POST /api/applications`, `POST /api/link-requests`: pending submissions.
- `POST /api/group-info`, `POST /api/assets`, `PUT /api/assets/:id`, `DELETE /api/assets/:id`: require `USSF_ADMIN_API_TOKEN`.

The local Express server continues to use `data/ussf-database.json` for development and applies the same admin token check to group-spec and asset writes.