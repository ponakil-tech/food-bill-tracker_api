const pool = require('../db/pool');

function buildConditions({ user_id, entry_date, start_date, end_date }) {
  const conditions = [];
  const params = [];

  if (user_id !== undefined) {
    params.push(user_id);
    conditions.push(`user_id = $${params.length}`);
  }
  if (entry_date !== undefined) {
    params.push(entry_date);
    conditions.push(`entry_date = $${params.length}`);
  }
  if (start_date !== undefined) {
    params.push(start_date);
    conditions.push(`entry_date >= $${params.length}`);
  }
  if (end_date !== undefined) {
    params.push(end_date);
    conditions.push(`entry_date <= $${params.length}`);
  }

  return { where: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', params };
}

async function findAll({ user_id, entry_date, start_date, end_date, limit, offset } = {}) {
  const { where, params } = buildConditions({ user_id, entry_date, start_date, end_date });
  const queryParams = [...params, limit, offset];

  const { rows } = await pool.query(
    `SELECT * FROM food_entries ${where}
     ORDER BY created_at DESC
     LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}`,
    queryParams
  );
  return rows;
}

async function countAndSum({ user_id, entry_date, start_date, end_date } = {}) {
  const { where, params } = buildConditions({ user_id, entry_date, start_date, end_date });
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS total, COALESCE(SUM(total_price), 0)::numeric AS total_amount
     FROM food_entries ${where}`,
    params
  );
  return {
    total: rows[0].total,
    total_amount: Number(rows[0].total_amount),
  };
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM food_entries WHERE id = $1', [id]);
  return rows[0] || null;
}

async function findByUserAndDate(user_id, entry_date) {
  const { rows } = await pool.query(
    'SELECT * FROM food_entries WHERE user_id = $1 AND entry_date = $2',
    [user_id, entry_date]
  );
  return rows[0] || null;
}

async function create({
  user_id,
  entry_date,
  morning_meal,
  morning_price,
  afternoon_meal,
  afternoon_price,
  night_meal,
  night_price,
  total_price,
  notes,
}) {
  const { rows } = await pool.query(
    `INSERT INTO food_entries
      (user_id, entry_date, morning_meal, morning_price, afternoon_meal, afternoon_price, night_meal, night_price, total_price, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [user_id, entry_date, morning_meal, morning_price, afternoon_meal, afternoon_price, night_meal, night_price, total_price, notes]
  );
  return rows[0];
}

async function update(id, {
  entry_date,
  morning_meal,
  morning_price,
  afternoon_meal,
  afternoon_price,
  night_meal,
  night_price,
  total_price,
  notes,
}) {
  const { rows } = await pool.query(
    `UPDATE food_entries SET
      entry_date = COALESCE($1, entry_date),
      morning_meal = COALESCE($2, morning_meal),
      morning_price = COALESCE($3, morning_price),
      afternoon_meal = COALESCE($4, afternoon_meal),
      afternoon_price = COALESCE($5, afternoon_price),
      night_meal = COALESCE($6, night_meal),
      night_price = COALESCE($7, night_price),
      total_price = COALESCE($8, total_price),
      notes = COALESCE($9, notes),
      updated_at = now()
     WHERE id = $10
     RETURNING *`,
    [entry_date, morning_meal, morning_price, afternoon_meal, afternoon_price, night_meal, night_price, total_price, notes, id]
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rowCount } = await pool.query('DELETE FROM food_entries WHERE id = $1', [id]);
  return rowCount > 0;
}

module.exports = { findAll, countAndSum, findById, findByUserAndDate, create, update, remove };
