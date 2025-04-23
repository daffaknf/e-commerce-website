const produkByKategori = {
  Roti: [
    { nama: "Roti Coklat", gambar: "/roti1.jpg", harga: "Rp12.000" },
    { nama: "Roti Keju", gambar: "/roti2.jpeg", harga: "Rp13.000" },
    { nama: "Roti Pisang", gambar: "/roti3.jpeg", harga: "Rp14.000" },
  ],
  Burger: [
    { nama: "Chicken Burger", gambar: "/burger1.png", harga: "Rp20.000" },
    { nama: "Cheese Burger", gambar: "/burger2.jpeg", harga: "Rp22.000" },
    { nama: "Spicy Burger", gambar: "/burger3.jpg", harga: "Rp21.000" },
    { nama: "Spicy Burger", gambar: "/burger4.jpeg", harga: "Rp22.000" },
  ],
  Hotdog: [
    { nama: "Classic Hotdog", gambar: "/hotfdog1.jpeg", harga: "Rp17.000" },
    { nama: "Cheese Dog", gambar: "/hotdog2.jpeg", harga: "Rp18.000" },
    { nama: "Spicy Dog", gambar: "/hotdog3.jpeg", harga: "Rp19.000" },
    { nama: "Spicy Dog", gambar: "/hotdog4.jpeg", harga: "Rp20.000" },
  ],
};

const Produk = () => {
  return (
    <section className="min-h-screen bg-yellow-50 px-6 py-12 space-y-12">
      {Object.entries(produkByKategori).map(([kategori, produkList]) => (
        <div key={kategori}>
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">
            {kategori}
          </h2>
          <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
            {produkList.map((item, index) => (
              <div
                key={index}
                className="min-w-[200px] bg-white rounded-xl shadow-md p-4 flex-shrink-0"
              >
                <img
                  src={item.gambar}
                  alt={item.nama}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="font-semibold text-yellow-800 text-lg">
                  {item.nama}
                </h3>
                <p className="text-gray-600 mb-2">{item.harga}</p>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700">
                  Beli
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Produk;
