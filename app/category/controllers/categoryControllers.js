const categoryService = require('../services/categoryService');
exports.renderCategoryPage = async (req, res) => {
  try {
    // Lấy thông tin trang và giới hạn từ query params, mặc định là trang 1, mỗi trang 4 mục
    const filters = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;

    // Gọi service để lấy danh mục phân trang
    const { categories, totalPages, currentPage } =
      await categoryService.findAllCategoriesWithProducts(filters, page, limit);

    // Render trang quản lý danh mục với dữ liệu danh mục
    res.render('category/category', {
      categories,
      totalPages,
      currentPage,
      filters,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
};
