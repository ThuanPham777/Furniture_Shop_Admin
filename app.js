const express = require("express");
const path = require("path");
const connectDB = require("./config/db");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressLayouts = require("express-ejs-layouts");
const productRoutes = require("./app/products/routes/productRoutes");
const apiProductRoutes = require("./app/api/products/apiProductRoutes");
const users = [
  {
    name: "Courtney Henry",
    username: "Henrygaul",
    account: "(208) 555-0112",
    balance: "778.35",
    branch: "Banyuwangi",
    swift: "68488",
    email: "courtney.henry@example.com",
    createdAt: new Date("2023-01-15T10:30:00Z").toISOString(),
    isBanned: false,
  },
  {
    name: "Eleanor Pena",
    username: "Penagolem",
    account: "(239) 555-0108",
    balance: "328.85",
    branch: "Surabaya",
    swift: "62912",
    email: "eleanor.pena@example.com",
    createdAt: new Date("2023-03-22T14:45:00Z").toISOString(),
    isBanned: false,
  },
  {
    name: "Kathryn Murphy",
    username: "Kathryn21",
    account: "(808) 555-0111",
    balance: "219.78",
    branch: "Jember",
    swift: "68342",
    email: "kathryn.murphy@example.com",
    createdAt: new Date("2023-05-10T08:20:00Z").toISOString(),
    isBanned: false,
  },
  {
    name: "Albert Flores",
    username: "FloresAl",
    account: "(409) 555-0193",
    balance: "540.50",
    branch: "Jakarta",
    swift: "73829",
    email: "albert.flores@example.com",
    createdAt: new Date("2023-07-12T11:00:00Z").toISOString(),
    isBanned: false,
  },
  {
    name: "Jenny Wilson",
    username: "WilsonJen",
    account: "(101) 555-0223",
    balance: "432.00",
    branch: "Malang",
    swift: "84563",
    email: "jenny.wilson@example.com",
    createdAt: new Date("2023-08-20T15:30:00Z").toISOString(),
    isBanned: false,
  },
  {
    name: "Ronald Richards",
    username: "RichRon",
    account: "(520) 555-0118",
    balance: "125.90",
    branch: "Medan",
    swift: "92473",
    email: "ronald.richards@example.com",
    createdAt: new Date("2023-09-18T09:15:00Z").toISOString(),
    isBanned: false,
  },
  {
    name: "Jacob Jones",
    username: "JacobJone",
    account: "(313) 555-0167",
    balance: "870.25",
    branch: "Bandung",
    swift: "52347",
    email: "jacob.jones@example.com",
    createdAt: new Date("2023-10-12T12:45:00Z").toISOString(),
    isBanned: false,
  },
  {
    name: "Kristin Watson",
    username: "KWatson",
    account: "(813) 555-0154",
    balance: "654.12",
    branch: "Semarang",
    swift: "64823",
    email: "kristin.watson@example.com",
    createdAt: new Date("2023-11-25T10:00:00Z").toISOString(),
    isBanned: false,
  },
  {
    name: "Cameron Williamson",
    username: "CameronW",
    account: "(201) 555-0189",
    balance: "932.75",
    branch: "Makassar",
    swift: "81234",
    email: "cameron.williamson@example.com",
    createdAt: new Date("2023-12-02T13:30:00Z").toISOString(),
    isBanned: false,
  },
  {
    name: "Esther Howard",
    username: "EHoward",
    account: "(303) 555-0143",
    balance: "231.45",
    branch: "Denpasar",
    swift: "72468",
    email: "esther.howard@example.com",
    createdAt: new Date("2024-01-01T08:00:00Z").toISOString(),
    isBanned: false,
  },
];

const app = express();
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "public")));

app.set("layout", "./layouts/main");

// Cấu hình EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

connectDB();

app.get("/", function (req, res) {
  res.render("dashboard/dashboard", { users });
});
app.get("/accounts", function (req, res) {
  const currentUser = "Henrygaul";
  res.render("accounts/accounts", { users, currentUser });
});
app.get("/user-profile", function (req, res) {
  const { username } = req.query;
  const users = [
    {
      username: "Henrygaul",
      firstName: "Courtney",
      lastName: "Henry",
      email: "courtney.henry@example.com",
      phone: "(208) 555-0112",
      address: "Banyuwangi",
      city: "Banyuwangi",
      province: "East Java",
      avatar: "/path/to/avatar2.png",
    },
    {
      username: "Penagolem",
      firstName: "Eleanor",
      lastName: "Pena",
      email: "eleanor.pena@example.com",
      phone: "(239) 555-0108",
      address: "Surabaya",
      city: "Surabaya",
      province: "East Java",
      avatar: "/path/to/avatar3.png",
    },
    {
      username: "Kathryn21",
      firstName: "Kathryn",
      lastName: "Murphy",
      email: "kathryn.murphy@example.com",
      phone: "(808) 555-0111",
      address: "Jember",
      city: "Jember",
      province: "East Java",
      avatar: "/path/to/avatar4.png",
    },
    {
      username: "FloresAl",
      firstName: "Albert",
      lastName: "Flores",
      email: "albert.flores@example.com",
      phone: "(409) 555-0193",
      address: "Jakarta",
      city: "Jakarta",
      province: "DKI Jakarta",
      avatar: "/path/to/avatar5.png",
    },
    {
      username: "WilsonJen",
      firstName: "Jenny",
      lastName: "Wilson",
      email: "jenny.wilson@example.com",
      phone: "(101) 555-0223",
      address: "Malang",
      city: "Malang",
      province: "East Java",
      avatar: "/path/to/avatar6.png",
    },
    {
      username: "RichRon",
      firstName: "Ronald",
      lastName: "Richards",
      email: "ronald.richards@example.com",
      phone: "(520) 555-0118",
      address: "Medan",
      city: "Medan",
      province: "North Sumatra",
      avatar: "/path/to/avatar7.png",
    },
    {
      username: "JacobJone",
      firstName: "Jacob",
      lastName: "Jones",
      email: "jacob.jones@example.com",
      phone: "(313) 555-0167",
      address: "Bandung",
      city: "Bandung",
      province: "West Java",
      avatar: "/path/to/avatar8.png",
    },
    {
      username: "KWatson",
      firstName: "Kristin",
      lastName: "Watson",
      email: "kristin.watson@example.com",
      phone: "(813) 555-0154",
      address: "Semarang",
      city: "Semarang",
      province: "Central Java",
      avatar: "/path/to/avatar9.png",
    },
    {
      username: "CameronW",
      firstName: "Cameron",
      lastName: "Williamson",
      email: "cameron.williamson@example.com",
      phone: "(201) 555-0189",
      address: "Makassar",
      city: "Makassar",
      province: "South Sulawesi",
      avatar: "/path/to/avatar10.png",
    },
    {
      username: "EHoward",
      firstName: "Esther",
      lastName: "Howard",
      email: "esther.howard@example.com",
      phone: "(303) 555-0143",
      address: "Denpasar",
      city: "Denpasar",
      province: "Bali",
      avatar: "/path/to/avatar11.png",
    },
  ];

  const user = users.find((u) => u.username === username);

  if (user) {
    res.render("accounts/userProfile", { user });
  } else {
    res.status(404).send("User not found");
  }
});
app.post("/accounts/ban", (req, res) => {
  const { username } = req.body;

  // Tìm người dùng trong danh sách
  const user = users.find((u) => u.username === username);

  if (user) {
    user.isBanned = !user.isBanned; // Đảo trạng thái ban/unban
    res.redirect("/accounts"); // Chuyển hướng lại trang accounts
  } else {
    res.status(404).send("User not found");
  }
});
app.get("/orders", function (req, res) {
  const orders = [
    {
      id: 1,
      username: "Henrygaul",
      product: "Table",
      status: "paid",
      createdAt: new Date("2024-03-01T08:00:00Z").toISOString(),
    },
    {
      id: 2,
      username: "Penagolem",
      product: "Chair",
      status: "unpaid",
      createdAt: new Date("2023-02-01T08:00:00Z").toISOString(),
    },
    {
      id: 3,
      username: "Kathryn21",
      product: "Desk",
      status: "paid",
      createdAt: new Date("2022-04-01T08:00:00Z").toISOString(),
    },
    {
      id: 4,
      username: "FloresAl",
      product: "Lamp",
      status: "unpaid",
      createdAt: new Date("2021-05-01T08:00:00Z").toISOString(),
    },
    {
      id: 5,
      username: "WilsonJen",
      product: "Sofa",
      status: "paid",
      createdAt: new Date("2020-01-01T08:00:00Z").toISOString(),
    },
  ];

  res.render("orders/orders", { orders });
});
app.get("/detailOrder", function (req, res) {
  const { id } = req.query;
  const details = [
    {
      id: "1",
      name: "Chair",
      price: 10,
      quantity: 20,
      manufacturer: "Company XYZ",
      details: "This is a high-quality product.",
      shipCost: 10,
      total: 10 * 20 + 10,
    },
    {
      id: "5",
      name: "Chair",
      price: 10,
      quantity: 20,
      manufacturer: "Company XYZ",
      details: "This is a high-quality product.",
      shipCost: 10,
      total: 10 * 20 + 10,
    },
    {
      id: "2",
      name: "Chair",
      price: 10,
      quantity: 20,
      manufacturer: "Company XYZ",
      details: "This is a high-quality product.",
      shipCost: 10,
      total: 10 * 20 + 10,
    },
    {
      id: "3",
      name: "Chair",
      price: 10,
      quantity: 20,
      manufacturer: "Company XYZ",
      details: "This is a high-quality product.",
      shipCost: 10,
      total: 10 * 20 + 10,
    },
    {
      id: "4",
      name: "Chair",
      price: 10,
      quantity: 20,
      manufacturer: "Company XYZ",
      details: "This is a high-quality product.",
      shipCost: 10,
      total: 10 * 20 + 10,
    },
  ];
  const detail = details.find((u) => u.id === id);

  if (detail) {
    res.render("orders/detailOrder", { detail });
  } else {
    res.status(404).send("User not found");
  }

  res.render("orders/orders", { orders });
});
app.post("/updateOrderStatus", (req, res) => {
  const { id, status } = req.body;

  const order = orders.find((order) => order.id === id);
  if (order) {
    order.status = status;
    return res.json({ success: true, updatedStatus: status });
  }

  res.status(404).json({ success: false, message: "Order not found" });
});
const orders = [
  {
    date: "2024-12-01",
    product: "Product A",
    manufacturer: "Company X",
    revenue: 100,
  },
  {
    date: "2024-12-02",
    product: "Product B",
    manufacturer: "Company Y",
    revenue: 200,
  },
  {
    date: "2024-12-03",
    product: "Product C",
    manufacturer: "Company Z",
    revenue: 150,
  },
  {
    date: "2024-12-04",
    product: "Product D",
    manufacturer: "Company X",
    revenue: 300,
  },
  {
    date: "2024-11-10",
    product: "Product E",
    manufacturer: "Company Y",
    revenue: 400,
  },
];
app.get("/reportsRevenue", async (req, res) => {
  try {
    res.render("reportsRevenue/reportsRevenue", { data: [] });
  } catch (error) {
    console.error("Error fetching report data:", error);
    res.render("reportsRevenue/reportsRevenue", { data: [] });
  }
});
app.get("/reportsProduct", async (req, res) => {
  try {
    res.render("reportsProduct/reportsProduct", { data: [] });
  } catch (error) {
    console.error("Error fetching report data:", error);
    res.render("reportsProduct/reportsProduct", { data: [] });
  }
});

app.get("/getRevenueReport", (req, res) => {
  const { timeRange, startDate, endDate } = req.query;
  let filteredOrders = [...orders];

  // Filter by date range
  if (startDate && endDate) {
    filteredOrders = filteredOrders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });
  }

  // Aggregate data based on time range
  let aggregatedData;
  if (timeRange === "day") {
    aggregatedData = filteredOrders.map((order) => ({
      date: order.date,
      product: order.product,
      manufacturer: order.manufacturer,
      orders: 1,
      revenue: order.revenue,
    }));
  } else if (timeRange === "week") {
    const weekMap = {};
    filteredOrders.forEach((order) => {
      const weekNumber = `Week ${getWeekNumber(new Date(order.date))}`;
      if (!weekMap[weekNumber]) {
        weekMap[weekNumber] = {
          date: weekNumber,
          product: "N/A",
          manufacturer: "N/A",
          orders: 0,
          revenue: 0,
        };
      }
      weekMap[weekNumber].orders += 1;
      weekMap[weekNumber].revenue += order.revenue;
    });
    aggregatedData = Object.values(weekMap);
  } else if (timeRange === "month") {
    const monthMap = {};
    filteredOrders.forEach((order) => {
      const month = new Date(order.date).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      if (!monthMap[month]) {
        monthMap[month] = {
          date: month,
          product: "N/A",
          manufacturer: "N/A",
          orders: 0,
          revenue: 0,
        };
      }
      monthMap[month].orders += 1;
      monthMap[month].revenue += order.revenue;
    });
    aggregatedData = Object.values(monthMap);
  } else {
    aggregatedData = filteredOrders.map((order) => ({
      date: order.date,
      product: order.product,
      manufacturer: order.manufacturer,
      orders: 1,
      revenue: order.revenue,
    }));
  }

  res.json(aggregatedData);
});
app.get("/getProductReport", (req, res) => {
  const { timeRange, startDate, endDate } = req.query;
  let filteredOrders = [...orders];

  // Filter by date range
  if (startDate && endDate) {
    filteredOrders = filteredOrders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });
  }

  // Aggregate data based on time range
  let aggregatedData;
  if (timeRange === "day") {
    aggregatedData = filteredOrders.map((order) => ({
      date: order.date,
      product: order.product,
      manufacturer: order.manufacturer,
      orders: 1,
    }));
  } else if (timeRange === "week") {
    const weekMap = {};
    filteredOrders.forEach((order) => {
      const weekNumber = `Week ${getWeekNumber(new Date(order.date))}`;
      if (!weekMap[weekNumber]) {
        weekMap[weekNumber] = {
          date: weekNumber,
          product: order.product,
          manufacturer: order.manufacturer,
          orders: 0,
        };
      }
      weekMap[weekNumber].orders += 1;
    });
    aggregatedData = Object.values(weekMap);
  } else if (timeRange === "month") {
    const monthMap = {};
    filteredOrders.forEach((order) => {
      const month = new Date(order.date).toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      if (!monthMap[month]) {
        monthMap[month] = {
          date: month,
          product: order.product,
          manufacturer: order.manufacturer,
          orders: 0,
        };
      }
      monthMap[month].orders += 1;
    });
    aggregatedData = Object.values(monthMap);
  } else {
    aggregatedData = filteredOrders.map((order) => ({
      date: order.date,
      product: order.product,
      manufacturer: order.manufacturer,
      orders: 1,
    }));
  }

  res.json(aggregatedData);
});
// Utility Function: Get Week Number
function getWeekNumber(d) {
  const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

app.use("/products", productRoutes);
app.use("/api/products", apiProductRoutes);
module.exports = app;
