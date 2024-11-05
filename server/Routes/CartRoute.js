// const express = require('express');
// const router = express.Router();
// const { addToCart, getCart, removeFromCart } = require('../Controllers/Cartcontroller');

// // Define the routes
// router.post('/add', addToCart);
// router.get('/items', getCart);
// router.post('/remove', removeFromCart);

// module.exports = router;
 

// routes cart
const express = require('express');
const router = express.Router();
const { addToCart, getCart, updateQuantity, deleteFromCart } = require('../Controllers/Cartcontroller');
 
router.post('/addtocart', addToCart);
router.get('/allcartitems', getCart);
router.post('/updatequantity', updateQuantity); // Make sure this route exists
router.delete('/remove/:productId', deleteFromCart); // Correctly define the delete route
 
module.exports = router;