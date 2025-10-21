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

    try {
      // Create user in Supabase
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (supabaseError) {
        console.error('Supabase registration error:', supabaseError);
        
        // Handle specific registration errors
        if (supabaseError.message.includes('User already registered') || 
            supabaseError.message.includes('already been registered')) {
          return res.status(400).json({
            success: false,
            error: 'An account with this email already exists'
          });
        }
        
        return res.status(500).json({
          success: false,
          error: 'Registration failed. Please try again.'
        });
      }

      if (!data.user) {
        return res.status(400).json({
          success: false,
          error: 'Failed to create user'
        });
      }

      // Generate JWT token for our API
      const token = jwt.sign(
        { 
          userId: data.user.id,
          email: data.user.email
        },
        process.env.JWT_SECRET || 'fallback_jwt_secret',
        { expiresIn: '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please check your email to confirm your account.',
        token,
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: fullName,
          emailConfirmed: data.user.email_confirmed_at ? true : false
        }
      });

    } catch (supabaseError) {
      console.error('Supabase connection error:', supabaseError);
      return res.status(500).json({
        success: false,
        error: 'Authentication service unavailable. Please try again later.'
      });
    }

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

    try {
      // Sign in with Supabase - this will validate the email/password combination
      const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (supabaseError) {
        console.error('Supabase login error:', supabaseError);
        // Return proper error message for invalid credentials
        if (supabaseError.message.includes('Invalid login credentials') || 
            supabaseError.message.includes('Email not confirmed') ||
            supabaseError.message.includes('User not found')) {
          return res.status(401).json({
            success: false,
            error: 'Invalid email or password'
          });
        }
        
        return res.status(500).json({
          success: false,
          error: 'Login failed. Please try again.'
        });
      }

      if (!data.user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Generate JWT token for our API
      const token = jwt.sign(
        { 
          userId: data.user.id,
          email: data.user.email
        },
        process.env.JWT_SECRET || 'fallback_jwt_secret',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.full_name || email.split('@')[0],
          avatar: data.user.user_metadata?.avatar_url || null,
          bio: data.user.user_metadata?.bio || null,
          emailConfirmed: data.user.email_confirmed_at ? true : false
        }
      });

    } catch (supabaseError) {
      console.error('Supabase connection error:', supabaseError);
      return res.status(500).json({
        success: false,
        error: 'Authentication service unavailable. Please try again later.'
      });
    }

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

// Google OAuth callback
router.post('/google-callback', async (req, res) => {
  try {
    const { access_token } = req.body;

    if (!access_token) {
      return res.status(400).json({
        success: false,
        error: 'Access token required'
      });
    }

    try {
      // Get user info from Supabase using the access token
      const { data: { user }, error } = await supabase.auth.getUser(access_token);

      if (error || !user) {
        console.error('Supabase user fetch error:', error);
        return res.status(400).json({
          success: false,
          error: 'Invalid access token'
        });
      }

      // Generate JWT token for our API
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email
        },
        process.env.JWT_SECRET || 'fallback_jwt_secret',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Google OAuth successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.user_metadata?.full_name || user.user_metadata?.name || user.email.split('@')[0],
          avatar: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          bio: user.user_metadata?.bio || null,
          emailConfirmed: user.email_confirmed_at ? true : false
        }
      });

    } catch (supabaseError) {
      console.error('Supabase connection error:', supabaseError);
      return res.status(500).json({
        success: false,
        error: 'Authentication service unavailable. Please try again later.'
      });
    }

  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.status(500).json({
      success: false,
      error: 'Google OAuth failed'
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

