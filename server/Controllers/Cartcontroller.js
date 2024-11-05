// const Cart = require('../Models/CartModels');

// const addToCart = async (req, res) => {
//   const products = req.body;

//   // Validate input
//   if (!Array.isArray(products) || products.length === 0) {
//     return res.status(400).json({ error: 'Product array is required' });
//   }

//   try {
//     let cart = await Cart.findOne() || new Cart({ products: [] });

//     for (const { productId, quantity, name, price, image } of products) {
//       if (!productId || !name || !price || !image) {
//         return res.status(400).json({ error: 'All product fields are required' });
//       }

//       const qty = parseInt(quantity, 10) || 1;

//       const existingProduct = cart.products.find(item => item.productId === productId);
//       if (existingProduct) {
//         existingProduct.quantity += qty;
//       } else {
//         cart.products.push({ productId, quantity: qty, name, price, image });
//       }
//     }

//     const updatedCart = await cart.save();
//     return res.status(200).json(updatedCart);
//   } catch (error) {
//     console.error('Error adding to cart:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne();
//     if (!cart || cart.products.length === 0) {
//       return res.status(404).json({ message: 'Cart is empty' });
//     }
//     return res.status(200).json(cart);
//   } catch (error) {
//     console.error('Error fetching cart:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const removeFromCart = async (req, res) => {
//   const { productId } = req.body;

//   if (!productId) {
//     return res.status(400).json({ error: 'Product ID is required' });
//   }

//   try {
//     const cart = await Cart.findOne();
//     if (!cart) {
//       return res.status(404).json({ error: 'Cart is empty' });
//     }

//     cart.products = cart.products.filter(item => item.productId !== productId);
//     const updatedCart = await cart.save();

//     return res.status(200).json(updatedCart);
//   } catch (error) {
//     console.error('Error removing from cart:', error);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// };

// module.exports = {
//   addToCart,
//   getCart,
//   removeFromCart,
// };
 

// controllers cart.js                          
const Cart = require('../Models/CartModels');
const addToCart = async (req, res) => {
  const products = req.body.products;

  if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ error: 'Product array is required' });
  }

  try {
      let cart = await Cart.findOne();
      if (!cart) {
          cart = new Cart({ products: [] });
      }

      for (const { productId, quantity } of products) {
          if (!productId) {
              return res.status(400).json({ error: 'Product ID is required' });
          }
          const existingProduct = cart.products.find(item => item.productId === productId);
          if (existingProduct) {
              existingProduct.quantity += (quantity || 1);
          } else {
              cart.products.push({ productId, quantity: quantity || 1 });
          }
      }

      await cart.save();
      res.status(200).json(cart);
  } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

const getCart = async (req, res) => {
  try {
      const cart = await Cart.findOne();
      if (!cart) {
          return res.status(404).json({ message: 'Cart is empty' });
      }
      res.status(200).json(cart);
  } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

const updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
      const cart = await Cart.findOne();
      if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
      }

      const existingProduct = cart.products.find(item => item.productId === productId);
      if (existingProduct) {
          existingProduct.quantity = quantity;
          await cart.save();
          return res.status(200).json(cart);
      } else {
          return res.status(404).json({ message: 'Product not found in cart' });
      }
  } catch (error) {
      console.error('Error updating quantity:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteFromCart = async (req, res) => {
  const { productId } = req.params;

  try {
      let cart = await Cart.findOne();
      if (!cart) {
          return res.status(404).json({ message: 'Cart is empty' });
      }

      cart.products = cart.products.filter(item => item.productId !== productId);
      await cart.save();
      res.status(200).json(cart);
  } catch (error) {
      console.error('Error deleting from cart:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateQuantity,
  deleteFromCart
};