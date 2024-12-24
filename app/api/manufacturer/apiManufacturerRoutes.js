const express = require('express');

const router = express.Router();

const apiManufacturerControllers = require('./apiManufacturerControllers');

router.get('/', apiManufacturerControllers.getManufacturers);

router.post('/add', apiManufacturerControllers.addManufacturer);

router.put(
  '/edit/:manufacturerId',
  apiManufacturerControllers.editManufacturer
);

router.delete(
  '/delete/:manufacturerId',
  apiManufacturerControllers.deleteManufacturer
);

module.exports = router;
