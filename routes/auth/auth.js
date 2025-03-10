const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../../db");

const router = express.Router();

router.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
        "INSERT  users (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "User registered successfully" });
        }
    );
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log("inside login api")
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
            console.log("credential match ok , creating token using jwt")
        console.log("JWT_SECRET from env:", process.env.JWT_SECRET);
        const jwtSecret = process.env.JWT_SECRET || "056a0395971c4862f72563ec1abd112d381ec2a7b634cb76f0b8a3c710e81a1faf2ee96d2eeb75188252d9da37c67d70aec32948581fac5a3351a358ce552b37";

        const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });
        res.json({ token });
    });
});

 module.exports = router;
// const express = require("express");
// const router = express.Router();
//
// router.post("/register", (req, res) => {
//     res.send("User Registered");
// });
//
// router.post("/login", (req, res) => {
//     res.send("User Logged In");
// });
//
// module.exports = router;
