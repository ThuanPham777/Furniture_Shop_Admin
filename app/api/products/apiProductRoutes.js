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

router.put(
  '/edit/:productId',
  upload.array('images', 10),
  apiProductControllers.editProduct
);

router.delete('/delete/:productId', apiProductControllers.deleteProduct);

router.delete(
  '/remove-image/:productId',
  apiProductControllers.removeImageProduct
);

module.exports = router;
