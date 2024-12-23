const express = require('express');

const router = express.Router();

const manufacturerController = require('../controllers/manufacturerControllers');

router.get('/', manufacturerController.renderManufacturerPage);

module.exports = router;
