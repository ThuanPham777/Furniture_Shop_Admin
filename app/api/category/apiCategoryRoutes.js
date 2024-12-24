const express = require('express');

const router = express.Router();

const apiCategoryControllers = require('./apiCategoryControllers');

router.get('/', apiCategoryControllers.getCategories);

router.post('/add', apiCategoryControllers.addCategory);

router.put('/edit/:categoryId', apiCategoryControllers.editCategory);

router.delete('/delete/:categoryId', apiCategoryControllers.deleteCategory);

module.exports = router;
