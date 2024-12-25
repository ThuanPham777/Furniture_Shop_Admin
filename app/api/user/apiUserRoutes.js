const express = require('express');

const router = express.Router();

const apiUserController = require('./apiUserControllers');

router.get('/', apiUserController.getAllUsers);
router.post('/:userId/ban', apiUserController.banUser);
module.exports = router;
