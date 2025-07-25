import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const PesananDetail = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/admin/orders");
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (err) {
      console.error("Gagal ambil data order:", err);
    }
  };

  const handleFilter = () => {
    const from = new Date(dateFrom);
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);

    const result = orders.filter((order) => {
      const orderDate = new Date(order.order_date);
      return orderDate >= from && orderDate <= to;
    });

    setFilteredOrders(result);
  };

  const calculateTotalRevenue = () => {
    return filteredAndSearchedOrders.reduce(
      (sum, order) => sum + order.final_amount,
      0
    );
  };

  const handleToggleDetail = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleExportExcel = () => {
    const exportData = filteredAndSearchedOrders.map((order) => ({
      Tanggal: new Date(order.order_date).toLocaleDateString(),
      Nama_User: order.user_name,
      Metode_Pembayaran: order.payment_method,
      Total_Akhir: order.final_amount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "OrderHistory");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "order-history.xlsx");
  };

  const filteredAndSearchedOrders = filteredOrders.filter((order) => {
    const keyword = searchTerm.toLowerCase();
    return (
      order.user_name.toLowerCase().includes(keyword) ||
      order.payment_method.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">
        Order History (Admin)
      </h2>

      {/* Filter + Search */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex gap-2 items-center">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <span>-</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border rounded px-3 py-2"
          />
          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Filter
          </button>
        </div>

        <input
          type="text"
          placeholder="🔍 Cari nama user / metode bayar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded px-4 py-2 w-full md:w-1/3"
        />

        <button
          onClick={handleExportExcel}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ⬇️ Export Excel
        </button>
      </div>

      {/* Total Pendapatan */}
      <div className="mb-4 text-lg font-medium text-green-700">
        Total Pendapatan: Rp{calculateTotalRevenue().toLocaleString()}
      </div>

      {/* Tabel Order */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow border">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 text-left">Tanggal</th>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Metode Bayar</th>
              <th className="px-4 py-2 text-right">Total Akhir</th>
              <th className="px-4 py-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSearchedOrders.map((order) => (
              <React.Fragment key={order.order_id}>
                <tr className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{order.user_name}</td>
                  <td className="px-4 py-2">{order.payment_method}</td>
                  <td className="px-4 py-2 text-right">
                    Rp{order.final_amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleToggleDetail(order.order_id)}
                      className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
                    >
                      {expandedOrderId === order.order_id ? "Tutup" : "Detail"}
                    </button>
                  </td>
                </tr>

                {expandedOrderId === order.order_id && (
                  <tr className="bg-gray-50">
                    <td colSpan="5" className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Item Pesanan:
                      </p>
                      <ul className="list-disc ml-5 text-sm text-gray-800 space-y-1">
                        {order.items.map((item, idx) => (
                          <li key={idx}>
                            {item.name} - {item.quantity} x Rp
                            {item.price.toLocaleString()}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-3 text-sm text-gray-700 space-y-1">
                        <p>
                          Total Harga: Rp{order.total_amount.toLocaleString()}
                        </p>
                        <p>
                          Diskon: Rp{order.discount_amount.toLocaleString()}
                        </p>
                        <p className="font-semibold text-green-600">
                          Total Akhir: Rp{order.final_amount.toLocaleString()}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PesananDetail;
