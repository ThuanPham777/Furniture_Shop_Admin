const Admin = require('../models/adminModel');
require('dotenv').config();
const cloudinary = require('../../../config/cloudinary');
exports.findUserByEmail = async (email) => {
  return await Admin.findOne({ email });
};

// Tìm người dùng theo ID
exports.findUserById = async (userId) => {
  return Admin.findById(userId);
};

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
  const admins = await Admin.find(filterConditions)
    .skip(skip)
    .limit(limit)
    .sort(sortQuery);

  const totalUsers = await Admin.countDocuments(filterConditions);
  const totalPages = Math.ceil(totalUsers / limit);

  return { admins, totalPages };
};

// Cập nhật thông tin người dùng
exports.updateUser = async (userId, updateData) => {
  return Admin.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });
};

exports.createUser = async (userData) => {
  const user = new Admin(userData);
  return await user.save();
};

exports.uploadAvatar = async (userId, file) => {
  const folderName = 'admins'; // Upload to a specific folder in Cloudinary

  try {
    const user = await Admin.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // If the user has an existing avatar, delete it from Cloudinary
    if (user.avatarUrl) {
      // Extract public ID from the avatar URL using regex
      const publicIdMatch = user.avatarUrl.match(/\/([^/]+)\.[a-z]{3,4}$/);
      if (publicIdMatch && publicIdMatch[1]) {
        const publicId = publicIdMatch[1]; // The public ID is before the file extension

        // Delete the old avatar from Cloudinary
        await cloudinary.uploader.destroy(`admins/${publicId}`);
      }
    }

    // Upload the new avatar to Cloudinary
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: folderName,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve(result.secure_url); // Return the URL of the uploaded image
        }
      );
      stream.end(file.buffer); // Pass the file buffer for upload
    });
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
};
