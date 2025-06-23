const express = require("express");
const cors = require("cors");
const db = require("./db");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid"); // Tambahkan di bagian atas file

const app = express();
app.use(cors());
app.use(express.json());

// Cek koneksi awal
app.get("/", (req, res) => {
  res.send("Backend Node.js Aktif 🚀");
});

// Ambil semua users (optional)
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Gagal ambil data users" });
    }
    res.json(results);
  });
});

// 🔐 SIGNUP: POST /signup
// 🔐 SIGNUP: POST /signup
app.post("/signup", async (req, res) => {
  const { name, username, email, password, role } = req.body;

  // Validasi input
  if (!name || !username || !email || !password || !role) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  // Validasi role
  if (role !== "customer" && role !== "admin") {
    return res.status(400).json({ message: "Role tidak valid." });
  }

  try {
    const user_id = uuidv4(); // 🔑 Buat ID unik
    const hashedPassword = await bcrypt.hash(password, 10);

    // Masukkan user ke database dengan user_id
    const sql = `INSERT INTO users (user_id, name, username, email, password, role)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [user_id, name, username, email, hashedPassword, role];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error insert user:", err);
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "Username atau email sudah terdaftar." });
        }
        return res.status(500).json({ message: "Gagal mendaftar." });
      }

      res.status(201).json({ message: "Pendaftaran berhasil!" });
    });
  } catch (error) {
    console.error("Hashing error:", error);
    res.status(500).json({ message: "Terjadi kesalahan server." });
  }
});

// 🔐 LOGIN
app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email dan password wajib diisi" });

  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });

    if (results.length === 0)
      return res.status(401).json({ message: "Email tidak ditemukan" });

    const user = results[0];

    // Cek password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error membandingkan password" });

      if (!isMatch) return res.status(401).json({ message: "Password salah" });

      // Berhasil login
      const { user_id, name, email, role } = user;
      res.json({ user_id, name, email, role });
    });
  });
});

// Jalankan server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
