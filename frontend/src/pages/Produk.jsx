import { useRef } from "react";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const produkByKategori = {
  Roti: [
    { nama: "Roti Coklat", gambar: "/roti1.jpg", harga: "Rp12.000" },
    { nama: "Roti Keju", gambar: "/roti2.jpeg", harga: "Rp13.000" },
    { nama: "Roti Pisang", gambar: "/roti3.jpeg", harga: "Rp14.000" },
    { nama: "Cheese Burger", gambar: "/burger2.jpeg", harga: "Rp22.000" },
    { nama: "Spicy Burger", gambar: "/burger3.jpg", harga: "Rp21.000" },
    { nama: "Spicy Burger", gambar: "/burger4.jpeg", harga: "Rp22.000" },
  ],
  Burger: [
    { nama: "Chicken Burger", gambar: "/burger1.png", harga: "Rp20.000" },
    { nama: "Cheese Burger", gambar: "/burger2.jpeg", harga: "Rp22.000" },
    { nama: "Spicy Burger", gambar: "/burger3.jpg", harga: "Rp21.000" },
    { nama: "Spicy Burger", gambar: "/burger4.jpeg", harga: "Rp22.000" },
    { nama: "Classic Hotdog", gambar: "/hotfdog1.jpeg", harga: "Rp17.000" },
    { nama: "Cheese Dog", gambar: "/hotdog2.jpeg", harga: "Rp18.000" },
    { nama: "Spicy Dog", gambar: "/hotdog3.jpeg", harga: "Rp19.000" },
  ],
  Hotdog: [
    { nama: "Classic Hotdog", gambar: "/hotfdog1.jpeg", harga: "Rp17.000" },
    { nama: "Cheese Dog", gambar: "/hotdog2.jpeg", harga: "Rp18.000" },
    { nama: "Spicy Dog", gambar: "/hotdog3.jpeg", harga: "Rp19.000" },
    { nama: "Spicy Dog", gambar: "/hotdog4.jpeg", harga: "Rp20.000" },
    { nama: "Cheese Burger", gambar: "/burger2.jpeg", harga: "Rp22.000" },
    { nama: "Spicy Burger", gambar: "/burger3.jpg", harga: "Rp21.000" },
    { nama: "Spicy Burger", gambar: "/burger4.jpeg", harga: "Rp22.000" },
  ],
};

const Produk = () => {
  const scrollRefs = useRef({});

  const scroll = (kategori, direction) => {
    const container = scrollRefs.current[kategori];
    if (container) {
      const cardWidth = 270; // Lebar produk termasuk padding dan margin
      const scrollAmount =
        direction === "left" ? -cardWidth * 2 : cardWidth * 2;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-yellow-50 p-4 md:p-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* KONTEN PRODUK */}
          <div className="w-full md:w-4/5 space-y-16">
            {Object.entries(produkByKategori).map(([kategori, produkList]) => (
              <div key={kategori} className="relative">
                <h2 className="text-2xl font-bold text-yellow-800 mb-4">
                  {kategori}
                </h2>

                {/* Tombol Panah */}
                <button
                  onClick={() => scroll(kategori, "left")}
                  className="absolute top-20 left-0 z-10 p-2 bg-yellow-400 hover:bg-yellow-500 rounded-full shadow-lg hidden md:block"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={() => scroll(kategori, "right")}
                  className="absolute top-20 right-0 z-10 p-2 bg-yellow-400 hover:bg-yellow-500 rounded-full shadow-lg hidden md:block"
                >
                  <ChevronRight />
                </button>

                {/* LIST PRODUK */}
                <div
                  ref={(el) => (scrollRefs.current[kategori] = el)}
                  className="flex gap-6 overflow-hidden scroll-smooth"
                >
                  {produkList.map((item, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[230px] bg-white rounded-xl shadow-md p-4 transition-transform duration-300 hover:scale-105"
                    >
                      <img
                        src={item.gambar}
                        alt={item.nama}
                        className="w-full h-[180px] object-cover rounded-md mb-3"
                      />
                      <h3 className="font-semibold text-yellow-800 text-lg">
                        {item.nama}
                      </h3>
                      <p className="text-gray-600 mb-2">{item.harga}</p>
                      <button className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 w-full">
                        Beli
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* KERANJANG */}
          <div className="w-full md:w-1/5 h-fit bg-white rounded-xl shadow-md p-4 sticky top-20 hidden md:block">
            <h3 className="text-lg font-bold text-yellow-800 mb-4">
              Keranjang
            </h3>
            <p className="text-gray-500">Belum ada item 😋</p>
            {/* Nanti bisa tambahin total harga & list belanja di sini */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Produk;
