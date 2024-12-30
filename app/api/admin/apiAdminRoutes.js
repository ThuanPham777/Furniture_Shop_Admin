const express = require('express');

const router = express.Router();

const apiAdminController = require('./apiAdminControllers');

router.get('/', apiAdminController.getAllAdmins);
module.exports = router;
