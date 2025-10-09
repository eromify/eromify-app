const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

// Set default Supabase configuration if not in environment
if (!process.env.SUPABASE_URL) {
  process.env.SUPABASE_URL = 'https://eyteuevblxvhjhyeivqh.supabase.co';
}
if (!process.env.SUPABASE_ANON_KEY) {
  process.env.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5dGV1ZXZibHh2aGpoeWVpdnFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzYzNjAsImV4cCI6MjA3NTAxMjM2MH0.aTPGEVfNom78Cm9ZmwbMwyzTJ0KkqUE0uIHjBo-MZUA';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your_jwt_secret_key_dev';
}
if (!process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL = 'https://eromify.com';
}

const authRoutes = require('./routes/auth');
const influencerRoutes = require('./routes/influencers');
const contentRoutes = require('./routes/content');
const userRoutes = require('./routes/users');
const paymentRoutes = require('./routes/payments');
const analyticsRoutes = require('./routes/analytics');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5183',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5181',
  'https://eromify.com',
  'https://www.eromify.com',
  'https://app.eromify.com'
];

console.log('🔧 CORS Configuration:', {
  FRONTEND_URL: process.env.FRONTEND_URL,
  allowedOrigins: allowedOrigins
});

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Logging
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Make uploads directory accessible
app.use('/uploads', express.static('uploads'));

// Global upload middleware
app.use(upload.single('avatar'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/influencers', influencerRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 CORS enabled for: ${allowedOrigins.join(', ')}`);
});

module.exports = app;

