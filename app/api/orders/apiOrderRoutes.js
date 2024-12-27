const express = require('express');
const router = express.Router();
const apiOrderControllers = require('./apiOrderControllers');
router.get('/', apiOrderControllers.getAllOrderAPI);
router.post('/updateOrderStatus', apiOrderControllers.updateOrderStatus);

module.exports = router;
