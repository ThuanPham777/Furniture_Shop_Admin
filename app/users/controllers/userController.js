// controllers/userController.js
const userService = require('../services/userService');
exports.renderAccountPage = async (req, res) => {
  try {
    const filters = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { users, totalPages } = await userService.getAllUsers(page, limit);

    // Render HTML for initial page load
    res.render('accounts/accounts', {
      filters,
      users,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
};

exports.renderAccoutDetailsPage = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('accounts/account-details', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
};
