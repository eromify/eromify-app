const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase configuration
const supabaseUrl = 'https://eyteuevblxvhjhyeivqh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5dGV1ZXZibHh2aGpoeWVpdnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzYzNjAsImV4cCI6MjA3NTAxMjM2MH0.aTPGEVfNom78Cm9ZmwbMwyzTJ0KkqUE0uIHjBo-MZUA';

const supabase = createClient(supabaseUrl, supabaseKey);

// CORS middleware - allow requests from frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Eromify Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Test Supabase connection
app.get('/test-supabase', async (req, res) => {
  try {
    // Try to fetch from the users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Supabase connection failed',
        details: error.message
      });
    }

    res.json({
      success: true,
      message: 'Supabase connection successful!',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Test Supabase: http://localhost:${PORT}/test-supabase`);
});

module.exports = app;
