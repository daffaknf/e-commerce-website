import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format, parseISO } from "date-fns";

const Dashboard = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchRevenue(); // Load awal tanpa filter
  }, []);

  const fetchRevenue = async (start = null, end = null) => {
    try {
      const response = await axios.get("http://localhost:3001/admin/revenue", {
        params: { start_date: start, end_date: end },
      });

      // Pastikan angka diparsing ke number
      const parsedData = response.data.map((item) => ({
        ...item,
        total: Number(item.total),
      }));

      setRevenueData(parsedData);

      const total = parsedData.reduce((sum, curr) => sum + curr.total, 0);
      setTotalRevenue(total);
    } catch (error) {
      console.error("Gagal ambil data grafik:", error);
    }
  };

  const handleFilter = () => {
    if (startDate && endDate) {
      fetchRevenue(startDate, endDate);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        📊 Dashboard Admin
      </h2>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <input
          type="date"
          className="border px-3 py-2 rounded-md shadow-sm"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="border px-3 py-2 rounded-md shadow-sm"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          onClick={handleFilter}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Filter
        </button>
      </div>

      {/* Total Pendapatan */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">
          Total Pendapatan
        </h3>
        <p className="text-2xl font-bold text-green-600">
          Rp {totalRevenue.toLocaleString("id-ID")}
        </p>
      </div>

      {/* Grafik */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Grafik Pendapatan Harian
        </h3>
        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="order_date"
                tickFormatter={(str) => format(parseISO(str), "dd/MM")}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => `Rp ${value.toLocaleString("id-ID")}`}
                labelFormatter={(label) =>
                  `Tanggal: ${format(parseISO(label), "dd MMM yyyy")}`
                }
              />
              <Bar dataKey="total" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">Tidak ada data untuk ditampilkan.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
