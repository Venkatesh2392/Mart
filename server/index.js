const express = require('express');
const cors = require('cors');
const connectDB = require('./database/userdb'); // MongoDB connection setup
const session = require('express-session');  // Ensure session middleware is used
const userRoutes = require('./Routes/UserRoute');
const cartRoutes = require('./Routes/CartRoute');
const productRoutes = require('./Routes/ProductRoute');
const wishlistRoutes = require('./Routes/WishlistRoute');
const shippingRoutes = require('./Routes/ShippingRoute');  // Corrected import

require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Connect to the database
connectDB();

// Register routes
app.use('/api/user', userRoutes); 
app.use('/api/cart', cartRoutes);
app.use('/api/product', productRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/shipping', shippingRoutes);  // Correct path to the routes

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
