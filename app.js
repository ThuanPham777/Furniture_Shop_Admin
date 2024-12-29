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
const apiUserRoutes = require('./app/api/user/apiUserRoutes');

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

app.get('/', function (req, res) {
  res.render('dashboard/dashboard');
});

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

module.exports = app;
