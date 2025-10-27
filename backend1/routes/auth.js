// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, user_type, location } = req.body;

    // Validation
    if (!name || !email || !password || !user_type) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['traveler', 'owner'].includes(user_type)) {
      return res.status(400).json({ error: 'Invalid user type' });
    }

    const db = req.app.locals.db;

    // Check if user exists
    const [existingUsers] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, user_type, location) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, user_type, location || null]
    );

    res.status(201).json({
      message: 'User created successfully',
      userId: result.insertId,
      user_type
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = req.app.locals.db;

    // Find user
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    req.session.userId = user.id;
    req.session.userType = user.user_type;

    // Remove password from response
    delete user.password;

    res.json({
      message: 'Login successful',
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const db = req.app.locals.db;
    const [users] = await db.query(
      'SELECT id, name, email, user_type, phone_number, about_me, city, country, languages, gender, profile_picture, location FROM users WHERE id = ?',
      [req.session.userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;