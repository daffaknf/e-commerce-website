const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: null, // kosongkan jika tidak pakai password
  database: "ecommerce_1", // ganti dengan nama database kamu
});

connection.connect((err) => {
  if (err) {
    console.error("Koneksi ke database gagal:", err);
    return;
  }
  console.log("Terhubung ke database MySQL!");
});

module.exports = connection;
