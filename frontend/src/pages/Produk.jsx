import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Produk = () => {
  const scrollRefs = useRef({});
  const [produkByKategori, setProdukByKategori] = useState({});
  const [semuaKategori, setSemuaKategori] = useState([]);
  const [kategoriDipilih, setKategoriDipilih] = useState([]);
  const [jumlahBeli, setJumlahBeli] = useState({});
  const [keranjang, setKeranjang] = useState(() => {
    return JSON.parse(localStorage.getItem("keranjang")) || [];
  });

  useEffect(() => {
    const ambilProduk = async () => {
      try {
        const res = await axios.get("http://localhost:3001/products");
        const data = res.data;

        const grouped = {};
        data.forEach((item) => {
          const kategori = item.category_name;
          if (!grouped[kategori]) grouped[kategori] = [];

          grouped[kategori].push({
            nama: item.name,
            gambar: item.image_product,
            harga: item.price, // number
            id: item.product_id,
          });
        });

        setProdukByKategori(grouped);
        setSemuaKategori(Object.keys(grouped));
      } catch (err) {
        console.error("Gagal ambil produk:", err);
      }
    };

    ambilProduk();
  }, []);

  // Simpan keranjang ke localStorage
  useEffect(() => {
    localStorage.setItem("keranjang", JSON.stringify(keranjang));
  }, [keranjang]);

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

  const beliProduk = (produk) => {
    const jumlah = jumlahBeli[produk.nama] || 1;
    if (jumlah < 1) return;

    setKeranjang((prev) => {
      const sudahAda = prev.find((item) => item.nama === produk.nama);
      if (sudahAda) {
        return prev.map((item) =>
          item.nama === produk.nama
            ? { ...item, jumlah: item.jumlah + jumlah }
            : item
        );
      } else {
        return [...prev, { ...produk, jumlah }];
      }
    });

    // Reset jumlah beli
    setJumlahBeli((prev) => ({
      ...prev,
      [produk.nama]: 0,
    }));
  };

  const hapusDariKeranjang = (nama) => {
    setKeranjang((prev) => prev.filter((item) => item.nama !== nama));
    setJumlahBeli((prev) => {
      const baru = { ...prev };
      delete baru[nama];
      return baru;
    });
  };

  const toggleKategori = (kategori) => {
    setKategoriDipilih((prev) =>
      prev.includes(kategori)
        ? prev.filter((k) => k !== kategori)
        : [...prev, kategori]
    );
  };

  const kategoriUntukTampil =
    kategoriDipilih.length === 0 ? semuaKategori : kategoriDipilih;

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-yellow-50 p-4 md:p-8">
        {/* Filter Kategori */}
        <div className="mb-6">
          <label className="font-semibold text-yellow-800 block mb-2">
            Filter Kategori (multi pilih):
          </label>
          <div className="flex flex-wrap gap-2">
            {semuaKategori.map((kategori) => (
              <button
                key={kategori}
                onClick={() => toggleKategori(kategori)}
                className={`px-3 py-1 rounded-full text-sm shadow-md ${
                  kategoriDipilih.includes(kategori)
                    ? "bg-yellow-600 text-white"
                    : "bg-white text-yellow-800 border border-yellow-600"
                }`}
              >
                {kategori}
              </button>
            ))}
            <button
              onClick={() => setKategoriDipilih([])}
              className="px-3 py-1 rounded-full text-sm bg-gray-300 hover:bg-gray-400 text-gray-700"
            >
              Reset Filter
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Daftar Produk */}
          <div className="w-full md:w-4/5 space-y-6">
            {kategoriUntukTampil.map((kategori) =>
              produkByKategori[kategori] ? (
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

                  {/* Produk List */}
                  <div
                    ref={(el) => (scrollRefs.current[kategori] = el)}
                    className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
                  >
                    {produkByKategori[kategori].map((item, index) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-[180px] bg-white rounded-xl shadow-md p-3 transition-transform duration-300 hover:scale-105"
                      >
                        <img
                          src={`http://localhost:3001/uploads/${item.gambar}`}
                          alt={item.nama}
                          className="w-full h-[120px] object-cover rounded-md mb-2"
                        />
                        <h3 className="font-semibold text-yellow-800 text-sm">
                          {item.nama}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          Rp{item.harga.toLocaleString("id-ID")}
                        </p>
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
                        <button
                          onClick={() => beliProduk(item)}
                          className="bg-yellow-600 text-white px-3 py-1 rounded-md hover:bg-yellow-700 w-full text-sm mt-2"
                        >
                          Beli
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </div>

          {/* Keranjang */}
          <div className="w-full lg:w-1/5 h-fit bg-white rounded-xl shadow-md p-4 sticky top-20 order-last">
            <h3 className="text-lg font-bold text-yellow-800 mb-4">
              Keranjang
            </h3>
            {keranjang.length === 0 ? (
              <p className="text-gray-500">Belum ada item 😋</p>
            ) : (
              <>
                <ul className="space-y-2 text-sm">
                  {keranjang.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center">
                      <span>
                        {item.nama} x {item.jumlah}
                      </span>
                      <button
                        onClick={() => hapusDariKeranjang(item.nama)}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Hapus
                      </button>
                    </li>
                  ))}
                </ul>

                {/* Tombol Checkout */}
                <button
                  onClick={() => (window.location.href = "/checkout")}
                  className="mt-4 w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 text-sm"
                >
                  Checkout Sekarang
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Produk;
