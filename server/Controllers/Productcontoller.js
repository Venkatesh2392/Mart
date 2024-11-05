const Product = require('../Models/ProductModel');

const addProduct = (req, res) => {
  const { name, description, image, price } = req.body;

  if (!name || !description) {
    return res.json({ message: "Name and description are required." });
  }

  const product = new Product({
    name,
    description,
    image: image || null,
    price: price || 0
  });

  product.save()
    .then(createdProduct => {
      return res.json({
        message: "Product added successfully",
        product: createdProduct,
      });
    })
    .catch(err => {
      console.error(err);
      return res.json({ message: "Server error" });
    });
};

const getAllProducts = (req, res) => {
  Product.find()
    .then(products => {
      const length = products.length;
      return res.json({
        totalProducts: length,
        products
      });
    })
    .catch(err => {
      console.error(err);
      return res.json({ message: "Server error" });
    });
};

module.exports = {
  addProduct,
  getAllProducts
};
