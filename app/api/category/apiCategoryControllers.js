const categoryService = require('../../category/services/categoryService');
exports.getCategories = async (req, res) => {
  try {
    const filter = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    // Gọi service để lấy danh mục phân trang
    const { categories, totalPages, currentPage } =
      await categoryService.findAllCategoriesWithProducts(filter, page, limit);

    res.json({
      categories,
      totalPages,
      currentPage,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = await categoryService.addCategory(name);
    res.json({
      success: true,
      message: 'Category added successfully!',
      newCategory,
    });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Error adding category' });
  }
};

exports.editCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const { name } = req.body;
    const categoryExists = await categoryService.categoryExists(categoryId);
    if (!categoryExists) {
      return res.status(404).send('Category not found');
    }
    const updatedCategory = await categoryService.editCategory(
      categoryId,
      name
    );

    res.json({
      success: true,
      message: 'Category updated successfully!',
      updatedCategory,
    });
  } catch (error) {
    console.error('Error editing category:', error);
    res.status(500).json({ message: 'Error editing category' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const categoryExists = await categoryService.categoryExists(categoryId);
    if (!categoryExists) {
      return res.status(404).send('Category not found');
    }
    await categoryService.deleteCategory(categoryId);
    res.json({ success: true, message: 'Category deleted successfully!' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
};
