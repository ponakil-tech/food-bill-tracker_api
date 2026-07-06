const { Pool, types } = require('pg');

// Return DATE columns (OID 1082) as raw 'YYYY-MM-DD' strings instead of JS Date objects.
// pg's default parser builds a Date at local midnight, which JSON.stringify then
// converts to UTC via toISOString(), shifting the date in non-UTC timezones (e.g. IST).
types.setTypeParser(types.builtins.DATE, (val) => val);

// DATABASE_URL example (Supabase/Neon/Fly Postgres):
// postgresql://user:password@host:5432/dbname?sslmode=require
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client', err);
});

module.exports = pool;
