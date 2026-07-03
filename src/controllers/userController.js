const userService = require('../services/userService');

async function listUsers(req, res) {
  try {
    const users = await userService.listUsers();
    res.json(users);
  } catch (err) {
    console.error('listUsers error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

async function getUser(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('getUser error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

async function createUser(req, res) {
  try {
    const { name, phone, password } = req.body;

    if (!name || typeof name !== 'string' || name.length > 100) {
      return res.status(400).json({ error: 'name is required and must be under 100 characters' });
    }
    if (!phone || typeof phone !== 'string' || phone.length > 15) {
      return res.status(400).json({ error: 'phone is required and must be under 15 characters' });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'password is required' });
    }

    const user = await userService.createUser({ name, phone, password });
    res.status(201).json(user);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('createUser error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, phone, password, status } = req.body;

    if (name !== undefined && name.length > 100) {
      return res.status(400).json({ error: 'name must be under 100 characters' });
    }

    const user = await userService.updateUser(id, { name, phone, password, status });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('updateUser error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const removed = await userService.deleteUser(id);
    if (!removed) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

async function login(req, res) {
  try {
    const { phone, password } = req.body;

    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({ error: 'phone is required' });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'password is required' });
    }

    const user = await userService.login({ phone, password });
    res.json(user);
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error('login error:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
}

module.exports = { listUsers, getUser, createUser, updateUser, deleteUser, login };
