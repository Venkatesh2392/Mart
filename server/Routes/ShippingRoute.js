// routes/ShippingRoute.js
const express = require('express');
const router = express.Router();
const { saveShippingAddress, processPayment, placeOrder } = require('../Controllers/Shippingcontroller');

// Save shipping address
router.post('/shipping', saveShippingAddress);

// Process payment (for non-COD payments)
router.post('/payment', processPayment);

// Place the order (with COD option)
router.post('/place-order', placeOrder);

module.exports = router;
