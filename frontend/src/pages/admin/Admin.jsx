import React from "react";
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  List,
  Package,
  Percent,
  ShoppingCart,
  LogOut,
  UserCircle2,
} from "lucide-react";

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user"); // Hapus data user
    navigate("/"); // Arahkan ke halaman utama
  };
  const backToHome = () => {
    navigate("/"); // Arahkan ke halaman utama
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
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
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="transition-transform transform hover:scale-110 duration-300"
            >
              <UserCircle2 size={32} className="text-yellow-900" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md py-2 z-10">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  {user.name}
                </div>
                <button
                  onClick={backToHome}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Back To Home
                </button>
              </div>
            )}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
