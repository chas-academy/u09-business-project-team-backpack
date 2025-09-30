const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const countryRoutes = require('./routes/countries');
const userRoutes = require('./routes/users');

// Import passport configuration
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 5001;

// Trust proxy for HTTPS (important for Render)
app.set('trust proxy', 1);

// Debug middleware to log cookies
app.use((req, res, next) => {
  console.log('Request cookies:', req.headers.cookie);
  console.log('Request sessionID:', req.sessionID);
  next();
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: true, // Changed to true to force session save
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: false, // Changed to false to allow JavaScript access
    sameSite: 'none', // Changed to 'none' for cross-domain
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  name: 'connect.sid' // Explicit session name
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/country-explorer')
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

module.exports = app;
