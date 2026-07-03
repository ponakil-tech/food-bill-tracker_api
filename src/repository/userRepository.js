const pool = require('../db/pool');
const User = require('../models/user.model');

function toUser(row) {
  if (!row) return null;
  return new User(row.id, row.name, row.phone, row.password, row.status, row.created_at, row.updated_at);
}

async function findAll() {
  const { rows } = await pool.query('SELECT * FROM users ORDER BY id');
  return rows.map(toUser);
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return toUser(rows[0]);
}

async function findByPhone(phone) {
  const { rows } = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
  return toUser(rows[0]);
}

async function create({ name, phone, password }) {
  const { rows } = await pool.query(
    `INSERT INTO users (name, phone, password)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, phone, password]
  );
  return toUser(rows[0]);
}

async function update(id, { name, phone, password, status }) {
  const { rows } = await pool.query(
    `UPDATE users SET
      name = COALESCE($1, name),
      phone = COALESCE($2, phone),
      password = COALESCE($3, password),
      status = COALESCE($4, status),
      updated_at = now()
     WHERE id = $5
     RETURNING *`,
    [name, phone, password, status, id]
  );
  return toUser(rows[0]);
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { findAll, findById, findByPhone, create, update, remove };
