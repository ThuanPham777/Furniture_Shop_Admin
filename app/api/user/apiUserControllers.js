const userService = require('../../users/services/userService');
const User = require('../../users/models/userModel');
exports.getAllUsers = async (req, res) => {
  try {
    const filters = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    console.log('filter: ' + JSON.stringify(filters, null, 2));
    // Lấy danh sách users
    const { users, totalPages } = await userService.getAllUsers(
      page,
      limit,
      filters
    );

    // Trả về response
    return res.json({
      users,
      currentPage: page,
      totalPages,
      filters,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong!' });
  }
};

exports.banUser = async (req, res) => {
  const userId = req.params.userId;
  const { isBanned } = req.body;

  try {
    await User.findByIdAndUpdate(userId, { isBanned });
    res.status(200).send({ message: 'User status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Failed to update user status' });
  }
};
