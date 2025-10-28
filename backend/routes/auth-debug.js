const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
require('dotenv').config();

console.log('Environment variables check:');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? process.env.SUPABASE_ANON_KEY.substring(0, 20) + '...' : 'NOT SET');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

console.log('Supabase client created successfully');

const router = express.Router();

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection test successful');
    }
  } catch (err) {
    console.error('Supabase connection test error:', err);
  }
}

testSupabaseConnection();

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
  console.log('Register endpoint called');
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: error.details[0].message
      });
    }

    const { email, password, fullName } = value;
    console.log('Attempting to register user:', email);

    try {
      // Create user in Supabase
      console.log('Calling supabase.auth.signUp...');
      const { data, error: supabaseError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      console.log('Supabase signUp response:', { data: data ? 'success' : 'no data', error: supabaseError });

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
      console.error('Supabase error details:', {
        message: supabaseError.message,
        name: supabaseError.name,
        stack: supabaseError.stack
      });
      return res.status(500).json({
        success: false,
        error: supabaseError.message || 'Authentication service unavailable. Please try again later.'
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

module.exports = router;
