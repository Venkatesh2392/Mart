// routes/WishlistRoute.js
const express = require('express');
const WishlistController = require('../Controllers/Wishlistcontroller');
const router = express.Router();

router.get('/', WishlistController.getWishlist);
router.post('/add', WishlistController.addItem);
router.delete('/remove/:productId', WishlistController.removeItem);

module.exports = router;
