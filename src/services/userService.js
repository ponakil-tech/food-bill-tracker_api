const userRepository = require('../repository/userRepository');

function sanitize(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

async function listUsers() {
  const users = await userRepository.findAll();
  return users.map(sanitize);
}

async function getUserById(id) {
  const user = await userRepository.findById(id);
  return sanitize(user);
}

async function createUser({ name, phone, password }) {
  const existing = await userRepository.findByPhone(phone);
  if (existing) {
    const err = new Error('phone is already registered');
    err.status = 409;
    throw err;
  }
  const user = await userRepository.create({ name, phone, password });
  return sanitize(user);
}

async function updateUser(id, { name, phone, password, status }) {
  const user = await userRepository.update(id, { name, phone, password, status });
  return sanitize(user);
}

async function deleteUser(id) {
  return userRepository.remove(id);
}

async function login({ phone, password }) {
  const user = await userRepository.findByPhone(phone);
  if (!user) {
    const err = new Error('User Not Found');
    err.status = 401;
    throw err;
  }
  if (!user.status) {
    const err = new Error('account is disabled');
    err.status = 403;
    throw err;
  }
  if (user.password !== password) {
    const err = new Error('invalid phone or password');
    err.status = 401;
    throw err;
  }
  return sanitize(user);
}

module.exports = { listUsers, getUserById, createUser, updateUser, deleteUser, login };
