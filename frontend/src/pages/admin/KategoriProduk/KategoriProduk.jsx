import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Pencil, Save, XCircle, Tags } from "lucide-react";

const KategoriProduk = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:3001/categorys");
      setCategories(res.data);
    } catch (err) {
      console.error("Gagal ambil data kategori:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`http://localhost:3001/categorys/${editing}`, { name });
      } else {
        await axios.post("http://localhost:3001/categorys", { name });
      }
      setName("");
      setEditing(null);
      fetchCategories();
    } catch (err) {
      console.error("Gagal simpan:", err);
    }
  };

  const handleEdit = (id, currentName) => {
    setEditing(id);
    setName(currentName);
  };

  const handleCancel = () => {
    setEditing(null);
    setName("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus kategori ini?")) {
      try {
        await axios.delete(`http://localhost:3001/categorys/${id}`);
        fetchCategories();
      } catch (err) {
        console.error("Gagal hapus:", err);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-yellow-700 mb-4 flex items-center gap-2">
        <Tags size={24} /> Manajemen Kategori Produk
      </h2>

      {/* Form Tambah/Edit */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama Kategori"
          className="px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-yellow-400"
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className={`flex items-center gap-2 px-4 py-2 rounded text-white ${
              editing
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {editing ? <Save size={18} /> : <Plus size={18} />}
            {editing ? "Simpan" : "Tambah"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center gap-1 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              <XCircle size={18} /> Batal
            </button>
          )}
        </div>
      </form>

      {/* Tabel Data */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200">
          <thead className="bg-yellow-100 text-yellow-900">
            <tr>
              <th className="px-4 py-2 text-left">ID</th>
              <th className="px-4 py-2 text-left">Nama Kategori</th>
              <th className="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.category_id} className="border-t border-gray-100">
                  <td className="px-4 py-2">{cat.category_id}</td>
                  <td className="px-4 py-2">{cat.name}</td>
                  <td className="px-4 py-2 flex gap-3">
                    <button
                      onClick={() => handleEdit(cat.category_id, cat.name)}
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(cat.category_id)}
                      className="flex items-center gap-1 text-red-600 hover:underline"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KategoriProduk;
