const Category = require('../model/categoryModel');

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
  const deletedCategory = await Category.findByIdAndDelete(categoryId);
  if (!deletedCategory) {
    throw new Error('Category not found');
  }
  return deletedCategory;
};

exports.categoryExists = async (categoryId) => {
  const category = await Category.findById(categoryId);
  return !!category;
};
