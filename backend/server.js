const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');  
const orderRoutes = require('./routes/orderRoutes');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5501;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // To parse JSON request bodies

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// API Routes
// All routes defined in orderRoutes will be prefixed with /api/orders
app.use('/api/orders', orderRoutes);

// Add a simple health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// ------------------- Serve Frontend -------------------
app.use(express.static(path.join(__dirname, '..')));  // serve static files from project root

// For the root URL, send index.html from project root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Add this route to serve the sitemap
app.get('/sitemap.xml', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'sitemap.xml'));
});

// This handler will catch requests for pages like /products, /checkout, etc.
// It must be placed after the static middleware and any specific API routes.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '..', 'index.html'));
// });


// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
