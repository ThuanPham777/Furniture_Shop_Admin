const reportService = require('../services/reportServices');

exports.getRevenueReport = async (req, res) => {
  const { timeRange, startDate, endDate } = req.query;

  try {
    const reportData = await reportService.generateRevenueReport(
      timeRange,
      startDate,
      endDate
    );

    //console.log('reportData', reportData);
    res.status(200).json(reportData); // Trả về dữ liệu JSON đúng định dạng
  } catch (error) {
    console.error('Error generating revenue report:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getTopRevenueProducts = async (req, res) => {
  try {
    const { timeRange, startDate, endDate, limit } = req.query;

    const revenueReport = await reportService.fetchTopRevenueProducts(
      timeRange,
      startDate,
      endDate,
      limit
    );

    console.log('revenueReport: ' + JSON.stringify(revenueReport, null, 2));

    res.status(200).json(revenueReport);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
