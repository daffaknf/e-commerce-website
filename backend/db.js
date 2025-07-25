const mysql = require("mysql2/promise");

// Gunakan createPool agar tidak perlu connect manual
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // kosongkan jika tidak pakai password
  database: "ecommerce_1", // sesuaikan dengan nama database kamu
});

// Tidak perlu .connect() karena createPool otomatis mengatur koneksi

module.exports = db;
