const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  renderAddProductPage,
} = require('../controllers/productController'); // Import controller

router.get('/', getAllProducts);
router.get('/add', renderAddProductPage);
router.get('/edit/:productId', renderAddProductPage);
module.exports = router;
