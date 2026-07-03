const pool = require('../db/pool');

async function findAll() {
  const { rows } = await pool.query(
    'SELECT * FROM bills ORDER BY bill_date DESC, created_at DESC'
  );
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM bills WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create({ title, amount, category, bill_date, notes }) {
  const { rows } = await pool.query(
    `INSERT INTO bills (title, amount, category, bill_date, notes)
     VALUES ($1, $2, COALESCE($3, 'general'), COALESCE($4, CURRENT_DATE), $5)
     RETURNING *`,
    [title, amount, category, bill_date, notes]
  );
  return rows[0];
}

async function update(id, { title, amount, category, bill_date, notes }) {
  const { rows } = await pool.query(
    `UPDATE bills SET
      title = COALESCE($1, title),
      amount = COALESCE($2, amount),
      category = COALESCE($3, category),
      bill_date = COALESCE($4, bill_date),
      notes = COALESCE($5, notes),
      updated_at = now()
     WHERE id = $6
     RETURNING *`,
    [title, amount, category, bill_date, notes, id]
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM bills WHERE id = $1', [id]);
  return rowCount > 0;
}

async function summaryByCategory() {
  const { rows } = await pool.query(
    `SELECT category, COUNT(*)::int AS count, SUM(amount)::numeric AS total
     FROM bills
     GROUP BY category
     ORDER BY total DESC`
  );
  return rows;
}

module.exports = { findAll, findById, create, update, remove, summaryByCategory };
