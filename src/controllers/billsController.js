const billsService = require('../services/billsService');

async function listBills(req, res) {
  try {
    const bills = await billsService.listBills();
    res.json(bills);
  } catch (err) {
    console.error('listBills error:', err);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
}

async function getBill(req, res) {
  try {
    const { id } = req.params;
    const bill = await billsService.getBillById(id);
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json(bill);
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

    const bill = await billsService.createBill({ title, amount, category, bill_date, notes });
    res.status(201).json(bill);
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

    const bill = await billsService.updateBill(id, { title, amount, category, bill_date, notes });
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.json(bill);
  } catch (err) {
    console.error('updateBill error:', err);
    res.status(500).json({ error: 'Failed to update bill' });
  }
}

async function deleteBill(req, res) {
  try {
    const { id } = req.params;
    const removed = await billsService.deleteBill(id);
    if (!removed) {
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
    const summary = await billsService.getSummary();
    res.json(summary);
  } catch (err) {
    console.error('getSummary error:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
}

module.exports = { listBills, getBill, createBill, updateBill, deleteBill, getSummary };
