import React, { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Trash2, Edit, Save, XCircle, Package } from "lucide-react";

const ProdukDetail = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    stock: "",
    price: "",
    category_id: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Ambil data produk & kategori
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Gagal ambil produk:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3001/categorys");
      setCategories(res.data);
    } catch (err) {
      console.error("Gagal ambil kategori:", err);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:3001/products/${editingId}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3001/products", formData);
      }

      setFormData({ name: "", stock: "", price: "", category_id: "" });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error("Gagal simpan produk:", err);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.product_id);
    setFormData({
      name: product.name,
      stock: product.stock,
      price: product.price,
      category_id: product.category_id,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      try {
        await axios.delete(`http://localhost:3001/products/${id}`);
        fetchProducts();
      } catch (err) {
        console.error("Gagal hapus produk:", err);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: "", stock: "", price: "", category_id: "" });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-yellow-700 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Produk
          </h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          <input
            type="text"
            name="name"
            placeholder="Nama Produk"
            value={formData.name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            name="stock"
            placeholder="Stok"
            value={formData.stock}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            name="price"
            placeholder="Harga"
            value={formData.price}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2"
          />
          <select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Pilih Kategori --</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.name}
              </option>
            ))}
          </select>
          <div className="md:col-span-2 flex justify-end gap-2">
            {editingId ? (
              <>
                <button
                  type="submit"
                  className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-1"
                >
                  <Save size={16} /> Simpan
                </button>
                <button
                  onClick={handleCancel}
                  type="button"
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded flex items-center gap-1"
                >
                  <XCircle size={16} /> Batal
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-1"
              >
                <PlusCircle size={16} /> Tambah
              </button>
            )}
          </div>
        </form>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200">
            <thead className="bg-yellow-200 text-yellow-900">
              <tr>
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Stok</th>
                <th className="p-2 border">Harga</th>
                <th className="p-2 border">Kategori</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => (
                <tr
                  key={prod.product_id}
                  className="border-t border-gray-100 text-center"
                >
                  <td className="px-4 py-2">{prod.name}</td>
                  <td className="px-4 py-2">{prod.stock}</td>
                  <td className="px-4 py-2">
                    Rp {prod.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-2">{prod.category_name}</td>
                  <td className="px-4 py-2 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(prod)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(prod.product_id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    Belum ada produk.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProdukDetail;
