const userService = require('../services/userService');
const { success, error } = require('../utils/apiResponse');

async function listUsers(req, res) {
  try {
    const users = await userService.listUsers();
    return success(res, { data: users, message: 'Users fetched successfully' });
  } catch (err) {
    console.error('listUsers error:', err);
    return error(res, { message: 'Failed to fetch users' });
  }
}

async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      return error(res, { message: 'User not found', code: 404 });
    }
    return success(res, { data: user, message: 'User fetched successfully' });
  } catch (err) {
    console.error('getUser error:', err);
    return error(res, { message: 'Failed to fetch user' });
  }
}

async function createUser(req, res) {
  try {
    const { name, phone, password } = req.body;

    if (!name || typeof name !== 'string' || name.length > 100) {
      return error(res, { message: 'name is required and must be under 100 characters', code: 400 });
    }
    if (!phone || typeof phone !== 'string' || phone.length > 15) {
      return error(res, { message: 'phone is required and must be under 15 characters', code: 400 });
    }
    if (!password || typeof password !== 'string') {
      return error(res, { message: 'password is required', code: 400 });
    }

    const user = await userService.createUser({ name, phone, password });
    return success(res, { data: user, message: 'User created successfully', code: 201 });
  } catch (err) {
    if (err.status) {
      return error(res, { message: err.message, code: err.status });
    }
    console.error('createUser error:', err);
    return error(res, { message: 'Failed to create user' });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, phone, password, status } = req.body;

    if (name !== undefined && name.length > 100) {
      return error(res, { message: 'name must be under 100 characters', code: 400 });
    }

    const user = await userService.updateUser(id, { name, phone, password, status });
    if (!user) {
      return error(res, { message: 'User not found', code: 404 });
    }
    return success(res, { data: user, message: 'User updated successfully' });
  } catch (err) {
    if (err.status) {
      return error(res, { message: err.message, code: err.status });
    }
    console.error('updateUser error:', err);
    return error(res, { message: 'Failed to update user' });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const removed = await userService.deleteUser(id);
    if (!removed) {
      return error(res, { message: 'User not found', code: 404 });
    }
    return success(res, { message: 'User deleted successfully' });
  } catch (err) {
    console.error('deleteUser error:', err);
    return error(res, { message: 'Failed to delete user' });
  }
}

async function login(req, res) {
  try {
    const { phone, password } = req.body;

    if (!phone || typeof phone !== 'string') {
      return error(res, { message: 'phone is required', code: 400 });
    }
    if (!password || typeof password !== 'string') {
      return error(res, { message: 'password is required', code: 400 });
    }

    const user = await userService.login({ phone, password });
    return success(res, { data: user, message: 'Login successful' });
  } catch (err) {
    if (err.status) {
      return error(res, { message: err.message, code: err.status });
    }
    console.error('login error:', err);
    return error(res, { message: 'Failed to login' });
  }
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser, login };
