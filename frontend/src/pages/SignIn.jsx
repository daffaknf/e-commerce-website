import React from "react";

const SignIn = () => {
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
        {/* Kiri: Logo Besar */}
        <div className="flex items-center justify-center">
          <img src="/logo1.png" alt="Logo Besar" className="max-w-[300px]" />
        </div>

        {/* Kanan: Form Sign Up */}
        <div className="flex items-center justify-center p-6">
          <form className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-yellow-800 text-center">
              Login Akun
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
            <div>
              <input
                type="tel"
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
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
            <button className="btn btn-soft btn-warning">Warning</button>
            <button
              type="submit"
              className="w-full bg-yellow-600 text-white font-semibold py-2 rounded-lg hover:bg-yellow-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
