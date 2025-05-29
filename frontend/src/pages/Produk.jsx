import { useRef, useState } from "react";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const produkByKategori = {
  Roti: [
    { nama: "Roti Coklat", gambar: "/roti1.jpg", harga: "Rp12.000" },
    { nama: "Roti Keju", gambar: "/roti2.jpeg", harga: "Rp13.000" },
    { nama: "Roti Pisang", gambar: "/roti3.jpeg", harga: "Rp14.000" },
    { nama: "Chicken Burger", gambar: "/burger1.png", harga: "Rp20.000" },
    { nama: "Cheese Burger", gambar: "/burger2.jpeg", harga: "Rp22.000" },
    { nama: "Spicy Burger", gambar: "/burger3.jpg", harga: "Rp21.000" },
  ],
  Burger: [
    { nama: "Chicken Burger", gambar: "/burger1.png", harga: "Rp20.000" },
    { nama: "Cheese Burger", gambar: "/burger2.jpeg", harga: "Rp22.000" },
    { nama: "Spicy Burger", gambar: "/burger3.jpg", harga: "Rp21.000" },
    { nama: "Classic Hotdog", gambar: "/hotfdog1.jpeg", harga: "Rp17.000" },
    { nama: "Cheese Dog", gambar: "/hotdog2.jpeg", harga: "Rp18.000" },
    { nama: "Spicy Dog", gambar: "/hotdog3.jpeg", harga: "Rp19.000" },
  ],
  Hotdog: [
    { nama: "Classic Hotdog", gambar: "/hotfdog1.jpeg", harga: "Rp17.000" },
    { nama: "Cheese Dog", gambar: "/hotdog2.jpeg", harga: "Rp18.000" },
    { nama: "Spicy Dog", gambar: "/hotdog3.jpeg", harga: "Rp19.000" },
    { nama: "Chicken Burger", gambar: "/burger1.png", harga: "Rp20.000" },
    { nama: "Cheese Burger", gambar: "/burger2.jpeg", harga: "Rp22.000" },
    { nama: "Spicy Burger", gambar: "/burger3.jpg", harga: "Rp21.000" },
  ],
};

const Produk = () => {
  const scrollRefs = useRef({});
  const [jumlahBeli, setJumlahBeli] = useState({});

  const scroll = (kategori, direction) => {
    const container = scrollRefs.current[kategori];
    if (container) {
      const cardWidth = 190;
      const scrollAmount =
        direction === "left" ? -cardWidth * 2 : cardWidth * 2;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const tambah = (nama) => {
    setJumlahBeli((prev) => ({
      ...prev,
      [nama]: (prev[nama] || 0) + 1,
    }));
  };

  const kurang = (nama) => {
    setJumlahBeli((prev) => ({
      ...prev,
      [nama]: Math.max((prev[nama] || 0) - 1, 0),
    }));
  };

  return (
    <>
      <Navbar />
      <section className="h-screen overflow-y-auto bg-yellow-50 p-4 md:p-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* KONTEN PRODUK */}
          <div className="w-full md:w-4/5 space-y-6">
            {Object.entries(produkByKategori).map(([kategori, produkList]) => (
              <div key={kategori} className="relative">
                <h2 className="text-xl font-bold text-yellow-800 mb-3">
                  {kategori}
                </h2>

                {/* Tombol Panah */}
                <button
                  onClick={() => scroll(kategori, "left")}
                  className="absolute top-16 left-0 z-10 p-2 bg-yellow-400 hover:bg-yellow-500 rounded-full shadow-lg hidden md:block"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={() => scroll(kategori, "right")}
                  className="absolute top-16 right-0 z-10 p-2 bg-yellow-400 hover:bg-yellow-500 rounded-full shadow-lg hidden md:block"
                >
                  <ChevronRight />
                </button>

                {/* LIST PRODUK */}
                <div
                  ref={(el) => (scrollRefs.current[kategori] = el)}
                  className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
                >
                  {produkList.map((item, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[180px] bg-white rounded-xl shadow-md p-3 transition-transform duration-300 hover:scale-105"
                    >
                      <img
                        src={item.gambar}
                        alt={item.nama}
                        className="w-full h-[120px] object-cover rounded-md mb-2"
                      />
                      <h3 className="font-semibold text-yellow-800 text-sm">
                        {item.nama}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{item.harga}</p>
                      {/* Tombol + / - */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => kurang(item.nama)}
                          className="bg-yellow-300 px-2 py-1 rounded-l hover:bg-yellow-400 text-sm"
                        >
                          -
                        </button>
                        <span className="px-2 text-sm">
                          {jumlahBeli[item.nama] || 0}
                        </span>
                        <button
                          onClick={() => tambah(item.nama)}
                          className="bg-yellow-600 text-white px-2 py-1 rounded-r hover:bg-yellow-700 text-sm"
                        >
                          +
                        </button>
                      </div>
                      {/* Tombol Beli */}
                      <button className="bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700 w-full text-sm mt-2">
                        Beli
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* KERANJANG */}
          <div className="w-full lg:w-1/5 h-fit bg-white rounded-xl shadow-md p-4 sticky top-20 order-last">
            <h3 className="text-lg font-bold text-yellow-800 mb-4">
              Keranjang
            </h3>
            <p className="text-gray-500">Belum ada item 😋</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Produk;
