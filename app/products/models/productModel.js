const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    price: Number,
    salePrice: Number,
    totalStock: Number,
    status: {
      type: String,
      enum: ['On stock', 'Out of stock', 'suspend'],
      default: 'On stock',
    },
    category: String,
    manufacturer: String,
    material: String,
    images: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
