const express = require('express');
const cors = require('cors');
const connectDB = require('./database/userdb'); // Ensure this connects to your MongoDB
const userRoutes = require('./routes/userRoute');
const cartRoutes = require('./routes/CartRoute');
const productRoutes = require('./routes/ProductRoute');
const wishlistRoutes = require('./Routes/WishlistRoute');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/user', userRoutes); 
app.use('/api/cart', cartRoutes);
app.use('/api/product', productRoutes);
app.use('/api/wishlist', wishlistRoutes);

const PORT = process.env.PORT || 8000; 
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
