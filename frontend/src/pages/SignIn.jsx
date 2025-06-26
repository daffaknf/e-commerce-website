import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/signin", {
        email,
        password,
      });

      const { role } = res.data;

      // Simpan user info jika perlu
      localStorage.setItem("user", JSON.stringify(res.data));

      // Arahkan ke halaman sesuai role
      if (role === "customer") {
        navigate("/");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        setErrorMsg("Role tidak dikenali.");
      }
    } catch (error) {
      setErrorMsg("Email atau password salah!");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-100">
      {/* Navbar */}
      <nav className="flex items-center px-6 py-4 bg-white">
        <div className="flex items-center gap-3">
          <img src="/logo1.png" alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-semibold text-yellow-900">Sign In</span>
        </div>
      </nav>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-72px)]">
        {/* Kiri: Logo */}
        <div className="flex items-center justify-center">
          <img src="/logo1.png" alt="Logo Besar" className="max-w-[300px]" />
        </div>

        {/* Kanan: Form */}
        <div className="flex items-center justify-center p-6">
          <form
            className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6"
            onSubmit={handleLogin}
          >
            <h2 className="text-2xl font-bold text-yellow-800 text-center">
              Login Akun
            </h2>

            {errorMsg && (
              <div className="text-red-500 text-sm text-center">{errorMsg}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
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
                Masuk
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
