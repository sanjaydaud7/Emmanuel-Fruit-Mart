// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require("cors");
const bodyParser = require('body-parser');


dotenv.config();

const app = express(); // Initialize app here

// Middlewares
app.use(cors({ origin: "*" })); // Move this line after app initialization
app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products'); // Add product routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // Add product API endpoint


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));