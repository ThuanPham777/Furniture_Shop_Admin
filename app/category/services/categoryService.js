const Category = require('../model/categoryModel');
const Product = require('../../products/models/productModel');
exports.getAllCategoryNames = async () => {
  const categories = await Category.find({}, 'name').lean();
  return categories.map((category) => category.name);
};
exports.findAllCategoriesWithProducts = async (
  filters = {},
  page = 1,
  limit = 4
) => {
  const filterConditions = {};

  if (filters.search) {
    filterConditions.name = { $regex: filters.search, $options: 'i' };
  }

  const skip = (page - 1) * limit; // Tính số lượng bỏ qua
  const categories = await Category.find(filterConditions)
    .populate('listIdProduct') // Nếu bạn cần lấy thông tin sản phẩm liên kết
    .skip(skip)
    .limit(limit)
    .lean(); // Chuyển đổi thành object JS thuần

  // Tính tổng số danh mục để biết có bao nhiêu trang
  const totalCategories = await Category.countDocuments();

  return {
    categories,
    totalCategories,
    totalPages: Math.ceil(totalCategories / limit),
    currentPage: page,
  };
};

exports.addCategory = async (categoryName) => {
  const newCategory = new Category({
    name: categoryName,
  });
  await newCategory.save();
  return newCategory;
};

exports.editCategory = async (categoryId, categoryName) => {
  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { name: categoryName },
    { new: true }
  );
  if (!updatedCategory) {
    throw new Error('Category not found');
  }
  return updatedCategory;
};

exports.deleteCategory = async (categoryId) => {
  try {
    // Lấy thông tin category cần xóa
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    // Cập nhật các sản phẩm để category = null
    await Product.updateMany(
      { category: category.name }, // Tìm sản phẩm thuộc category
      { $unset: { category: '' } } // Xóa liên kết category
    );

    // Xóa category
    await Category.findByIdAndDelete(categoryId);

    console.log(
      `Category "${category.name}" and its association removed successfully.`
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

exports.categoryExists = async (categoryId) => {
  const category = await Category.findById(categoryId);
  return !!category;
};

exports.findCategoryById = async (categoryId) => {
  const category = await Category.findById(categoryId);
  return category;
};
