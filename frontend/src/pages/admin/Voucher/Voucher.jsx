import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Percent,
  Trash2,
  Pencil,
  PlusCircle,
  Save,
  XCircle,
} from "lucide-react";

const Voucher = () => {
  const [vouchers, setVouchers] = useState([]);
  const [formData, setFormData] = useState({
    code_voucher: "",
    name_voucher: "",
    discount_percent: "",
    quota: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const res = await axios.get("http://localhost:3001/vouchers");
      setVouchers(res.data);
    } catch (err) {
      console.error("Gagal ambil data voucher:", err);
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
          `http://localhost:3001/vouchers/${editingId}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3001/vouchers", formData);
      }

      setFormData({
        code_voucher: "",
        name_voucher: "",
        discount_percent: "",
        quota: "",
      });
      setEditingId(null);
      fetchVouchers();
    } catch (err) {
      console.error("Gagal simpan:", err);
    }
  };

  const handleEdit = (voucher) => {
    setEditingId(voucher.voucher_id);
    setFormData({
      code_voucher: voucher.code_voucher,
      name_voucher: voucher.name_voucher,
      discount_percent: voucher.discount_percent,
      quota: voucher.quota,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus voucher ini?")) {
      try {
        await axios.delete(`http://localhost:3001/vouchers/${id}`);
        fetchVouchers();
      } catch (err) {
        console.error("Gagal hapus voucher:", err);
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({
      code_voucher: "",
      name_voucher: "",
      discount_percent: "",
      quota: "",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-yellow-700 mb-4 flex items-center gap-2">
          <Percent /> Manajemen Voucher
        </h2>

        {/* Form Tambah/Edit */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
        >
          <input
            type="text"
            name="code_voucher"
            placeholder="Kode Voucher"
            value={formData.code_voucher}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="name_voucher"
            placeholder="Nama Voucher"
            value={formData.name_voucher}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="discount_percent"
            placeholder="Diskon (%)"
            value={formData.discount_percent}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
          <input
            type="number"
            name="quota"
            placeholder="Kuota"
            value={formData.quota}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded"
          />
          <div className="md:col-span-2 flex gap-2 justify-end">
            {editingId ? (
              <>
                <button
                  type="submit"
                  className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2"
                >
                  <Save size={18} />
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center gap-2"
                >
                  <XCircle size={18} />
                  Batal
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="bg-yellow-600 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <PlusCircle size={18} />
                Tambah
              </button>
            )}
          </div>
        </form>

        {/* Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-gray-200">
            <thead className="bg-yellow-100 text-yellow-900">
              <tr>
                <th className="p-2 border">Kode</th>
                <th className="p-2 border">Nama</th>
                <th className="p-2 border">Diskon</th>
                <th className="p-2 border">Kuota</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    Tidak ada voucher.
                  </td>
                </tr>
              ) : (
                vouchers.map((voucher) => (
                  <tr
                    key={voucher.voucher_id}
                    className="border-t border-gray-100 text-center"
                  >
                    <td className="px-4 py-2">{voucher.code_voucher}</td>
                    <td className="px-4 py-2">{voucher.name_voucher}</td>
                    <td className="px-4 py-2">{voucher.discount_percent}%</td>
                    <td className="px-4 py-2">{voucher.quota}</td>
                    <td className="px-4 py-2 flex gap-2 justify-center">
                      <button
                        onClick={() => handleEdit(voucher)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(voucher.voucher_id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Voucher;
