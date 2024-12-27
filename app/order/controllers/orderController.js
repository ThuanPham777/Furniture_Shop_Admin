// controllers/orderController.js
const orderService = require('../services/orderService');

exports.getAllOrders = async (req, res) => {
  try {
    const filters = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    // Gọi trực tiếp service để lấy tất cả các đơn hàng
    const { orders, totalPages } = await orderService.getAllOrdersWithFilters(
      filters,
      page,
      limit
    );
    // Render trang quản lý đơn hàng với dữ liệu đơn hàng
    res.render('order/order-list', {
      filters,
      orders,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.getOrderById(orderId);
    if (!order) {
      return res.status(404).send('Order not found');
    }

    // Render trang chi tiết đơn hàng với dữ liệu đơn hàng
    res.render('order/order-details', {
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong!');
  }
};
