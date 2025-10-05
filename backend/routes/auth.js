const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  fullName: Joi.string().min(2).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { email, password, fullName } = value;

    // TODO: Fix Supabase configuration - for now, create a mock user
    const mockUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate JWT token for our API
    const token = jwt.sign(
      { 
        userId: mockUserId,
        email: email
      },
      process.env.JWT_SECRET || 'fallback_jwt_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully (mock mode).',
      token,
      user: {
        id: mockUserId,
        email: email,
        fullName: fullName || email.split('@')[0], // Use provided fullName or email prefix
        emailConfirmed: true
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { email, password } = value;

    // TODO: Fix Supabase configuration - for now, mock login
    // In a real implementation, you'd verify the password hash
    const mockUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Generate JWT token for our API
    const token = jwt.sign(
      { 
        userId: mockUserId,
        email: email
      },
      process.env.JWT_SECRET || 'fallback_jwt_secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful (mock mode)',
      token,
      user: {
        id: mockUserId,
        email: email,
        fullName: email.split('@')[0], // Use email prefix as fullName
        avatar: null,
        bio: null
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Logout user
router.post('/logout', async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_jwt_secret');

    res.json({
      success: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        fullName: decoded.email.split('@')[0] // Use email prefix as fullName
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

module.exports = router;

