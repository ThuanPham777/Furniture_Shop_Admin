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

const getQuarter = (month) => {
  if (month >= 0 && month <= 2) return 'Q1';
  if (month >= 3 && month <= 5) return 'Q2';
  if (month >= 6 && month <= 8) return 'Q3';
  if (month >= 9 && month <= 11) return 'Q4';
};

exports.generateRevenueReport = async (timeRange) => {
  try {
    const orders = await orderService.getAllOrders();

    let filteredOrders = orders.filter((order) => order.status === 'Delivered');

    let aggregatedData = [];
    if (timeRange === 'day') {
      const dayMap = {};
      filteredOrders.forEach((order) => {
        const date = order.orderDate.toISOString().split('T')[0];
        if (!dayMap[date]) {
          dayMap[date] = { date, totalOrders: 0, revenue: 0 };
        }
        dayMap[date].totalOrders += 1;
        dayMap[date].revenue += order.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      });
      aggregatedData = Object.values(dayMap);
    } else if (timeRange === 'week') {
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
      const monthMap = {};
      filteredOrders.forEach((order) => {
        const month = new Date(order.orderDate).toLocaleString('en-US', {
          month: 'long',
          year: 'numeric',
        });
        if (!monthMap[month]) {
          monthMap[month] = { date: month, totalOrders: 0, revenue: 0 };
        }
        monthMap[month].totalOrders += 1;
        monthMap[month].revenue += order.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      });
      aggregatedData = Object.values(monthMap);
    } else if (timeRange === 'year') {
      const yearMap = {};
      filteredOrders.forEach((order) => {
        const year = new Date(order.orderDate).getFullYear();
        if (!yearMap[year]) {
          yearMap[year] = { date: year, totalOrders: 0, revenue: 0 };
        }
        yearMap[year].totalOrders += 1;
        yearMap[year].revenue += order.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      });
      aggregatedData = Object.values(yearMap);
    } else if (timeRange === 'quarter') {
      const quarterMap = {};
      filteredOrders.forEach((order) => {
        const month = new Date(order.orderDate).getMonth();
        const year = new Date(order.orderDate).getFullYear();
        const quarter = getQuarter(month);
        const quarterLabel = `${quarter} ${year}`;
        if (!quarterMap[quarterLabel]) {
          quarterMap[quarterLabel] = {
            date: quarterLabel,
            totalOrders: 0,
            revenue: 0,
          };
        }
        quarterMap[quarterLabel].totalOrders += 1;
        quarterMap[quarterLabel].revenue += order.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      });
      aggregatedData = Object.values(quarterMap);
    }

    return aggregatedData;
  } catch (error) {
    console.error('Error generating revenue report:', error);
    throw new Error('Could not generate revenue report');
  }
};

exports.fetchTopRevenueProducts = async (timeRange, limit = 10) => {
  try {
    const matchStage = { status: 'Delivered' };
    let startDate, endDate;

    // Xử lý timeRange
    if (timeRange) {
      const now = new Date();
      if (timeRange === 'day') {
        // Xử lý ngày hiện tại
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0); // Bắt đầu ngày
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999); // Kết thúc ngày
      } else if (timeRange === 'week') {
        // Xử lý tuần hiện tại
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Bắt đầu tuần (Chủ nhật)
        startDate = new Date(startOfWeek);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999);
      } else if (timeRange === 'month') {
        // Xử lý tháng hiện tại
        startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Bắt đầu tháng
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Kết thúc tháng
        endDate.setHours(23, 59, 59, 999);
      }
    }

    // Thêm phạm vi thời gian vào match stage
    if (startDate && endDate) {
      matchStage.orderDate = {
        $gte: new Date(startDate), // Lọc từ startDate
        $lte: new Date(endDate), // Lọc đến endDate
      };
    }

    // Thực hiện phép tổng hợp (aggregation)
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
