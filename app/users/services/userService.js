const User = require('../models/userModel');

exports.getAllUsers = async (page, limit, filter = {}, sortOptions = {}) => {
  const skip = (page - 1) * limit;
  return User.find(filter).sort(sortOptions).skip(skip).limit(limit).lean(); // Dùng lean() để giảm overhead khi trả dữ liệu
};

exports.getUserById = async (userId) => {
  return await User.findById(userId);
};

exports.countUsers = async (filter = {}) => {
  return await User.countDocuments(filter);
};
