import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.user_id) {
      fetchOrders(user.user_id);
    }
  }, []);

  const fetchOrders = async (user_id) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/orders/${user_id}`
      );
      setOrders(response.data);
    } catch (error) {
      console.error("Gagal ambil riwayat pesanan:", error);
    }
  };

  const handleToggleDetail = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleDelete = async (orderId) => {
    const confirm = window.confirm(
      "Yakin ingin menghapus riwayat pesanan ini?"
    );
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:3001/orders/${orderId}`);
      setOrders((prev) => prev.filter((order) => order.order_id !== orderId));
    } catch (error) {
      console.error("Gagal hapus pesanan:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">
          Riwayat Pesanan
        </h2>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Kembali
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-600">Belum ada pesanan.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white shadow-md rounded-lg p-4 border"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.order_date).toLocaleDateString()}
                  </p>
                  <p className="font-medium text-gray-800">
                    {order.payment_method}
                  </p>
                  <p className="text-lg font-semibold text-green-600">
                    Rp{order.final_amount.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleDetail(order.order_id)}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
                  >
                    {expandedOrderId === order.order_id
                      ? "Sembunyikan"
                      : "Detail"}
                  </button>
                  <button
                    onClick={() => handleDelete(order.order_id)}
                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              {/* Detail Order */}
              {expandedOrderId === order.order_id && (
                <div className="mt-4 bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600 mb-2">Item Pesanan:</p>
                  <ul className="list-disc ml-5 text-sm text-gray-800 space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.name} - {item.quantity} x Rp
                        {item.price.toLocaleString()}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4 space-y-1 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">Total Harga:</span> Rp
                      {order.total_amount.toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Diskon:</span> Rp
                      {order.discount_amount.toLocaleString()}
                    </p>
                    <p className="text-green-600 font-semibold">
                      <span className="font-medium">Total Akhir:</span> Rp
                      {order.final_amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
