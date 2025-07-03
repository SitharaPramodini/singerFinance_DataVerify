const express = require("express");
const mysql = require("mysql");
const router = express.Router();

const pool = require("../dbPool"); 

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

router.get("/temp-customer-details", (req, res) => {
  const branch_id = req.cookies.branch_id;
  const counter_id = req.cookies.counter_id;

  if (!branch_id || !counter_id) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const query = `
    SELECT customer_temp_id, temp_customer_name, temp_customer_nic, 
           temp_customer_address, temp_customer_face_encoding
    FROM customer_temp
    WHERE branch_id = ? AND counter_id = ?
  `;

  pool.query(query, [branch_id, counter_id], (error, results) => {
    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(results);
  });
});

router.post("/passANDdelete-customer", (req, res) => {
  const {
    customer_temp_id,
    temp_customer_name,
    temp_customer_nic,
    temp_customer_address
  } = req.body;

  if (!customer_temp_id || !temp_customer_name || !temp_customer_nic || !temp_customer_address) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Insert into `customer` table
  const insertQuery = `
    INSERT INTO customer (customer_name, customer_nic, customer_address, submit_datetime)
    VALUES (?, ?, ?, NOW())
  `;

  pool.query(insertQuery, [temp_customer_name, temp_customer_nic, temp_customer_address], (insertErr, insertResult) => {
    if (insertErr) {
      console.error("Insert error:", insertErr);
      return res.status(500).json({ message: "Insert failed" });
    }

    // After inserting, delete from `customer_temp`
    const deleteQuery = `
      DELETE FROM customer_temp WHERE customer_temp_id = ?
    `;

    pool.query(deleteQuery, [customer_temp_id], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error("Delete error:", deleteErr);
        return res.status(500).json({ message: "Delete failed after insert" });
      }

      res.json({ message: "Customer saved and temp deleted successfully" });
    });
  });
});


module.exports = router;
