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

const multer = require("multer");
const path = require("path");

// Setup penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder penyimpanan gambar
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Biarkan Express akses file statis di folder uploads
app.use("/uploads", express.static("uploads"));

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

// GET semua kategori
app.get("/categorys", (req, res) => {
  db.query("SELECT * FROM categorys", (err, result) => {
    if (err) return res.status(500).json({ message: "Error ambil data" });
    res.json(result);
  });
});

// POST tambah kategori
// POST tambah kategori (pakai UUID untuk category_id karena tipe VARCHAR)
app.post("/categorys", (req, res) => {
  const { name } = req.body;
  const category_id = uuidv4(); // 🔑 Buat ID unik

  if (!name) {
    return res
      .status(400)
      .json({ message: "Nama kategori tidak boleh kosong" });
  }

  db.query(
    "INSERT INTO categorys (category_id, name) VALUES (?, ?)",
    [category_id, name],
    (err) => {
      if (err) {
        console.error("❌ Gagal tambah kategori:", err);
        return res.status(500).json({ message: "Gagal tambah kategori" });
      }
      res.json({ message: "Kategori berhasil ditambahkan" });
    }
  );
});

// PUT update kategori
app.put("/categorys/:id", (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  db.query(
    "UPDATE categorys SET name = ? WHERE category_id = ?",
    [name, id],
    (err) => {
      if (err)
        return res.status(500).json({ message: "Error update kategori" });
      res.json({ message: "Kategori diupdate" });
    }
  );
});

// DELETE hapus kategori
app.delete("/categorys/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM categorys WHERE category_id = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Error hapus kategori" });
    res.json({ message: "Kategori dihapus" });
  });
});

// GET semua produk
// GET semua produk + nama kategori
app.get("/products", (req, res) => {
  const sql = `
    SELECT 
      p.product_id, 
      p.name, 
      p.stock, 
      p.price, 
      p.category_id,
      p.image_product,
      c.name AS category_name
    FROM product p
    JOIN categorys c ON p.category_id = c.category_id
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.error("Gagal ambil produk:", err);
      return res.status(500).json({ message: "Error ambil produk" });
    }
    res.json(result);
  });
});

// POST tambah produk
// POST tambah produk + upload gambar
app.post("/products", upload.single("image_product"), (req, res) => {
  const { name, stock, price, category_id } = req.body;
  const image_product = req.file ? req.file.filename : null;
  const product_id = uuidv4();

  if (
    !name ||
    stock == null ||
    price == null ||
    !category_id ||
    !image_product
  ) {
    return res
      .status(400)
      .json({ message: "Semua field harus diisi termasuk gambar" });
  }

  const sql =
    "INSERT INTO product (product_id, name, stock, price, category_id, image_product) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    sql,
    [product_id, name, stock, price, category_id, image_product],
    (err) => {
      if (err) {
        console.error("Gagal tambah produk:", err);
        return res.status(500).json({ message: "Gagal tambah produk" });
      }
      res.json({ message: "Produk ditambahkan" });
    }
  );
});

// PUT update produk
app.put("/products/:id", upload.single("image_product"), (req, res) => {
  const { name, stock, price, category_id } = req.body;
  const { id } = req.params;
  const image_product = req.file ? req.file.filename : null;

  let sql, params;
  if (image_product) {
    sql = `
      UPDATE product SET name = ?, stock = ?, price = ?, category_id = ?, image_product = ?
      WHERE product_id = ?
    `;
    params = [name, stock, price, category_id, image_product, id];
  } else {
    sql = `
      UPDATE product SET name = ?, stock = ?, price = ?, category_id = ?
      WHERE product_id = ?
    `;
    params = [name, stock, price, category_id, id];
  }

  db.query(sql, params, (err) => {
    if (err) {
      console.error("Gagal update produk:", err);
      return res.status(500).json({ message: "Gagal update produk" });
    }
    res.json({ message: "Produk diupdate" });
  });
});

// DELETE hapus produk
app.delete("/products/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM product WHERE product_id = ?", [id], (err) => {
    if (err) {
      console.error("Gagal hapus produk:", err);
      return res.status(500).json({ message: "Gagal hapus produk" });
    }
    res.json({ message: "Produk dihapus" });
  });
});

// GET semua voucher
app.get("/vouchers", (req, res) => {
  db.query("SELECT * FROM vouchers", (err, result) => {
    if (err) return res.status(500).json({ message: "Gagal ambil voucher" });
    res.json(result);
  });
});

// POST tambah voucher
app.post("/vouchers", (req, res) => {
  const { code_voucher, name_voucher, discount_percent, quota } = req.body;
  const voucher_id = uuidv4();

  if (!code_voucher || !name_voucher || !discount_percent || !quota) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  const sql = `
    INSERT INTO vouchers (voucher_id, code_voucher, name_voucher, discount_percent, quota)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [voucher_id, code_voucher, name_voucher, discount_percent, quota],
    (err) => {
      if (err) {
        console.error("Gagal tambah voucher:", err);
        return res.status(500).json({ message: "Gagal tambah voucher" });
      }
      res.json({ message: "Voucher ditambahkan" });
    }
  );
});

// PUT update voucher
app.put("/vouchers/:id", (req, res) => {
  const { code_voucher, name_voucher, discount_percent, quota } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE vouchers
    SET code_voucher = ?, name_voucher = ?, discount_percent = ?, quota = ?
    WHERE voucher_id = ?
  `;

  db.query(
    sql,
    [code_voucher, name_voucher, discount_percent, quota, id],
    (err) => {
      if (err) {
        console.error("Gagal update voucher:", err);
        return res.status(500).json({ message: "Gagal update voucher" });
      }
      res.json({ message: "Voucher diperbarui" });
    }
  );
});

// DELETE hapus voucher
app.delete("/vouchers/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM vouchers WHERE voucher_id = ?", [id], (err) => {
    if (err) {
      console.error("Gagal hapus voucher:", err);
      return res.status(500).json({ message: "Gagal hapus voucher" });
    }
    res.json({ message: "Voucher dihapus" });
  });
});

// Jalankan server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
