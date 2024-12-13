const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');

const app = express();
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, 'public')));

// Set default layout
app.set('layout', './layouts/main');

// Cấu hình EJS
app.set('view engine', 'ejs'); // Sử dụng EJS làm template engine
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB();

app.get('/', function (req, res) {
  res.render('dashboard/dashboard');
});

module.exports = app;
