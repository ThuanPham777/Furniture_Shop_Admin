const orderService = require('../../order/services/orderService');

exports.getAllOrderAPI = async (req, res) => {
  try {
    const filters = req.query;
    console.log('filter: ', filters);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    // Gọi trực tiếp service để lấy tất cả các đơn hàng
    const { orders, totalPages } = await orderService.getAllOrdersWithFilters(
      filters,
      page,
      limit
    );
    res.json({
      orders,
      totalPages,
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message || 'Something went wrong!');
  }
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Call the service to update the order status
    await orderService.updateOrderStatus(orderId, status);
    res.json({
      success: true,
      updatedStatus: status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message || 'Something went wrong!');
  }
};
