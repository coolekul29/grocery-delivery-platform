const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

// Load environment variables
dotenv.config();

const app = express();

/* Middleware */
app.use(cors());

// Read JSON data
app.use(express.json());

// Access uploaded images
app.use("/uploads", express.static("uploads"));

/* Routes */
app.use('/api/auth', require('./routes/authRoutes'));
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

/* Start server */
if (require.main === module) {

    // Connect to MongoDB
    connectDB();

    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
}

module.exports = app;