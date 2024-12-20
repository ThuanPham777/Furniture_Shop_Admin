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

exports.getAllOrders = async () => {
  try {
    const orders = await Order.find({})
      .populate('userId', 'firstName lastName email') // Chỉ lấy thông tin cần thiết từ User
      .populate('items.productId');
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
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
