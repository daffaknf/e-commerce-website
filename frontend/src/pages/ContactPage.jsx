import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function ContactPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Gagal ambil data users:", err));
  }, []);

  return (
    <div className="min-h-screen bg-yellow-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-yellow-800 mb-6 text-center">
          Kontak Kami
        </h1>

        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          {/* Informasi Kontak */}
          <div>
            <h2 className="text-xl font-semibold text-yellow-700 mb-2">
              📍 Alamat Toko
            </h2>
            <p className="text-gray-700">
              Jl. Mawar No. 123, Kel. Mekarsari, Kec. Sukaraja, Kota Bandung,
              Jawa Barat 40234
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-yellow-700 mb-2">
              📞 Nomor Telepon
            </h2>
            <p className="text-gray-700">(+62) 812-3456-7890</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-yellow-700 mb-2">
              📧 Email
            </h2>
            <p className="text-gray-700">tokoroti@example.com</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-yellow-700 mb-2">
              🕒 Jam Operasional
            </h2>
            <p className="text-gray-700">Senin - Sabtu: 08.00 - 18.00</p>
            <p className="text-gray-700">Minggu: Tutup</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-yellow-700 mb-2">
              📱 Media Sosial
            </h2>
            <ul className="text-gray-700 space-y-1">
              <li>Instagram: @tokoroti.id</li>
              <li>Facebook: Toko Roti Bandung</li>
              <li>WhatsApp: (+62) 812-3456-7890</li>
            </ul>
          </div>

          {/* Data dari database */}
          <div>
            <h2 className="text-xl font-semibold text-yellow-700 mt-6 mb-2">
              👥 Pengguna Terdaftar
            </h2>
            {users.length === 0 ? (
              <p className="text-gray-500 italic">Belum ada data pengguna.</p>
            ) : (
              <ul className="text-gray-700 list-disc pl-6 space-y-1">
                {users.map((user) => (
                  <li key={user.user_id}>
                    {user.name} ({user.email})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
