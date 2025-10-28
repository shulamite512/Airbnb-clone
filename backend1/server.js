// server.js
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
const uploadRoutes = require('./routes/upload');
const galleryRoutes = require('./routes/gallery');





// Create Express app
const app = express();

//  CORS CONFIGURATION
// Allow requests from frontend (React)
// Configure CORS to allow the Vite dev server (typically on 5173) and the React port (3000).
// This also supports an environment variable FRONTEND_URL and an option to allow all origins for dev.
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176'
];
const allowAll = process.env.ALLOW_ALL_CORS === 'true';

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowAll) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true
}));

// MIDDLEWARE 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  SESSION CONFIGURATION 
app.use(
  session({
    secret: 'supersecretkey', // change for production
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // set true if using https
      maxAge: 1000 * 60 * 60 * 2 // 2 hours
    }
  })
);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// ====== DATABASE CONNECTION (XAMPP MySQL) ======
const initDB = async () => {
  try {
    const db = await mysql.createPool({
      host: 'localhost',
      user: 'root',      // XAMPP default user
      password: '',      // XAMPP default has no password
      database: 'airbnb_clone',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Make db accessible in all routes
    app.locals.db = db;
    console.log('Connected to MySQL database (XAMPP).');

    // ====== ROUTE IMPORTS ======
    const authRoutes = require('./routes/auth');
    const travelerRoutes = require('./routes/traveler');
    const ownerRoutes = require('./routes/owner');
    const propertyRoutes = require('./routes/property');
    const bookingRoutes = require('./routes/booking');
    const servicesRoutes = require('./routes/services');

    // ====== ROUTE MOUNTING ======
    app.use('/api/auth', authRoutes);
    app.use('/api/traveler', travelerRoutes);
    app.use('/api/owner', ownerRoutes);
    app.use('/api/properties', propertyRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/services', servicesRoutes);
    app.use('/api/upload', uploadRoutes);
    app.use('/api/gallery', galleryRoutes);

    // Root route for quick check
    app.get('/', (req, res) => {
      res.send(' Airbnb Clone Backend is running successfully!');
    });

    // ====== START SERVER ======
    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error(' Database connection failed:', error);
    process.exit(1);
  }
};

// Initialize DB + start server
initDB();
