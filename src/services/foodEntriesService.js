const foodEntriesRepository = require('../repository/foodEntriesRepository');
const userRepository = require('../repository/userRepository');

const UNIQUE_VIOLATION = '23505';

function computeTotal(morning_price, afternoon_price, night_price) {
  const total = Number(morning_price || 0) + Number(afternoon_price || 0) + Number(night_price || 0);
  return Math.round(total * 100) / 100;
}

function duplicateEntryError() {
  const err = new Error('A food entry already exists for this user and date');
  err.status = 409;
  return err;
}

function userNotFoundError() {
  const err = new Error('User not found');
  err.status = 404;
  return err;
}

async function listEntries({ user_id, entry_date, start_date, end_date, page = 1, limit = 10 } = {}) {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
  const offset = (safePage - 1) * safeLimit;

  const filters = { user_id, entry_date, start_date, end_date };

  const [entries, { total, total_amount }] = await Promise.all([
    foodEntriesRepository.findAll({ ...filters, limit: safeLimit, offset }),
    foodEntriesRepository.countAndSum(filters),
  ]);

  return {
    entries,
    total_amount,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages: Math.ceil(total / safeLimit) || 0,
    },
  };
}

async function getEntryById(id) {
  return foodEntriesRepository.findById(id);
}

async function createEntry(data) {
  const user = await userRepository.findById(data.user_id);
  if (!user) {
    throw userNotFoundError();
  }

  const existing = await foodEntriesRepository.findByUserAndDate(data.user_id, data.entry_date);
  if (existing) {
    throw duplicateEntryError();
  }

  const morning_price = data.morning_price ?? 0;
  const afternoon_price = data.afternoon_price ?? 0;
  const night_price = data.night_price ?? 0;
  const total_price = computeTotal(morning_price, afternoon_price, night_price);
  try {
    return await foodEntriesRepository.create({
      ...data,
      morning_price,
      afternoon_price,
      night_price,
      total_price,
    });
  } catch (err) {
    if (err.code === UNIQUE_VIOLATION) {
      throw duplicateEntryError();
    }
    throw err;
  }
}

async function updateEntry(id, data) {
  const existing = await foodEntriesRepository.findById(id);
  if (!existing) return null;

  const morning_price = data.morning_price !== undefined ? data.morning_price : existing.morning_price;
  const afternoon_price = data.afternoon_price !== undefined ? data.afternoon_price : existing.afternoon_price;
  const night_price = data.night_price !== undefined ? data.night_price : existing.night_price;
  const total_price = computeTotal(morning_price, afternoon_price, night_price);

  try {
    return await foodEntriesRepository.update(id, { ...data, total_price });
  } catch (err) {
    if (err.code === UNIQUE_VIOLATION) {
      throw duplicateEntryError();
    }
    throw err;
  }
}

async function deleteEntry(id) {
  return foodEntriesRepository.remove(id);
}

module.exports = { listEntries, getEntryById, createEntry, updateEntry, deleteEntry };
