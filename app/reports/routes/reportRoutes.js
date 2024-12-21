const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportControllers');

router.get('/getRevenueReport', reportController.getRevenueReport);

router.get('/getTopRevenueProducts', reportController.getTopRevenueProducts);

module.exports = router;
