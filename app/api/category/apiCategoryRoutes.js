const express = require('express');

const router = express.Router();

const apiCategoryControllers = require('./apiCategoryControllers');

router.get('/', apiCategoryControllers.getCategories);

router.post('/add', apiCategoryControllers.addCategory);

router.put('/:categoryId/edit', apiCategoryControllers.editCategory);

router.delete('/:categoryId/delete', apiCategoryControllers.deleteCategory);

module.exports = router;
