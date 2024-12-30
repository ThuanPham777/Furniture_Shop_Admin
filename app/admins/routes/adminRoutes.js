const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers');
const {
  ensureAuthenticated,
} = require('../../../middleware/auth/ensureAuthenticated');
const upload = require('../../../config/upload');

// Trang đăng ký
router.get('/signup', (req, res) => res.render('auth/signup'));

router.get('/list-admin', adminController.renderAdminPage);
router.get('/admin/:userId', adminController.renderAdminDetailsPage);

//  Trang profile
router.get('/profile', (req, res) => res.render('auth/profile'));

// Xử lý đăng ký
router.post('/signup', adminController.signup);

// Xử lý đăng nhập
//router.post('/login', adminController.login);

// Xử lý đăng xuất
router.get('/logout', adminController.logout);

router.post(
  '/profile/edit',
  ensureAuthenticated,
  upload.single('avatar'),
  adminController.editProfile
);
router.post(
  '/profile/change-password',
  ensureAuthenticated,
  adminController.changePassword
);

module.exports = router;
