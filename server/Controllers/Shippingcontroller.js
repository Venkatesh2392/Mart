// controllers/ShippingController.js
const ShippingAddress = require('../Models/ShippingModel');
const Order = require('../Models/OrdersModel');
const Cart = require('../Models/CartModels');

// Save the shipping address
const saveShippingAddress = async (req, res) => {
  const { name, address, city, postalCode, phone } = req.body;

  if (!name || !address || !city || !postalCode || !phone) {
    return res.status(400).json({ error: 'All fields are required for shipping' });
  }

  try {
    const shippingAddress = new ShippingAddress({
      name,
      address,
      city,
      postalCode,
      phone,
    });

    await shippingAddress.save();
    req.session.saveShippingAddress = shippingAddress;

    res.status(200).json({ message: 'Shipping address saved successfully' });
  } catch (error) {
    console.error('Error saving shipping address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Process the payment (currently, we simulate success for COD)
const processPayment = async (req, res) => {
  const { cardNumber, expiryDate, cvv, paymentMethod } = req.body;

  if (!paymentMethod) {
    return res.status(400).json({ error: 'Payment method is required' });
  }

  if (paymentMethod === 'cashOnDelivery') {
    return res.status(200).json({ message: 'Cash on Delivery selected. No payment processing needed.' });
  }

  if (!cardNumber || !expiryDate || !cvv) {
    return res.status(400).json({ error: 'Payment details are required for non-COD payment methods' });
  }

  const paymentSuccessful = true;  // Simulate successful payment for now

  if (paymentSuccessful) {
    res.status(200).json({ message: 'Payment successful' });
  } else {
    res.status(500).json({ error: 'Payment failed' });
  }
};

// Place the order
const placeOrder = async (req, res) => {
  const { paymentMethod } = req.body;

  try {
    const cart = await Cart.findOne();
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const shippingAddress = req.session.saveShippingAddress;
    if (!shippingAddress) {
      return res.status(400).json({ error: 'Shipping address is required' });
    }

    // Calculate total amount
    const totalAmount = cart.products.reduce((total, item) => total + (item.price * item.quantity), 0);

    // Create and save the order
    const order = new Order({
      products: cart.products,
      shippingAddress,
      totalAmount,
      paymentInfo: {
        paymentMethod,
        paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'completed',
        paymentDate: paymentMethod !== 'cash_on_delivery' ? new Date() : null, // Only set date if not COD
      },
    });

    await order.save();

    // Clear the cart after placing the order
    cart.products = [];
    await cart.save();

    res.status(200).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  saveShippingAddress,
  processPayment,
  placeOrder,
};
