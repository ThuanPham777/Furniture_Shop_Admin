const productService = require('../services/productService'); // Service xử lý logic về sản phẩm
const categoryService = require('../../category/services/categoryService');
const manufacturerService = require('../../manufacturer/services/manufacturerService');
exports.getAllProducts = async (req, res, next) => {
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

    // Lấy danh sách categories và manufacturers
    const categories = await categoryService.getAllCategoryNames();
    const manufacturers = await manufacturerService.getAllManufacturerNames();

    // Render lại view với dữ liệu sản phẩm và filter
    res.render('product/product', {
      products,
      filters, // Truyền filters vào để render lại trạng thái filter
      totalPages,
      currentPage: page,
      categories, // danh sách categories
      manufacturers, // danh sách manufacturers
    });
  } catch (error) {
    console.error('Error retrieving products:', error);
    next(error);
  }
};

exports.renderAddProductPage = async (req, res) => {
  const { productId } = req.params;
  const existingProduct = await productService.getProductById(productId);
  const categories = await categoryService.getAllCategoryNames();
  const manufacturers = await manufacturerService.getAllManufacturerNames();

  res.render('product/add-product', {
    product: existingProduct || null, // null nếu thêm mới
    categories, // danh sách categories
    manufacturers, // danh sách manufacturers
  });
};
