const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
} = require('../controllers/productController'); // Import controller

router.get('/', getAllProducts);

module.exports = router;
