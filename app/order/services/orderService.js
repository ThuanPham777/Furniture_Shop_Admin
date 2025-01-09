// services/orderService.js
const Order = require('../models/orderModel');
const productService = require('../../products/services/productService');
const User = require('../../users/models/userModel');

exports.getOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId)
      .populate('userId')
      .populate('items.productId');
    if (!order) {
      throw new Error('Order not found'); // Ném lỗi nếu không tìm thấy
    }
    return order; // Trả về đơn hàng nếu tìm thấy
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error; // Ném lỗi ra ngoài để controller hoặc handler xử lý
  }
};

exports.getAllOrdersWithFilters = async (
  filters = {},
  page = 1,
  limit = 10
) => {
  try {
    const filterConditions = {};

    if (filters.status) {
      filterConditions.status = filters.status;
    }

    let sortQuery = {};

    if (filters.timeOrder === 'asc') {
      sortQuery = { orderDate: 1 };
    }
    if (filters.timeOrder === 'desc') {
      sortQuery = { orderDate: -1 };
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(filterConditions)
      .populate('userId', 'firstName lastName email')
      .populate('items.productId')
      .skip(skip)
      .limit(limit)
      .sort(sortQuery)
      .lean();

    const totalOrders = await Order.countDocuments(filterConditions);
    const totalPages = Math.ceil(totalOrders / limit);

    return { orders, totalPages };
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    throw new Error('Could not fetch orders');
  }
};

exports.getAllOrders = async () => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'firstName lastName email')
      .populate('items.productId')
      .lean();
    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error.message);
    throw new Error('Could not fetch all orders');
  }
};

// Function to update the order status
exports.updateOrderStatus = async (orderId, status) => {
  if (!orderId || !status) {
    throw new Error('Order ID and status are required');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  // Cập nhật trạng thái đơn hàng
  order.status = status;

  if (status === 'Delivered') {
    for (const item of order.items) {
      const product = await productService.getProductById(item.productId);

      if (!product) {
        console.warn(`Product with ID ${item.productId} not found`);
        continue;
      }

      // Kiểm tra số lượng tồn kho
      if (product.totalStock < item.quantity) {
        throw new Error(`Not enough stock for product ${product.name}`);
      }

      // Trừ số lượng tồn kho
      product.totalStock -= item.quantity;

      await product.save();
    }
  }

  // Lưu cập nhật trạng thái
  await order.save();
  return order;
};
