import rotiImage from "../assets/roti.jpg";

const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 py-15 bg-yellow-50 min-h-screen">
      <div className="md:w-1/2 space-y-6">
        <h2 className="text-4xl md:text-5xl font-bold text-yellow-900">
          Nikmati Roti Hangat Setiap Hari
        </h2>
        <p className="text-lg text-gray-700">
          Kami menyajikan roti segar, lezat, dan dibuat dengan cinta. Cocok
          untuk sarapan atau teman kopi soremu.
        </p>
        <div className="flex justify-start md:justify-center">
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-6 py-3 rounded-lg transition duration-300">
            Beli Sekarang
          </button>
        </div>
      </div>
      <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
        <img
          src={rotiImage}
          alt="Roti Lezat"
          className="max-w-sm w-full rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
};

export default HeroSection;
