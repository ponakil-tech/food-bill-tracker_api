const { Pool } = require('pg');

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
