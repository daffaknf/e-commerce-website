import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "customer", // default: customer
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message);
        // Optional: redirect atau reset form
      } else {
        alert(data.message || "Gagal mendaftar.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Terjadi kesalahan saat mendaftar.");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100">
      {/* Navbar */}
      <nav className="flex items-center px-6 py-4 bg-white">
        <div className="flex items-center gap-3">
          <img src="/logo1.png" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-semibold text-yellow-900">Sign Up</span>
        </div>
      </nav>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-72px)]">
        {/* Kiri: Logo Besar */}
        <div className="flex items-center justify-center">
          <img src="/logo1.png" alt="Logo Besar" className="max-w-[300px]" />
        </div>

        {/* Kanan: Form Sign Up */}
        <div className="flex items-center justify-center p-6">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6"
          >
            <h2 className="text-2xl font-bold text-yellow-800 text-center">
              Buat Akun Baru
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daftar Sebagai
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex justify-center">
              <Link to="/">
                <button
                  type="button"
                  className="btn btn-soft btn-warning m-4 px-6"
                >
                  Back
                </button>
              </Link>
              <button
                type="submit"
                className="btn btn-soft btn-warning m-4 px-4"
              >
                Daftar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
