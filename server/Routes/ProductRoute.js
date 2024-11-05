const express = require('express');
const router = express.Router();
const { addProduct, getAllProducts} = require('../Controllers/Productcontoller');

router.post("/addproducts", addProduct)
router.get("/all",  getAllProducts)


module.exports = router;