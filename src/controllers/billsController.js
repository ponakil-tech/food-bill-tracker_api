const pool = require('../db/pool');

async function listBills(req, res) {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM bills ORDER BY bill_date DESC, created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('listBills error:', err);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
}

async function getBill(req, res) {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT * FROM bills WHERE id = $1', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('getBill error:', err);
    res.status(500).json({ error: 'Failed to fetch bill' });
  }
}

async function createBill(req, res) {
  try {
    const { title, amount, category, bill_date, notes } = req.body;

    if (!title || typeof title !== 'string' || title.length > 250) {
      return res.status(400).json({ error: 'title is required and must be under 250 characters' });
    }
    if (amount === undefined || isNaN(amount) || Number(amount) < 0) {
      return res.status(400).json({ error: 'amount must be a non-negative number' });
    }

    const { rows } = await pool.query(
      `INSERT INTO bills (title, amount, category, bill_date, notes)
       VALUES ($1, $2, COALESCE($3, 'general'), COALESCE($4, CURRENT_DATE), $5)
       RETURNING *`,
      [title, amount, category, bill_date, notes]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('createBill error:', err);
    res.status(500).json({ error: 'Failed to create bill' });
  }
}

async function updateBill(req, res) {
  try {
    const { id } = req.params;
    const { title, amount, category, bill_date, notes } = req.body;

    if (title !== undefined && title.length > 250) {
      return res.status(400).json({ error: 'title must be under 250 characters' });
    }

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

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('updateBill error:', err);
    res.status(500).json({ error: 'Failed to update bill' });
  }
}

async function deleteBill(req, res) {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM bills WHERE id = $1', [id]);
    if (rowCount === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('deleteBill error:', err);
    res.status(500).json({ error: 'Failed to delete bill' });
  }
}

async function getSummary(req, res) {
  try {
    const { rows } = await pool.query(
      `SELECT category, COUNT(*)::int AS count, SUM(amount)::numeric AS total
       FROM bills
       GROUP BY category
       ORDER BY total DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('getSummary error:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
}

module.exports = { listBills, getBill, createBill, updateBill, deleteBill, getSummary };
