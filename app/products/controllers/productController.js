const productService = require('../services/productService'); // Service xử lý logic về sản phẩm
const getAllProducts = async (req, res, next) => {
  try {
    // Lấy các filter và phân trang từ query
    const filters = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    // Gọi productService để lấy dữ liệu sản phẩm
    const { products, totalPages } = await productService.getProducts(
      filters,
      page,
      limit
    );

    // Render lại view với dữ liệu sản phẩm và filter
    res.render('product/product', {
      products,
      filters, // Truyền filters vào để render lại trạng thái filter
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error('Error retrieving products:', error);
    next(error);
  }
};

module.exports = {
  getAllProducts,
};
