// models/OrderModel.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Products in the order
  products: [
    {
      name: String,  // Product name
      price: Number,  // Price of the product
      quantity: { type: Number, required: true },  // Quantity ordered
    },
  ],

  // Shipping address
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    postalCode: String,
    phone: String,
  },

  // Total amount for the order
  totalAmount: {
    type: Number,
    required: true, // This field should be mandatory
  },

  // Order status (pending, paid, shipped, etc.)
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped', 'delivered', 'canceled'],  // Possible order statuses
    default: 'pending',
  },

  // Payment information
  paymentInfo: {
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],  // Added 'cash_on_delivery'
      required: true,  // Ensure payment method is provided
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],  // Payment status
      default: 'pending',
    },
    paymentDate: Date,  // Timestamp for payment completion
  },

  // Shipping information (tracking number, courier service, etc.)
  shippingInfo: {
    trackingNumber: String,
    courierService: String,
    shippedDate: Date,
    estimatedArrival: Date,
  },

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
