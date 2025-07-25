import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import Produk from "./pages/Produk";
import ReviewPage from "./pages/ReviewPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Admin from "./pages/admin/Admin.jsx";
import KategoriProduk from "./pages/admin/KategoriProduk/KategoriProduk.jsx";
import ProdukDetail from "./pages/admin/ProdukDetail/ProdukDetail.jsx";
import Voucher from "./pages/admin/Voucher/Voucher.jsx";
import PesananDetail from "./pages/admin/Pesanan/PesananDetail.jsx";
import Dashboard from "./pages/admin/dashboard.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/produk" element={<Produk />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-history" element={<OrderHistory />} />

        <Route path="/admin" element={<Admin />}>
          <Route path="kategoriproduk" element={<KategoriProduk />} />
          <Route path="produkdetail" element={<ProdukDetail />} />
          <Route path="voucher" element={<Voucher />} />
          <Route path="pesanan" element={<PesananDetail />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
