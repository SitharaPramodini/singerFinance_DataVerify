const mysql = require("mysql");

const pool = mysql.createPool({
  host: "192.168.8.120",
  user: "root",
  port: "3306",
  password: "Abc@1234",
  database: "face_detection",
});

module.exports = pool;
