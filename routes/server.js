require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");


const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});


const authRoutes = require("./auth/auth");
const expenseRoutes = require("./expenses/expenses");

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
