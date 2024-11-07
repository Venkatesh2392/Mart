// models/ShippingAddress.js
const mongoose = require('mongoose');

const shippingAddressSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  phone: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('ShippingAddress', shippingAddressSchema);
