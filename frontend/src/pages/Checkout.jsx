import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [keranjang, setKeranjang] = useState([]);
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Transfer Bank");
  const [voucher, setVoucher] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("keranjang"));
    setKeranjang(data || []);
  }, []);

  const hitungTotal = () => {
    return keranjang.reduce((acc, item) => acc + item.harga * item.jumlah, 0);
  };

  const discountPercent = voucher ? voucher.discount_percent : 0;
  const total = hitungTotal();
  const discountAmount = (discountPercent / 100) * total;
  const finalAmount = total - discountAmount;

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Harap login terlebih dahulu!");

    const orderData = {
      user_id: user.user_id,
      voucher_id: voucher?.voucher_id || null,
      total_amount: total,
      discount_amount: discountAmount,
      final_amount: finalAmount,
      address,
      payment_method: paymentMethod,
      keranjang,
    };

    try {
      const res = await axios.post("http://localhost:3001/orders", orderData);
      alert("Pesanan berhasil dibuat!");
      localStorage.removeItem("keranjang");
      navigate("/order-history");
    } catch (err) {
      console.error(err);
      alert("Gagal melakukan checkout.");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <h2 className="text-2xl font-bold text-yellow-800 mb-4">Checkout</h2>

      <div className="bg-white p-4 rounded shadow-md">
        <h3 className="text-lg font-semibold mb-2">Alamat Pengiriman</h3>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full border p-2 rounded"
          rows="3"
          placeholder="Alamat lengkap..."
        />

        <h3 className="text-lg font-semibold mt-4 mb-2">Metode Pembayaran</h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option>Transfer Bank</option>
          <option>COD</option>
          <option>QRIS</option>
        </select>

        {/* (Opsional) Voucher */}
        {/* <input type="text" className="w-full border mt-4 p-2 rounded" placeholder="Kode voucher (opsional)" /> */}

        <h3 className="text-lg font-semibold mt-4 mb-2">Ringkasan</h3>
        <ul className="text-sm mb-2">
          {keranjang.map((item, idx) => (
            <li key={idx}>
              {item.nama} x {item.jumlah} = Rp
              {(item.harga * item.jumlah).toLocaleString()}
            </li>
          ))}
        </ul>
        <p>Total: Rp{total.toLocaleString()}</p>
        {voucher && (
          <>
            <p>Diskon: {voucher.discount_percent}%</p>
            <p>Potongan: Rp{discountAmount.toLocaleString()}</p>
          </>
        )}
        <p className="font-bold">Bayar: Rp{finalAmount.toLocaleString()}</p>

        <button
          onClick={handleCheckout}
          className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white p-2 rounded"
        >
          Konfirmasi & Bayar
        </button>
      </div>
    </div>
  );
};

export default Checkout;
