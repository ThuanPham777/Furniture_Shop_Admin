const orderService = require('../../order/services/orderService');
const Order = require('../../order/models/orderModel');
// Helper function to get the week number of a date
const getWeekNumber = (date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const diff =
    date -
    startDate +
    (startDate.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.floor(diff / oneWeek) + 1;
};

exports.generateRevenueReport = async (timeRange, startDate, endDate) => {
  try {
    // Fetch all orders
    const orders = await orderService.getAllOrders();

    // Filter by date range
    let filteredOrders = [...orders];
    if (startDate && endDate) {
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return (
          orderDate >= new Date(startDate) && orderDate <= new Date(endDate)
        );
      });
    }

    // Aggregate data based on time range
    let aggregatedData;
    if (timeRange === 'day') {
      // Group by day
      aggregatedData = filteredOrders.map((order) => ({
        date: order.orderDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        totalOrders: 1,
        revenue: order.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      }));
    } else if (timeRange === 'week') {
      // Group by week
      const weekMap = {};
      filteredOrders.forEach((order) => {
        const weekNumber = `Week ${getWeekNumber(new Date(order.orderDate))}`;
        if (!weekMap[weekNumber]) {
          weekMap[weekNumber] = {
            date: weekNumber,
            totalOrders: 0,
            revenue: 0,
          };
        }
        weekMap[weekNumber].totalOrders += 1;
        weekMap[weekNumber].revenue += order.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      });
      aggregatedData = Object.values(weekMap);
    } else if (timeRange === 'month') {
      // Group by month
      const monthMap = {};
      filteredOrders.forEach((order) => {
        const month = new Date(order.orderDate).toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
        });
        if (!monthMap[month]) {
          monthMap[month] = {
            date: month,
            totalOrders: 0,
            revenue: 0,
          };
        }
        monthMap[month].totalOrders += 1;
        monthMap[month].revenue += order.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      });
      aggregatedData = Object.values(monthMap);
    } else {
      // Default: Group by day
      aggregatedData = filteredOrders.map((order) => ({
        date: order.orderDate.toISOString().split('T')[0],
        totalOrders: 1,
        revenue: order.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
      }));
    }

    return aggregatedData;
  } catch (error) {
    console.error('Error generating revenue report:', error);
    throw new Error('Could not generate revenue report');
  }
};

exports.fetchTopRevenueProducts = async (
  timeRange,
  startDate,
  endDate,
  limit = 10
) => {
  try {
    const matchStage = {};

    // Process timeRange
    if (timeRange) {
      const now = new Date();
      if (timeRange === 'day') {
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0); // Start of day
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999); // End of day
      } else if (timeRange === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
        startDate = new Date(startOfWeek);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
      } else if (timeRange === 'month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of month
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // End of month
        endDate.setHours(23, 59, 59, 999);
      }
    }

    // Add date range to match stage
    if (startDate && endDate) {
      matchStage.orderDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    console.log('matchStage:', matchStage);

    // Perform aggregation
    const results = await Order.aggregate([
      { $match: matchStage },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: false },
      },
      {
        $group: {
          _id: '$items.productId',
          image: {
            $first: {
              $ifNull: [
                { $arrayElemAt: ['$productDetails.images', 0] },
                'default_image.jpg',
              ],
            },
          },
          name: { $first: '$productDetails.name' },
          price: { $first: '$productDetails.price' },
          category: { $first: '$productDetails.category' },
          manufacturer: { $first: '$productDetails.manufacturer' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: {
            $sum: { $multiply: ['$items.quantity', '$items.price'] },
          },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: parseInt(limit, 10) },
    ]);

    console.log('Results:', results);
    return results;
  } catch (error) {
    console.error('Error in fetchTopRevenueProducts:', error);
    throw new Error('Failed to fetch top revenue products');
  }
};
