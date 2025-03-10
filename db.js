require("dotenv").config();  // Load env file
const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root@123",
    database: process.env.DB_NAME || "expense_tracker",
});

connection.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL database");
});

module.exports = connection;
