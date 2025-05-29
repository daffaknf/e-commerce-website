import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-white shadow-md relative">
      {/* Logo kiri */}
      <div className="text-xl font-bold text-yellow-900">
        {location.pathname === "/" ? "Toko Roti" : "Halo Daffa 👋"}
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
            review
          </a>
        </li>
        <li>
          <a href="/contact" className="hover:text-yellow-600 transition">
            Kontak
          </a>
        </li>
      </ul>

      {/* Search kanan (desktop only) */}
      <div className="hidden md:block">
        <input
          type="text"
          placeholder="Cari roti..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Hamburger menu (mobile only) */}
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
                Contact
              </a>
            </li>
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
