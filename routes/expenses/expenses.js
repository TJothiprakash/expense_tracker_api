const express = require("express");
const db = require("../../db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(403).json({ error: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
};

// Add new expense
router.post("/", authenticateToken, (req, res) => {
    const { amount, category, description, date } = req.body;
    db.query(
        "INSERT INTO expenses (user_id, amount, category, description, date) VALUES (?, ?, ?, ?, ?)",
        [req.user.userId, amount, category, description, date],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Expense added successfully" });
        }
    );
});

// Get expenses with filters
router.get("/", authenticateToken, (req, res) => {
    let query = "SELECT * FROM expenses WHERE user_id = ?";
    let params = [req.user.userId];

    if (req.query.filter) {
        const now = new Date();
        let startDate;

        switch (req.query.filter) {
            case "week":
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case "month":
                startDate = new Date(now.setMonth(now.getMonth() - 1));
                break;
            case "3months":
                startDate = new Date(now.setMonth(now.getMonth() - 3));
                break;
        }

        if (startDate) {
            query += " AND date >= ?";
            params.push(startDate.toISOString().split("T")[0]);
        }
    }

    db.query(query, params, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Update an expense
router.put("/:id", authenticateToken, (req, res) => {
    const { amount, category, description, date } = req.body;
    db.query(
        "UPDATE expenses SET amount = ?, category = ?, description = ?, date = ? WHERE id = ? AND user_id = ?",
        [amount, category, description, date, req.params.id, req.user.userId],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Expense updated successfully" });
        }
    );
});

// Delete an expense
router.delete("/:id", authenticateToken, (req, res) => {
    db.query("DELETE FROM expenses WHERE id = ? AND user_id = ?", [req.params.id, req.user.userId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Expense deleted successfully" });
    });
});

module.exports = router;
