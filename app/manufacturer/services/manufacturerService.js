const Manufacturer = require('../model/manufacturerModel');
const Product = require('../../products/models/productModel');

exports.getAllManufacturerNames = async () => {
  const manufacturers = await Manufacturer.find({}, 'name').lean();
  return manufacturers.map((manufacturer) => manufacturer.name);
};
exports.findAllManufacturersWithProducts = async (
  filters = {},
  page = 1,
  limit = 4
) => {
  const filterConditions = {};

  if (filters.search) {
    filterConditions.name = { $regex: filters.search, $options: 'i' };
  }

  const skip = (page - 1) * limit; // Tính số lượng bỏ qua
  const manufacturers = await Manufacturer.find(filterConditions)
    .populate('listIdProduct') // Nếu bạn cần lấy thông tin sản phẩm liên kết
    .skip(skip)
    .limit(limit)
    .lean(); // Chuyển đổi thành object JS thuần

  // Tính tổng số danh mục để biết có bao nhiêu trang
  const totalManufacturers = await Manufacturer.countDocuments();

  return {
    manufacturers,
    totalManufacturers,
    totalPages: Math.ceil(totalManufacturers / limit),
    currentPage: page,
  };
};

exports.addManufacturer = async (manufacturerName) => {
  const newManufacturer = new Manufacturer({
    name: manufacturerName,
  });
  await newManufacturer.save();
  return newManufacturer;
};

exports.editManufacturer = async (manufacturerId, manufacturerName) => {
  const updatedManufacturer = await Manufacturer.findByIdAndUpdate(
    manufacturerId,
    { name: manufacturerName },
    { new: true }
  );
  if (!updatedManufacturer) {
    throw new Error('manufacturer not found');
  }
  return updatedManufacturer;
};

exports.deleteManufacturer = async (manufacturerId) => {
  try {
    // Lấy thông tin manufacturer cần xóa
    const manufacturer = await Manufacturer.findById(manufacturerId);
    if (!manufacturer) {
      throw new Error('manufacturer not found');
    }

    // Cập nhật các sản phẩm để manufacturer = null
    await Product.updateMany(
      { manufacturer: manufacturer.name }, // Tìm sản phẩm thuộc manufacturer
      { $unset: { manufacturer: '' } } // Xóa liên kết manufacturer
    );

    // Xóa manufacturer
    await Manufacturer.findByIdAndDelete(manufacturerId);

    console.log(
      `manufacturer "${manufacturer.name}" and its association removed successfully.`
    );
  } catch (error) {
    console.error('Error deleting manufacturer:', error);
    throw error;
  }
};

exports.manufacturerExists = async (manufacturerId) => {
  const manufacturer = await Manufacturer.findById(manufacturerId);
  return !!manufacturer;
};

exports.findManufacturerById = async (manufacturerId) => {
  const manufacturer = await Manufacturer.findById(manufacturerId);
  return manufacturer;
};
