const express = require('express');
const router = express.Router();

const orderController = require('../controllers/orderController');

// const {
//   ensureAuthenticated,
// } = require('../../../middleware/auth/ensureAuthenticated');

router.get('/', orderController.getAllOrders);

router.get('/:orderId', orderController.getOrderDetails);
module.exports = router;
