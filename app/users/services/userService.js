const User = require('../models/userModel');

exports.getAllUsers = async (page, limit, filters = {}) => {
  const filterConditions = {};
  if (filters.search) {
    filterConditions.$or = [
      { username: { $regex: filters.search, $options: 'i' } },
      { email: { $regex: filters.search, $options: 'i' } },
    ];
  }

  // Sorting (tùy theo filter)
  let sortQuery = {};
  if (filters.sort === 'username-asc') {
    sortQuery = { username: 1 };
  } else if (filters.sort === 'username-desc') {
    sortQuery = { username: -1 };
  } else if (filters.sort === 'email-asc') {
    sortQuery = { email: 1 };
  } else if (filters.sort === 'email-desc') {
    sortQuery = { email: -1 };
  } else if (filters.sort === 'createdAt-asc') {
    sortQuery = { createdAt: 1 }; // Old to new
  } else if (filters.sort === 'createdAt-desc') {
    sortQuery = { createdAt: -1 }; // New to old
  }

  // Pagination
  const skip = (page - 1) * limit;
  const users = await User.find(filterConditions)
    .skip(skip)
    .limit(limit)
    .sort(sortQuery);

  const totalUsers = await User.countDocuments(filterConditions);
  const totalPages = Math.ceil(totalUsers / limit);

  return { users, totalPages };
};

exports.getUserById = async (userId) => {
  return await User.findById(userId);
};

exports.countUsers = async (filter = {}) => {
  return await User.countDocuments(filter);
};
