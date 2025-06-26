import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  List,
  Package,
  Percent,
  ShoppingCart,
  LogOut,
  UserCircle,
} from "lucide-react";

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // Hapus data user
    navigate("/"); // Arahkan ke halaman utama
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-yellow-600 text-white flex flex-col justify-between">
        <div>
          <div className="p-6 font-bold text-xl flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6" />
            Admin Panel
          </div>
          <nav className="flex flex-col gap-2 px-4">
            <Link
              to="/admin/dashboard"
              className={`flex items-center gap-3 px-3 py-2 rounded ${
                location.pathname.includes("/admin/dashboard")
                  ? "bg-yellow-700"
                  : "hover:bg-yellow-700"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>

            <Link
              to="/admin/kategoriproduk"
              className={`flex items-center gap-3 px-3 py-2 rounded ${
                location.pathname.includes("/admin/kategoriproduk")
                  ? "bg-yellow-700"
                  : "hover:bg-yellow-700"
              }`}
            >
              <List className="w-5 h-5" />
              Kategori Produk
            </Link>
            <Link
              to="/admin/produkdetail"
              className={`flex items-center gap-3 px-3 py-2 rounded ${
                location.pathname.includes("/admin/produkdetail")
                  ? "bg-yellow-700"
                  : "hover:bg-yellow-700"
              }`}
            >
              <Package className="w-5 h-5" />
              Produk
            </Link>
            <Link
              to="/admin/voucher"
              className={`flex items-center gap-3 px-3 py-2 rounded ${
                location.pathname.includes("/admin/voucher")
                  ? "bg-yellow-700"
                  : "hover:bg-yellow-700"
              }`}
            >
              <Percent className="w-5 h-5" />
              Voucher
            </Link>
            <Link
              to="/admin/pesanan"
              className={`flex items-center gap-3 px-3 py-2 rounded ${
                location.pathname.includes("/admin/pesanan")
                  ? "bg-yellow-700"
                  : "hover:bg-yellow-700"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              Pesanan Order
            </Link>
          </nav>
        </div>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-yellow-700 rounded hover:bg-yellow-800 w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Konten */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-700 capitalize">
            {location.pathname.split("/")[2] || "Dashboard"}
          </h1>
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-white">
            <UserCircle className="w-6 h-6" />
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
