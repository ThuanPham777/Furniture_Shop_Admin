const Product = require('../models/productModel');
const cloudinary = require('../../../config/cloudinary');

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
    if (!files || files.length === 0) {
      throw new Error('No files uploaded');
    }

    const uploadedImages = [];
    const folderName = `products/${productData.name}`;

    // Use Promise.all to wait for all uploads to complete
    const uploadPromises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const fileBuffer = file.buffer;

        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'auto', // Auto detect file type
              folder: folderName, // Upload to a specific folder in Cloudinary
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error); // Reject the promise if there's an error
              } else {
                uploadedImages.push(result.url); // Add image URL to array
                resolve(); // Resolve the promise after upload completes
              }
            }
          )
          .end(fileBuffer); // End the upload stream
      });
    });

    // Wait for all image uploads to finish
    await Promise.all(uploadPromises);
    console.log(uploadedImages);

    // After all uploads are complete, assign the uploaded images to product data
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

exports.updateProduct = async (productId, updateData, files) => {
  try {
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    const uploadedImages = [];
    const folderName = `products/${updateData.name}`;

    if (files && files.length > 0) {
      // Use Promise.all to handle asynchronous uploads
      const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
          const fileBuffer = file.buffer;

          cloudinary.uploader
            .upload_stream(
              {
                resource_type: 'auto', // Auto detect file type
                folder: folderName, // Upload to a specific folder in Cloudinary
              },
              (error, result) => {
                if (error) {
                  console.error('Cloudinary upload error:', error);
                  reject(error); // Reject the promise if there's an error
                } else {
                  uploadedImages.push(result.url); // Add image URL to array
                  resolve(); // Resolve the promise after upload completes
                }
              }
            )
            .end(fileBuffer); // End the upload stream
        });
      });

      // Wait for all image uploads to finish
      await Promise.all(uploadPromises);

      // Update image URLs depending on whether you want to replace or append
      if (updateData.replaceImages) {
        updateData.images = uploadedImages; // Replace existing images
      } else {
        updateData.images = [...existingProduct.images, ...uploadedImages]; // Append new images
      }
    }

    // Update the product with the new data
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true }
    );

    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Error updating product');
  }
};
