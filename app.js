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
const users = [
  {
    name: 'Courtney Henry',
    username: 'Henrygaul',
    account: '(208) 555-0112',
    balance: '778.35',
    branch: 'Banyuwangi',
    swift: '68488',
    email: 'courtney.henry@example.com',
    createdAt: new Date('2023-01-15T10:30:00Z').toISOString(),
    isBanned: false,
  },
  {
    name: 'Eleanor Pena',
    username: 'Penagolem',
    account: '(239) 555-0108',
    balance: '328.85',
    branch: 'Surabaya',
    swift: '62912',
    email: 'eleanor.pena@example.com',
    createdAt: new Date('2023-03-22T14:45:00Z').toISOString(),
    isBanned: false,
  },
  {
    name: 'Kathryn Murphy',
    username: 'Kathryn21',
    account: '(808) 555-0111',
    balance: '219.78',
    branch: 'Jember',
    swift: '68342',
    email: 'kathryn.murphy@example.com',
    createdAt: new Date('2023-05-10T08:20:00Z').toISOString(),
    isBanned: false,
  },
  {
    name: 'Albert Flores',
    username: 'FloresAl',
    account: '(409) 555-0193',
    balance: '540.50',
    branch: 'Jakarta',
    swift: '73829',
    email: 'albert.flores@example.com',
    createdAt: new Date('2023-07-12T11:00:00Z').toISOString(),
    isBanned: false,
  },
  {
    name: 'Jenny Wilson',
    username: 'WilsonJen',
    account: '(101) 555-0223',
    balance: '432.00',
    branch: 'Malang',
    swift: '84563',
    email: 'jenny.wilson@example.com',
    createdAt: new Date('2023-08-20T15:30:00Z').toISOString(),
    isBanned: false,
  },
  {
    name: 'Ronald Richards',
    username: 'RichRon',
    account: '(520) 555-0118',
    balance: '125.90',
    branch: 'Medan',
    swift: '92473',
    email: 'ronald.richards@example.com',
    createdAt: new Date('2023-09-18T09:15:00Z').toISOString(),
    isBanned: false,
  },
  {
    name: 'Jacob Jones',
    username: 'JacobJone',
    account: '(313) 555-0167',
    balance: '870.25',
    branch: 'Bandung',
    swift: '52347',
    email: 'jacob.jones@example.com',
    createdAt: new Date('2023-10-12T12:45:00Z').toISOString(),
    isBanned: false,
  },
  {
    name: 'Kristin Watson',
    username: 'KWatson',
    account: '(813) 555-0154',
    balance: '654.12',
    branch: 'Semarang',
    swift: '64823',
    email: 'kristin.watson@example.com',
    createdAt: new Date('2023-11-25T10:00:00Z').toISOString(),
    isBanned: false,
  },
  {
    name: 'Cameron Williamson',
    username: 'CameronW',
    account: '(201) 555-0189',
    balance: '932.75',
    branch: 'Makassar',
    swift: '81234',
    email: 'cameron.williamson@example.com',
    createdAt: new Date('2023-12-02T13:30:00Z').toISOString(),
    isBanned: false,
  },
  {
    name: 'Esther Howard',
    username: 'EHoward',
    account: '(303) 555-0143',
    balance: '231.45',
    branch: 'Denpasar',
    swift: '72468',
    email: 'esther.howard@example.com',
    createdAt: new Date('2024-01-01T08:00:00Z').toISOString(),
    isBanned: false,
  },
];

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
app.get('/accounts', function (req, res) {
  const currentUser = 'Henrygaul';
  res.render('accounts/accounts', { users, currentUser });
});
app.get('/user-profile', function (req, res) {
  const { username } = req.query;
  const users = [
    {
      username: 'Henrygaul',
      firstName: 'Courtney',
      lastName: 'Henry',
      email: 'courtney.henry@example.com',
      phone: '(208) 555-0112',
      address: 'Banyuwangi',
      city: 'Banyuwangi',
      province: 'East Java',
      avatar: '/path/to/avatar2.png',
    },
    {
      username: 'Penagolem',
      firstName: 'Eleanor',
      lastName: 'Pena',
      email: 'eleanor.pena@example.com',
      phone: '(239) 555-0108',
      address: 'Surabaya',
      city: 'Surabaya',
      province: 'East Java',
      avatar: '/path/to/avatar3.png',
    },
    {
      username: 'Kathryn21',
      firstName: 'Kathryn',
      lastName: 'Murphy',
      email: 'kathryn.murphy@example.com',
      phone: '(808) 555-0111',
      address: 'Jember',
      city: 'Jember',
      province: 'East Java',
      avatar: '/path/to/avatar4.png',
    },
    {
      username: 'FloresAl',
      firstName: 'Albert',
      lastName: 'Flores',
      email: 'albert.flores@example.com',
      phone: '(409) 555-0193',
      address: 'Jakarta',
      city: 'Jakarta',
      province: 'DKI Jakarta',
      avatar: '/path/to/avatar5.png',
    },
    {
      username: 'WilsonJen',
      firstName: 'Jenny',
      lastName: 'Wilson',
      email: 'jenny.wilson@example.com',
      phone: '(101) 555-0223',
      address: 'Malang',
      city: 'Malang',
      province: 'East Java',
      avatar: '/path/to/avatar6.png',
    },
    {
      username: 'RichRon',
      firstName: 'Ronald',
      lastName: 'Richards',
      email: 'ronald.richards@example.com',
      phone: '(520) 555-0118',
      address: 'Medan',
      city: 'Medan',
      province: 'North Sumatra',
      avatar: '/path/to/avatar7.png',
    },
    {
      username: 'JacobJone',
      firstName: 'Jacob',
      lastName: 'Jones',
      email: 'jacob.jones@example.com',
      phone: '(313) 555-0167',
      address: 'Bandung',
      city: 'Bandung',
      province: 'West Java',
      avatar: '/path/to/avatar8.png',
    },
    {
      username: 'KWatson',
      firstName: 'Kristin',
      lastName: 'Watson',
      email: 'kristin.watson@example.com',
      phone: '(813) 555-0154',
      address: 'Semarang',
      city: 'Semarang',
      province: 'Central Java',
      avatar: '/path/to/avatar9.png',
    },
    {
      username: 'CameronW',
      firstName: 'Cameron',
      lastName: 'Williamson',
      email: 'cameron.williamson@example.com',
      phone: '(201) 555-0189',
      address: 'Makassar',
      city: 'Makassar',
      province: 'South Sulawesi',
      avatar: '/path/to/avatar10.png',
    },
    {
      username: 'EHoward',
      firstName: 'Esther',
      lastName: 'Howard',
      email: 'esther.howard@example.com',
      phone: '(303) 555-0143',
      address: 'Denpasar',
      city: 'Denpasar',
      province: 'Bali',
      avatar: '/path/to/avatar11.png',
    },
  ];

  const user = users.find((u) => u.username === username);

  if (user) {
    res.render('accounts/userProfile', { user });
  } else {
    res.status(404).send('User not found');
  }
});
app.post('/accounts/ban', (req, res) => {
  const { username } = req.body;

  // Tìm người dùng trong danh sách
  const user = users.find((u) => u.username === username);

  if (user) {
    user.isBanned = !user.isBanned; // Đảo trạng thái ban/unban
    res.redirect('/accounts'); // Chuyển hướng lại trang accounts
  } else {
    res.status(404).send('User not found');
  }
});
app.get('/reportsRevenue', async (req, res) => {
  try {
    res.render('reportsRevenue/reportsRevenue', { data: [] });
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.render('reportsRevenue/reportsRevenue', { data: [] });
  }
});
app.get('/reportsProduct', async (req, res) => {
  try {
    res.render('reportsProduct/reportsProduct', { data: [] });
  } catch (error) {
    console.error('Error fetching report data:', error);
    res.render('reportsProduct/reportsProduct', { data: [] });
  }
});

app.use('/orders', orderRoutes);
app.use('/api/orders', apiOrderRoutes);
app.use('/products', productRoutes);
app.use('/api/products', apiProductRoutes);
app.use('/reports', reportRoutes);

module.exports = app;
