const orderService = require('../../order/services/orderService');
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
