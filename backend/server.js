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
// ✅ SIGNUP (REGISTER)
app.post("/signup", async (req, res) => {
  const { name, username, email, password, role } = req.body;

  // Validasi input
  if (!name || !username || !email || !password || !role) {
    return res.status(400).json({ message: "Semua field wajib diisi." });
  }

  if (role !== "customer" && role !== "admin") {
    return res.status(400).json({ message: "Role tidak valid." });
  }

  try {
    const user_id = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `INSERT INTO users (user_id, name, username, email, password, role)
                 VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [user_id, name, username, email, hashedPassword, role];

    await db.query(sql, values);

    res.status(201).json({ message: "Pendaftaran berhasil!" });
  } catch (err) {
    console.error("Error insert user:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: "Username atau email sudah terdaftar." });
    }
    res.status(500).json({ message: "Gagal mendaftar." });
  }
});

// ✅ LOGIN
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email dan password wajib diisi" });

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Email tidak ditemukan" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: "Password salah" });

    const { user_id, name, email: userEmail, role } = user;
    res.json({ user_id, name, email: userEmail, role });
  } catch (err) {
    console.error("Error saat login:", err);
    res.status(500).json({ message: "Terjadi kesalahan saat login" });
  }
});

// GET semua kategori
app.get("/categorys", async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM categorys");
    res.json(result);
  } catch (err) {
    console.error("❌ Gagal ambil data kategori:", err);
    res.status(500).json({ message: "Error ambil data" });
  }
});

// POST tambah kategori
app.post("/categorys", async (req, res) => {
  const { name } = req.body;
  const category_id = uuidv4();

  if (!name) {
    return res
      .status(400)
      .json({ message: "Nama kategori tidak boleh kosong" });
  }

  try {
    await db.query("INSERT INTO categorys (category_id, name) VALUES (?, ?)", [
      category_id,
      name,
    ]);
    res.json({ message: "Kategori berhasil ditambahkan" });
  } catch (err) {
    console.error("❌ Gagal tambah kategori:", err);
    res.status(500).json({ message: "Gagal tambah kategori" });
  }
});

// PUT update kategori
app.put("/categorys/:id", async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  try {
    await db.query("UPDATE categorys SET name = ? WHERE category_id = ?", [
      name,
      id,
    ]);
    res.json({ message: "Kategori diupdate" });
  } catch (err) {
    console.error("❌ Gagal update kategori:", err);
    res.status(500).json({ message: "Error update kategori" });
  }
});

// DELETE hapus kategori
app.delete("/categorys/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM categorys WHERE category_id = ?", [id]);
    res.json({ message: "Kategori dihapus" });
  } catch (err) {
    console.error("❌ Gagal hapus kategori:", err);
    res.status(500).json({ message: "Error hapus kategori" });
  }
});

// GET semua produk
// GET semua produk + nama kategori
app.get("/products", async (req, res) => {
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

  try {
    const [result] = await db.query(sql); // pakai await dan destructuring [rows]
    res.json(result);
  } catch (err) {
    console.error("Gagal ambil produk:", err);
    res.status(500).json({ message: "Error ambil produk" });
  }
});

// POST tambah produk
// POST tambah produk + upload gambar
// POST tambah produk
app.post("/products", upload.single("image_product"), async (req, res) => {
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

  try {
    await db.query(sql, [
      product_id,
      name,
      stock,
      price,
      category_id,
      image_product,
    ]);
    res.json({ message: "Produk ditambahkan" });
  } catch (err) {
    console.error("Gagal tambah produk:", err);
    res.status(500).json({ message: "Gagal tambah produk" });
  }
});

// PUT update produk
// PUT update produk
app.put("/products/:id", upload.single("image_product"), async (req, res) => {
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

  try {
    await db.query(sql, params);
    res.json({ message: "Produk diupdate" });
  } catch (err) {
    console.error("Gagal update produk:", err);
    res.status(500).json({ message: "Gagal update produk" });
  }
});

// DELETE hapus produk
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM product WHERE product_id = ?", [id]);
    res.json({ message: "Produk dihapus" });
  } catch (err) {
    console.error("Gagal hapus produk:", err);
    res.status(500).json({ message: "Gagal hapus produk" });
  }
});

// GET semua voucher
app.get("/vouchers", async (req, res) => {
  try {
    const [result] = await db.query("SELECT * FROM vouchers");
    res.json(result);
  } catch (err) {
    console.error("Gagal ambil voucher:", err);
    res.status(500).json({ message: "Gagal ambil voucher" });
  }
});

// POST tambah voucher
app.post("/vouchers", async (req, res) => {
  const { code_voucher, name_voucher, discount_percent, quota } = req.body;
  const voucher_id = uuidv4();

  if (!code_voucher || !name_voucher || !discount_percent || !quota) {
    return res.status(400).json({ message: "Semua field harus diisi" });
  }

  const sql = `
    INSERT INTO vouchers (voucher_id, code_voucher, name_voucher, discount_percent, quota)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    await db.query(sql, [
      voucher_id,
      code_voucher,
      name_voucher,
      discount_percent,
      quota,
    ]);
    res.json({ message: "Voucher ditambahkan" });
  } catch (err) {
    console.error("Gagal tambah voucher:", err);
    res.status(500).json({ message: "Gagal tambah voucher" });
  }
});

// PUT update voucher
app.put("/vouchers/:id", async (req, res) => {
  const { code_voucher, name_voucher, discount_percent, quota } = req.body;
  const { id } = req.params;

  const sql = `
    UPDATE vouchers
    SET code_voucher = ?, name_voucher = ?, discount_percent = ?, quota = ?
    WHERE voucher_id = ?
  `;

  try {
    await db.query(sql, [
      code_voucher,
      name_voucher,
      discount_percent,
      quota,
      id,
    ]);
    res.json({ message: "Voucher diperbarui" });
  } catch (err) {
    console.error("Gagal update voucher:", err);
    res.status(500).json({ message: "Gagal update voucher" });
  }
});

// DELETE hapus voucher
app.delete("/vouchers/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM vouchers WHERE voucher_id = ?", [id]);
    res.json({ message: "Voucher dihapus" });
  } catch (err) {
    console.error("Gagal hapus voucher:", err);
    res.status(500).json({ message: "Gagal hapus voucher" });
  }
});

app.post("/orders", async (req, res) => {
  const {
    user_id,
    voucher_id,
    total_amount,
    discount_amount,
    final_amount,
    address,
    payment_method,
    keranjang,
  } = req.body;

  const order_id = uuidv4(); // atau custom generator
  const order_date = new Date();

  try {
    // 1. Simpan ke orders
    await db.query(
      `INSERT INTO orders (order_id, user_id, voucher_id, total_amount, discount_amount, address, payment_method, final_amount, order_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id,
        user_id,
        voucher_id || null,
        total_amount,
        discount_amount,
        address,
        payment_method,
        final_amount,
        order_date,
      ]
    );

    // 2. Simpan order_items
    for (const item of keranjang) {
      const order_item_id = uuidv4();
      await db.query(
        `INSERT INTO order_items (order_item_id, order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?, ?)`,
        [order_item_id, order_id, item.id, item.jumlah, item.harga]
      );

      // 3. Kurangi stok produk
      await db.query(
        `UPDATE product SET stock = stock - ? WHERE product_id = ?`,
        [item.jumlah, item.id]
      );
    }

    res.status(201).json({ message: "Pesanan berhasil dibuat" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal membuat pesanan" });
  }
});

app.get("/orders/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    // Ambil semua order milik user
    const [orders] = await db.query(
      `
      SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC
    `,
      [user_id]
    );

    // Untuk setiap order, ambil itemnya
    for (let order of orders) {
      const [items] = await db.query(
        `
        SELECT 
          oi.product_id, p.name, oi.quantity, oi.price
        FROM order_items oi
        JOIN product p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?
      `,
        [order.order_id]
      );

      // Tambahkan item ke dalam masing-masing order
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error("Gagal ambil riwayat pesanan:", err);
    res.status(500).json({ message: "Gagal ambil riwayat pesanan" });
  }
});

app.get("/admin/orders", async (req, res) => {
  try {
    // Ambil semua order + nama user
    const [orders] = await db.query(
      `
      SELECT 
        o.*, 
        u.name AS user_name 
      FROM orders o 
      JOIN users u ON o.user_id = u.user_id
      ORDER BY o.order_date DESC
    `
    );

    // Tambahkan detail item untuk tiap order
    for (let order of orders) {
      const [items] = await db.query(
        `
        SELECT 
          oi.product_id, p.name, oi.quantity, oi.price
        FROM order_items oi
        JOIN product p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?
      `,
        [order.order_id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (err) {
    console.error("Gagal ambil semua order:", err);
    res.status(500).json({ message: "Gagal ambil data order untuk admin" });
  }
});
app.get("/admin/revenue", async (req, res) => {
  const { start_date, end_date } = req.query;

  try {
    let query = `
      SELECT DATE(order_date) AS order_date, SUM(final_amount)+0 AS total
      FROM orders
    `;
    const params = [];

    if (start_date && end_date) {
      query += ` WHERE DATE(order_date) BETWEEN ? AND ?`;
      params.push(start_date, end_date);
    }

    query += ` GROUP BY DATE(order_date) ORDER BY order_date ASC`;

    const [rows] = await db.query(query, params); // ✅ pakai promise-style
    res.json(rows);
  } catch (err) {
    console.error("Error ambil data grafik:", err);
    res.status(500).json({ message: "Gagal ambil data grafik" });
  }
});

// Jalankan server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
