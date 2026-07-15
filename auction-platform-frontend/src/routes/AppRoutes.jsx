import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import Products from "../pages/Products/Products";
import ProductDetails from "../pages/Products/ProductDetails";

import SellerDashboard from "../pages/Seller/SellerDashboard";
import MyProducts from "../pages/Seller/MyProducts";
import AddProduct from "../pages/Seller/AddProduct";
import EditProduct from "../pages/Seller/EditProduct";

import BuyerDashboard from "../pages/Buyer/BuyerDashboard";
import MyBids from "../pages/Buyer/MyBids";
import WonAuction from "../pages/Buyer/WonAuction";

import Profile from "../pages/Profile/Profile";
import NotFound from "../pages/Error/NotFound";
import Unauthorized from "../pages/Error/Unauthorized";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Seller Protected Pages */}
      <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/seller-dashboard/my-products" element={<MyProducts />} />
          <Route path="/seller-dashboard/add-product" element={<AddProduct />} />
          <Route path="/seller-dashboard/edit-product/:id" element={<EditProduct />} />
        </Route>
      </Route>

      {/* Buyer Protected Pages */}
      <Route element={<ProtectedRoute allowedRoles={["buyer"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
          <Route path="/buyer-dashboard/my-bids" element={<MyBids />} />
          <Route path="/buyer-dashboard/won-auctions" element={<WonAuction />} />
        </Route>
      </Route>

      {/* Authenticated Shared Pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Error 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;