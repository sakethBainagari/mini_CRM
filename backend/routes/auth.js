const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { userSchemas, validate } = require('../middleware/validation');

const router = express.Router();

// Register
router.post('/register', validate(userSchemas.register), async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
        errors: [{ field: 'email', message: 'Email is already registered' }]
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash: hashedPassword });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      errors: [{ field: 'general', message: e.message }]
    });
  }
});

// Login
router.post('/login', validate(userSchemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: [{ field: 'email', message: 'Email not found' }]
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
        errors: [{ field: 'password', message: 'Incorrect password' }]
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      errors: [{ field: 'general', message: e.message }]
    });
  }
});

module.exports = router;
