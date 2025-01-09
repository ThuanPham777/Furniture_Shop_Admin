const reportService = require('../services/reportServices');

exports.getRevenueReport = async (req, res) => {
  const { timeRange } = req.query;

  try {
    const reportData = await reportService.generateRevenueReport(timeRange);

    //console.log('reportData', JSON.stringify(reportData, null, 2));

    res.status(200).json(reportData);
  } catch (error) {
    console.error('Error generating revenue report:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getTopRevenueProducts = async (req, res) => {
  try {
    const { timeRange, year } = req.query;

    const revenueReport = await reportService.fetchTopRevenueProducts(
      timeRange,
      year
    );

    //console.log('revenueReport', JSON.stringify(revenueReport, null, 2));

    const chartData = revenueReport.map((item) => ({
      name: item.name,
      totalRevenue: item.totalRevenue,
    }));

    res.status(200).json({ revenueReport, chartData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
