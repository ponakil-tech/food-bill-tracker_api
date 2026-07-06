const foodEntriesService = require('../services/foodEntriesService');
const { success, error } = require('../utils/apiResponse');

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function isValidPrice(value) {
  return value === undefined || value === null || (!isNaN(value) && Number(value) >= 0);
}

async function listEntries(req, res) {
  try {
    const { user_id, entry_date, start_date, end_date, page, limit } = req.query;

    if (start_date !== undefined && !DATE_RE.test(start_date)) {
      return error(res, { message: 'start_date must be in YYYY-MM-DD format', code: 400 });
    }
    if (end_date !== undefined && !DATE_RE.test(end_date)) {
      return error(res, { message: 'end_date must be in YYYY-MM-DD format', code: 400 });
    }
    if (start_date !== undefined && end_date !== undefined && start_date > end_date) {
      return error(res, { message: 'start_date must not be after end_date', code: 400 });
    }
    if (page !== undefined && (isNaN(page) || Number(page) < 1)) {
      return error(res, { message: 'page must be a positive number', code: 400 });
    }
    if (limit !== undefined && (isNaN(limit) || Number(limit) < 1)) {
      return error(res, { message: 'limit must be a positive number', code: 400 });
    }

    const filters = {};
    if (user_id !== undefined) filters.user_id = user_id;
    if (entry_date !== undefined) filters.entry_date = entry_date;
    if (start_date !== undefined) filters.start_date = start_date;
    if (end_date !== undefined) filters.end_date = end_date;
    if (page !== undefined) filters.page = page;
    if (limit !== undefined) filters.limit = limit;

    const { entries, total_amount, pagination } = await foodEntriesService.listEntries(filters);
    return success(res, {
      data: { entries, total_amount, pagination },
      message: 'Food entries fetched successfully',
    });
  } catch (err) {
    console.error('listEntries error:', err);
    return error(res, { message: 'Failed to fetch food entries' });
  }
}

async function getEntry(req, res) {
  try {
    const { id } = req.params;
    const entry = await foodEntriesService.getEntryById(id);
    if (!entry) {
      return error(res, { message: 'Food entry not found', code: 404 });
    }
    return success(res, { data: entry, message: 'Food entry fetched successfully' });
  } catch (err) {
    console.error('getEntry error:', err);
    return error(res, { message: 'Failed to fetch food entry' });
  }
}

async function createEntry(req, res) {
  try {
    const {
      user_id,
      entry_date,
      morning_meal,
      morning_price,
      afternoon_meal,
      afternoon_price,
      night_meal,
      night_price,
      notes,
    } = req.body;

    if (user_id === undefined || isNaN(user_id)) {
      return error(res, { message: 'user_id is required and must be a number', code: 400 });
    }
    if (!entry_date || !DATE_RE.test(entry_date)) {
      return error(res, { message: 'entry_date is required and must be in YYYY-MM-DD format', code: 400 });
    }
    if (!isValidPrice(morning_price) || !isValidPrice(afternoon_price) || !isValidPrice(night_price)) {
      return error(res, { message: 'meal prices must be non-negative numbers', code: 400 });
    }
    if (notes !== undefined && notes !== null && notes.length > 500) {
      return error(res, { message: 'notes must be under 500 characters', code: 400 });
    }

    const entry = await foodEntriesService.createEntry({
      user_id,
      entry_date,
      morning_meal,
      morning_price,
      afternoon_meal,
      afternoon_price,
      night_meal,
      night_price,
      notes,
    });
    return success(res, { data: entry, message: 'Food entry created successfully', code: 201 });
  } catch (err) {
    if (err.status) {
      return error(res, { message: err.message, code: err.status });
    }
    console.error('createEntry error:', err);
    return error(res, { message: 'Failed to create food entry' });
  }
}

async function updateEntry(req, res) {
  try {
    const { id } = req.params;
    const {
      entry_date,
      morning_meal,
      morning_price,
      afternoon_meal,
      afternoon_price,
      night_meal,
      night_price,
      notes,
    } = req.body;

    if (entry_date !== undefined && !DATE_RE.test(entry_date)) {
      return error(res, { message: 'entry_date must be in YYYY-MM-DD format', code: 400 });
    }
    if (!isValidPrice(morning_price) || !isValidPrice(afternoon_price) || !isValidPrice(night_price)) {
      return error(res, { message: 'meal prices must be non-negative numbers', code: 400 });
    }
    if (notes !== undefined && notes !== null && notes.length > 500) {
      return error(res, { message: 'notes must be under 500 characters', code: 400 });
    }

    const entry = await foodEntriesService.updateEntry(id, {
      entry_date,
      morning_meal,
      morning_price,
      afternoon_meal,
      afternoon_price,
      night_meal,
      night_price,
      notes,
    });
    if (!entry) {
      return error(res, { message: 'Food entry not found', code: 404 });
    }
    return success(res, { data: entry, message: 'Food entry updated successfully' });
  } catch (err) {
    if (err.status) {
      return error(res, { message: err.message, code: err.status });
    }
    console.error('updateEntry error:', err);
    return error(res, { message: 'Failed to update food entry' });
  }
}

async function deleteEntry(req, res) {
  try {
    const { id } = req.params;
    const removed = await foodEntriesService.deleteEntry(id);
    if (!removed) {
      return error(res, { message: 'Food entry not found', code: 404 });
    }
    return success(res, { message: 'Food entry deleted successfully' });
  } catch (err) {
    console.error('deleteEntry error:', err);
    return error(res, { message: 'Failed to delete food entry' });
  }
}

module.exports = { listEntries, getEntry, createEntry, updateEntry, deleteEntry };
