const adminService = require('../../admins/services/adminServices');
exports.getAllAdmins = async (req, res) => {
  try {
    const filters = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    // Lấy danh sách users
    const { admins, totalPages } = await adminService.getAllUsers(
      page,
      limit,
      filters
    );

    // Trả về response
    return res.json({
      admins,
      currentPage: page,
      totalPages,
      filters,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};
