const express = require('express');
const connectDB = require('./config/dataconection'); 
require('dotenv').config(); // Load environment variables
const indexRoutes = require('./route/index.route'); // Main API routes
const cors = require('cors'); // CORS middleware

// ✅ Add DynamoDB config
// const { dynamoDB, TABLE_NAME } = require('./config/dynamodb');

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON
app.use(cors()); // Enable Cross-Origin Resource Sharing

// ✅ Test DynamoDB connection (optional log)
// console.log('DynamoDB connected to table:', TABLE_NAME);

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api', indexRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
