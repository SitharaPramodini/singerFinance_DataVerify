const express = require("express");
const mysql = require("mysql");
const router = express.Router();

// MySQL connection pool
const pool = mysql.createPool({
  host: "192.168.8.120",
  user: "root",
  port: "3306",
  password: "Abc@1234",
  database: "face_detection",
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const query = `
    SELECT l.counter_id, c.branch_id
    FROM login l
    JOIN counters c ON l.counter_id = c.counter_id
    WHERE l.username = ? AND l.password = ?
  `;

  pool.query(query, [username, password], (error, results) => {
    if (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: error });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { counter_id, branch_id } = results[0];

    const maxAge = 10 * 365 * 24 * 60 * 60 * 1000; // 10 years

    res.cookie("counter_id", counter_id, {
      maxAge,
      httpOnly: true,
      sameSite: "strict",
    });

    res.cookie("branch_id", branch_id, {
      maxAge,
      httpOnly: true,
      sameSite: "strict",
    });

    return res.json({ message: "Login successful", counter_id, branch_id });
  });
});

module.exports = router;
