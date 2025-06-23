import React from "react";
import { Link } from "react-router-dom";
const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-yellow-600 mb-6">
          Admin Dashboard
        </h1>
        <div className="space-y-4">
          <Link
            to="/kategoriproduk"
            className="block w-full py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Kelola Kategori Produk
          </Link>
          <Link
            to="/produkdetail"
            className="block w-full py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Kelola Produk
          </Link>
          <Link
            to="/voucher"
            className="block w-full py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Kelola Voucher
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Admin;
