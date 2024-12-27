// services/orderService.js
const Order = require('../models/orderModel');
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

exports.getAllOrders = async (filters = {}, page, limit) => {
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

// Function to update the order status
exports.updateOrderStatus = async (orderId, status) => {
  if (!orderId || !status) {
    throw new Error('Order ID and status are required');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Order not found');
  }

  order.status = status;
  await order.save();
  return order;
};
