import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { config } from 'dotenv';
import { neon } from '@neondatabase/serverless';

config({ path: '.env.local' });
config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL is required. Set it in .env.local or the shell before running this migration.');
  process.exit(1);
}

const seedPath = new URL('../data/ussf-database.json', import.meta.url);
const seed = JSON.parse(readFileSync(seedPath, 'utf8'));
if (!seed || typeof seed !== 'object' || !Array.isArray(seed.members) || !Array.isArray(seed.customAssets)) {
  throw new Error('The bundled database snapshot does not match the expected USSF state shape.');
}

const backupDirectory = new URL('../data/backups/', import.meta.url);
mkdirSync(backupDirectory, { recursive: true });
const backupName = `ussf-database-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
copyFileSync(seedPath, new URL(backupName, backupDirectory));

const sql = neon(connectionString);
await sql`
  CREATE TABLE IF NOT EXISTS ussf_app_state (
    id SMALLINT PRIMARY KEY CHECK (id = 1),
    state JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;
const seeded = await sql`
  INSERT INTO ussf_app_state (id, state)
  VALUES (1, ${JSON.stringify(seed)}::jsonb)
  ON CONFLICT (id) DO NOTHING
  RETURNING id
`;

console.log(seeded.length ? 'Neon state initialized from data/ussf-database.json.' : 'Neon state already exists; existing data was preserved.');
