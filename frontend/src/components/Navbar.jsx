import { useState, useEffect } from "react";
import { Menu, X, UserCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  const backToAdmin = () => {
    navigate("/admin");
  };

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-white shadow-md relative">
      {/* Logo kiri */}
      <div className="text-xl font-bold text-yellow-900">
        {location.pathname === "/"
          ? "Toko Roti"
          : user
          ? `Halo ${user.name} 👋`
          : "Halo 👋"}
      </div>

      {/* Center navigation (desktop only) */}
      <ul className="hidden md:flex gap-8 absolute left-1/2 transform -translate-x-1/2 text-gray-700 font-medium">
        <li>
          <a href="/" className="hover:text-yellow-600 transition">
            Home
          </a>
        </li>
        <li>
          <a href="/produk" className="hover:text-yellow-600 transition">
            Produk
          </a>
        </li>
        <li>
          <a href="/review" className="hover:text-yellow-600 transition">
            Review
          </a>
        </li>
        <li>
          <a href="/contact" className="hover:text-yellow-600 transition">
            Kontak
          </a>
        </li>
      </ul>

      {/* Kanan (desktop only) */}
      <div className="hidden md:flex items-center gap-4 relative">
        {!user ? (
          <>
            <a
              href="/signin"
              className="px-4 py-2 text-sm font-medium text-yellow-900 border border-yellow-900 rounded-lg hover:bg-yellow-100 transition"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 rounded-lg hover:bg-yellow-700 transition"
            >
              Sign Up
            </a>
          </>
        ) : (
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
                {user.role === "admin" && (
                  <button
                    onClick={backToAdmin}
                    className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                  >
                    Go to Admin Page
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
        <input
          type="text"
          placeholder="Cari roti..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Hamburger (mobile) */}
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md px-6 py-4 md:hidden z-50">
          <ul className="flex flex-col gap-4 text-gray-700 font-medium">
            <li>
              <a href="/" className="hover:text-yellow-600 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/produk" className="hover:text-yellow-600 transition">
                Produk
              </a>
            </li>
            <li>
              <a href="/review" className="hover:text-yellow-600 transition">
                Review
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-yellow-600 transition">
                Kontak
              </a>
            </li>
            {!user ? (
              <>
                <li>
                  <a
                    href="/signin"
                    className="hover:text-yellow-600 transition"
                  >
                    Sign In
                  </a>
                </li>
                <li>
                  <a
                    href="/signup"
                    className="hover:text-yellow-600 transition"
                  >
                    Sign Up
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="border-t pt-2">{user.name}</li>
                {user.role === "admin" && (
                  <li>
                    <button
                      onClick={backToAdmin}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Go to Admin Page
                    </button>
                  </li>
                )}
                <li>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
            <li>
              <input
                type="text"
                placeholder="Cari roti..."
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
