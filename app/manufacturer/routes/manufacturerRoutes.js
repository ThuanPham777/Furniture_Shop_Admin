const express = require('express');

const router = express.Router();

const manufacturerController = require('../controllers/manufacturerControllers');

router.get('/', manufacturerController.renderManufacturerPage);

router.get('/add', manufacturerController.renderAddManufacturer);

router.get(
  '/edit/:manufacturerId',
  manufacturerController.renderAddManufacturer
);

module.exports = router;
