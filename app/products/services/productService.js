const Product = require('../models/productModel');
const cloudinary = require('../../../config/cloudinary');
const fs = require('fs');

//--------
exports.getProducts = async (filters = {}, page = 1, limit = 6) => {
  try {
    const filterConditions = {};

    // Kiểm tra giá trị filters và áp dụng điều kiện filter cho các trường hợp khác nhau

    // Price Filter (minPrice và maxPrice)
    if (filters.minPrice || filters.maxPrice) {
      const priceConditions = {};
      if (filters.minPrice) {
        priceConditions.$gte = Number(filters.minPrice);
      }
      if (filters.maxPrice) {
        priceConditions.$lte = Number(filters.maxPrice);
      }
      if (Object.keys(priceConditions).length > 0) {
        filterConditions.price = priceConditions;
      }
    }

    // Category Filter
    if (filters.category) {
      filterConditions.category = {
        $in: Array.isArray(filters.category)
          ? filters.category
          : [filters.category], // Chắc chắn rằng category là một mảng
      };
    }

    // Manufacturer Filter
    if (filters.manufacturer) {
      filterConditions.manufacturer = {
        $in: Array.isArray(filters.manufacturer)
          ? filters.manufacturer
          : [filters.manufacturer],
      };
    }

    // Material Filter
    if (filters.material) {
      filterConditions.material = {
        $in: Array.isArray(filters.material)
          ? filters.material
          : [filters.material],
      };
    }

    // Search Keyword (nếu có)
    if (filters.search) {
      filterConditions.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    // Sorting (tùy theo filter)
    let sortQuery = {};
    if (filters.sort === 'price-asc') {
      sortQuery = { price: 1 };
    } else if (filters.sort === 'price-desc') {
      sortQuery = { price: -1 };
    } else if (filters.sort === 'name-asc') {
      sortQuery = { name: 1 };
    } else if (filters.sort === 'name-desc') {
      sortQuery = { name: -1 };
    } else if (filters.sort === 'createdAt-asc') {
      sortQuery = { createdAt: 1 }; // Old to new
    } else if (filters.sort === 'createdAt-desc') {
      sortQuery = { createdAt: -1 }; // New to old
    }

    // Pagination
    const skip = (page - 1) * limit;
    const products = await Product.find(filterConditions)
      .skip(skip)
      .limit(limit)
      .sort(sortQuery);

    const totalProducts = await Product.countDocuments(filterConditions);
    const totalPages = Math.ceil(totalProducts / limit);

    return { products, totalPages };
  } catch (error) {
    console.error(error);
    throw new Error('Error retrieving products');
  }
};

exports.getProductById = async (id) => {
  return await Product.findById(id);
};

// Function to handle product creation and image upload
exports.createProduct = async (productData, files) => {
  try {
    const uploadedImages = [];

    // Upload each file to Cloudinary
    for (let i = 0; i < files.length; i++) {
      const filePath = files[i].path;

      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: 'auto', // Auto detect file type
      });

      // Add the image URL to the uploadedImages array
      uploadedImages.push(result.url);

      // Remove the file after upload
      fs.unlinkSync(filePath);
    }

    // Add the uploaded images to product data
    productData.images = uploadedImages;

    // Create a new product and save to the database
    const newProduct = new Product(productData);
    await newProduct.save();

    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Error creating product');
  }
};

exports.updateProduct = async (productId, updateData) => {
  return Product.findByIdAndUpdate(productId, updateData, { new: true });
};
