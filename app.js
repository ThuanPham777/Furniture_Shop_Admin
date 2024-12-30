const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const productRoutes = require('./app/products/routes/productRoutes');
const orderRoutes = require('./app/order/routes/orderRoutes');
const reportRoutes = require('./app/reports/routes/reportRoutes');
const apiProductRoutes = require('./app/api/products/apiProductRoutes');
const apiOrderRoutes = require('./app/api/orders/apiOrderRoutes');
const categoryRoutes = require('./app/category/routes/categoryRoutes');
const apiCategoryRoutes = require('./app/api/category/apiCategoryRoutes');
const manufacturerRoutes = require('./app/manufacturer/routes/manufacturerRoutes');
const apiManufacturerRoutes = require('./app/api/manufacturer/apiManufacturerRoutes');
const userRoutes = require('./app/users/routes/userRoutes');
const adminRoutes = require('./app/admins/routes/adminRoutes');
const apiUserRoutes = require('./app/api/user/apiUserRoutes');
const apiAdminRoutes = require('./app/api/admin/apiAdminRoutes');
const {
  ensureAuthenticated,
} = require('./middleware/auth/ensureAuthenticated');
const session = require('express-session');
const passport = require('passport');
require('./library/passport-config')(passport); // Import Passport config

const app = express();
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));

app.set('layout', './layouts/main');

// Cấu hình EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB();

// Cấu hình session
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Đặt thành `true` nếu dùng HTTPS
      maxAge: 3600000, // Thời gian tồn tại cookie (1 giờ)
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    // Nếu đã đăng nhập, chuyển hướng đến dashboard
    res.redirect('/');
  } else {
    // Nếu chưa đăng nhập, hiển thị trang login
    res.render('auth/login', { layout: false });
  }
});
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Error during authentication:', err);
      return res.redirect('/login');
    }
    if (!user) {
      console.error('Authentication failed:', info.message);
      return res.render('auth/login', { error: info.message, layout: false }); // Truyền lỗi vào view
    }

    req.logIn(user, async (err) => {
      if (err) {
        console.error('Error logging in:', err);
        return res.redirect('/login');
      }
      res.redirect('/');
    });
  })(req, res, next);
});

// Route dashboard
app.get('/', ensureAuthenticated, (req, res) => {
  res.render('dashboard/dashboard');
});
app.use('/', adminRoutes);
app.use('/orders', orderRoutes);
app.use('/api/orders', apiOrderRoutes);
app.use('/products', productRoutes);
app.use('/api/products', apiProductRoutes);
app.use('/reports', reportRoutes);
app.use('/categoryProducts', categoryRoutes);
app.use('/api/categoryProducts', apiCategoryRoutes);
app.use('/manufacturerProducts', manufacturerRoutes);
app.use('/api/manufacturerProducts', apiManufacturerRoutes);
app.use('/accounts', userRoutes);
app.use('/api/accounts', apiUserRoutes);
app.use('/api/admins', apiAdminRoutes);

module.exports = app;
