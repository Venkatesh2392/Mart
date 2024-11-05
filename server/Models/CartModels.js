// models cart                                                                                                            const mongoose = require('mongoose');
const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
  products: [{
      productId: {
           type: String,
            required: true
           },
      quantity: {
          type: Number,
          required: true,
       }
  }]
});

module.exports = mongoose.model('Cart', cartSchema);