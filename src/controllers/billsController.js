const billsService = require('../services/billsService');
const { success, error } = require('../utils/apiResponse');

async function listBills(req, res) {
  try {
    const bills = await billsService.listBills();
    return success(res, { data: bills, message: 'Bills fetched successfully' });
  } catch (err) {
    console.error('listBills error:', err);
    return error(res, { message: 'Failed to fetch bills' });
  }
}

async function getBill(req, res) {
  try {
    const { id } = req.params;
    const bill = await billsService.getBillById(id);
    if (!bill) {
      return error(res, { message: 'Bill not found', code: 404 });
    }
    return success(res, { data: bill, message: 'Bill fetched successfully' });
  } catch (err) {
    console.error('getBill error:', err);
    return error(res, { message: 'Failed to fetch bill' });
  }
}

async function createBill(req, res) {
  try {
    const { title, amount, category, bill_date, notes } = req.body;

    if (!title || typeof title !== 'string' || title.length > 250) {
      return error(res, { message: 'title is required and must be under 250 characters', code: 400 });
    }
    if (amount === undefined || isNaN(amount) || Number(amount) < 0) {
      return error(res, { message: 'amount must be a non-negative number', code: 400 });
    }

    const bill = await billsService.createBill({ title, amount, category, bill_date, notes });
    return success(res, { data: bill, message: 'Bill created successfully', code: 201 });
  } catch (err) {
    console.error('createBill error:', err);
    return error(res, { message: 'Failed to create bill' });
  }
}

async function updateBill(req, res) {
  try {
    const { id } = req.params;
    const { title, amount, category, bill_date, notes } = req.body;

    if (title !== undefined && title.length > 250) {
      return error(res, { message: 'title must be under 250 characters', code: 400 });
    }

    const bill = await billsService.updateBill(id, { title, amount, category, bill_date, notes });
    if (!bill) {
      return error(res, { message: 'Bill not found', code: 404 });
    }
    return success(res, { data: bill, message: 'Bill updated successfully' });
  } catch (err) {
    console.error('updateBill error:', err);
    return error(res, { message: 'Failed to update bill' });
  }
}

async function deleteBill(req, res) {
  try {
    const { id } = req.params;
    const removed = await billsService.deleteBill(id);
    if (!removed) {
      return error(res, { message: 'Bill not found', code: 404 });
    }
    return success(res, { message: 'Bill deleted successfully' });
  } catch (err) {
    console.error('deleteBill error:', err);
    return error(res, { message: 'Failed to delete bill' });
  }
}

async function getSummary(req, res) {
  try {
    const summary = await billsService.getSummary();
    return success(res, { data: summary, message: 'Summary fetched successfully' });
  } catch (err) {
    console.error('getSummary error:', err);
    return error(res, { message: 'Failed to fetch summary' });
  }
}

module.exports = { listBills, getBill, createBill, updateBill, deleteBill, getSummary };
