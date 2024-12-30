// controllers/userController.js
const passport = require('passport');
const adminService = require('../services/adminServices'); // Import user service
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
  const { username, email, password, passwordConfirm } = req.body;

  try {
    if (password !== passwordConfirm) {
      return res.render('auth/signup', {
        error: 'Mật khẩu xác nhận không trùng khớp',
      });
    }

    const userExists = await adminService.findUserByEmail(email);
    if (userExists) {
      return res.render('auth/signup', { error: 'Email đã được sử dụng' });
    }

    const user = await adminService.createUser({ username, email, password });

    await user.save();

    res.render('auth/list-admin', { filters: {} });
  } catch (err) {
    console.error(err);
    res.render('auth/signup', { error: 'Có lỗi xảy ra, vui lòng thử lại!' });
  }
};

// Xử lý đăng nhập
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return res.redirect('/login');
    }
    if (!user) {
      console.error('Authentication failed:', info.message);
      return res.render('auth/login', { error: info.message, layout: false });
    }

    req.logIn(user, async (err) => {
      if (err) {
        console.error('Error logging in:', err);
        return res.redirect('/login');
      }
      res.redirect('/');
    });
  })(req, res, next);
};

// Xử lý đăng xuất
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.redirect('/');
    }
    res.redirect('/login');
  });
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu
    if (newPassword !== confirmNewPassword) {
      return res.status(400).render('auth/profile', {
        changePassword_message: 'New password and confirmation do not match',
        success: false,
      });
    }

    // Tìm người dùng
    const user = await adminService.findUserById(userId);
    if (!user) {
      return res.status(404).render('auth/profile', {
        changePassword_message: 'User not found',
        success: false,
      });
    }

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).render('auth/profile', {
        changePassword_message: 'Current password is incorrect',
        success: false,
      });
    }

    // Cập nhật mật khẩu mới (được mã hóa ở userSchema)
    user.password = newPassword;
    await user.save();

    res.status(200).render('auth/profile', {
      changePassword_message: 'Password changed successfully',
      success: true,
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).render('auth/profile', {
      changePassword_message: 'Error changing password',
      success: false,
      error: error.message,
    });
  }
};

exports.editProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      username,
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      province,
      birthday,
    } = req.body;

    const user = await adminService.findUserById(userId);
    if (!user) {
      return res.status(404).render('auth/profile', {
        editProfile_message: 'User not found',
        success: false,
        user: req.body,
      });
    }

    let avatarUrl = null;
    if (req.file) {
      try {
        avatarUrl = await adminService.uploadAvatar(userId, req.file); // Wait for avatar upload
      } catch (err) {
        return res.status(400).render('auth/profile', {
          editProfile_message: err.message,
          success: false,
          user: req.body,
        });
      }
    }

    const updatedUser = await adminService.updateUser(userId, {
      username,
      firstName,
      lastName,
      phoneNumber,
      address,
      city,
      province,
      birthday,
      ...(avatarUrl && { avatarUrl }), // Add avatar URL if it's set
    });

    res.status(200).render('auth/profile', {
      editProfile_message: 'Profile updated successfully',
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).render('auth/profile', {
      editProfile_message: 'Error updating profile',
      success: false,
      error: error.message,
      user: req.body,
    });
  }
};

exports.renderAdminPage = async (req, res) => {
  try {
    const filters = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const { admins, totalPages } = await adminService.getAllUsers(page, limit);

    // Render HTML for initial page load
    res.render('auth/list-admin', {
      filters,
      admins,
      currentPage: page,
      totalPages,
      limit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
};

exports.renderAdminDetailsPage = async (req, res) => {
  try {
    const userId = req.params.userId;
    const admin = await adminService.findUserById(userId);
    if (!admin) {
      return res.status(404).send('User not found');
    }
    res.render('auth/admin-details', { admin });
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong!');
  }
};
