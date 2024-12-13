const express = require('express');
const router = express.Router();

const apiProductControllers = require('./apiProductControllers');

const upload = require('../../../config/upload');

router.get('/', apiProductControllers.getProductsAPI);

router.post(
  '/add',
  upload.array('images', 10),
  apiProductControllers.addProduct
);

router.put('/update/:productId', apiProductControllers.editProduct);

module.exports = router;
