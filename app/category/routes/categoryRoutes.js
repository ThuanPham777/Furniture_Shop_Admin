const express = require('express');
const router = express.Router();

const categoryControllers = require('../controllers/categoryControllers');

router.get('/', categoryControllers.renderCategoryPage);

router.get('/add', categoryControllers.renderAddCategory);

router.get('/edit/:categoryId', categoryControllers.renderAddCategory);

module.exports = router;
