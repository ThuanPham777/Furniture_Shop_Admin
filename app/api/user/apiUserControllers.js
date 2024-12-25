const userService = require('../../users/services/userService');
const User = require('../../users/models/userModel');
exports.getAllUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1); // Đảm bảo page luôn >= 1
    const limit = Math.max(1, parseInt(req.query.limit) || 10); // Đảm bảo limit luôn >= 1
    const { sort, order, username, email } = req.query;

    // Xây dựng query filter
    const filter = {};
    if (username) filter.username = { $regex: username, $options: 'i' }; // Tìm kiếm không phân biệt hoa thường
    if (email) filter.email = { $regex: email, $options: 'i' };

    // Xây dựng sorting
    const sortOptions = {};
    if (sort) {
      sortOptions[sort] = order === 'asc' ? 1 : -1;
    }

    // Lấy danh sách users
    const users = await userService.getAllUsers(
      page,
      limit,
      filter,
      sortOptions
    );
    const totalUsers = await userService.countUsers(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    // Trả về response
    return res.json({
      users,
      currentPage: page,
      totalPages,
      filters: { username, email },
      sorting: { sort, order },
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
