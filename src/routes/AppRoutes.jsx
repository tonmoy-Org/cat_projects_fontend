import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Login } from "../pages/login/Login";
import Home from "../pages/home/Home";
import { useAuth } from "../auth/AuthProvider";
import { PrivateRoute } from "../auth/PrivateRoute";
import { ErrorPage } from "../pages/error/ErrorPage";

import { SuperAdminLayout } from "../pages/superadmin/components/SuperAdminLayout";
import { ClientLayout } from "../pages/client/components/ClientLayout";

import { SuperAdminDashboard } from "../pages/superadmin/SuperAdminDashboard";
import { SuperAdminProfile } from "../pages/superadmin/Profile";
import { UserManagement } from "../pages/superadmin/UserManagement";

import { ClientDashboard } from "../pages/client/ClientDashboard";
import { ClientProfile } from "../pages/client/Profile";
import ForgotPassword from "../pages/forgot-password/ForgotPassword";
import ResetPassword from "../pages/reset-password/ResetPassword";

import { PublicLayout } from "../layouts/PublicLayout";
import { HomeCarousel } from "../pages/superadmin/HomeCarousel";
import Blog from "../pages/Blog/Blog";
import Contact from "../pages/Contact/Contact";
import Video from "../pages/Video/Video";
import VideoUpload from "../pages/superadmin/VideoUpload";
import About from "../pages/About/About";
import BlogDetail from "../pages/Blog/BlogDetail";
import { SignUp } from "../pages/SignUp/SignUp";
import CatsManagement from "../pages/superadmin/CatsManagement";
import ProductsManagement from "../pages/superadmin/ProductsManagement";
import Cat from "../pages/Cats/Cat";
import PetDetail from "../pages/Cats/PetDetail";
import Product from "../pages/Product/Product";
import ProductDetail from "../pages/Product/ProductDetail";
import CartRoute from "./CartRoute";
import BlogManagement from "../pages/superadmin/BlogManagement";
import Checkout from "../pages/cart/Checkout";
import PaymentSuccess from "../pages/cart/PaymentSuccess";
import OrderManagement from "../pages/superadmin/Ordermanagement";
import OrdersClient from "../pages/client/OrdersClient";
import ManageAddress from "../pages/client/ManageAddress";
import MyReview from "../pages/client/MyReview";
import Privacy from "../pages/privacy/Privacy";
import Cookies from "../pages/cookies/Cookies";
import PaymentFail from "../pages/cart/PaymentFail";


export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes with Layout */}
        <Route
          path="/"
          element={
            <PublicLayout
              title="Home"
              description="Professional FatherOfMeow system for tracking and managing your financial operations"
            >
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout
              title="Login"
              description="Sign in to your FatherOfMeow account"
            >
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicLayout
              title="Sign Up"
              description="Sign up in to your FatherOfMeow account"
            >
              <SignUp />
            </PublicLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicLayout
              title="Forgot Password"
              description="Reset your FatherOfMeow account password"
            >
              <ForgotPassword />
            </PublicLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicLayout
              title="Reset Password"
              description="Create a new password for your FatherOfMeow account"
            >
              <ResetPassword />
            </PublicLayout>
          }
        />

        {/* Error Routes with Layout */}
        <Route
          path="/error"
          element={
            <PublicLayout title="Error" description="An error occurred">
              <ErrorPage />
            </PublicLayout>
          }
        />
        <Route
          path="/unauthorized"
          element={
            <PublicLayout
              title="Unauthorized"
              description="You don't have permission to access this page"
            >
              <ErrorPage type="unauthorized" />
            </PublicLayout>
          }
        />
        <Route
          path="/not-found"
          element={
            <PublicLayout
              title="Page Not Found"
              description="The page you're looking for doesn't exist"
            >
              <ErrorPage type="not-found" />
            </PublicLayout>
          }
        />
        <Route
          path="/server-error"
          element={
            <PublicLayout
              title="Server Error"
              description="Something went wrong on our end"
            >
              <ErrorPage type="server-error" />
            </PublicLayout>
          }
        />

        {/* Blog Routes */}
        <Route
          path="/blog"
          element={
            <PublicLayout
              title="Blog"
              description="Latest updates and news about pets"
            >
              <Blog />
            </PublicLayout>
          }
        />
        <Route
          path="/blog/:title_id"
          element={
            <PublicLayout
              title="Blog Details"
              description="Read our latest blog posts about pets"
            >
              <BlogDetail />
            </PublicLayout>
          }
        />

        <Route
          path="/contact"
          element={
            <PublicLayout
              title="Contact Us"
              description="Get in touch with us for any inquiries or support"
            >
              <Contact />
            </PublicLayout>
          }
        />
        <Route
          path="/videos"
          element={
            <PublicLayout title="Videos" description="Latest videos about pets">
              <Video />
            </PublicLayout>
          }
        />
        <Route
          path="/cats"
          element={
            <PublicLayout title="Cats" description="Learn more about our cats">
              <Cat />
            </PublicLayout>
          }
        />
        <Route
          path="/adoption/:title_id"
          element={
            <PublicLayout title="Pet Detail" description="Detailed information about our pets">
              <PetDetail />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout title="About Us" description="Learn more about our company">
              <About />
            </PublicLayout>
          }
        />
        <Route
          path="/shop"
          element={
            <PublicLayout title="Product" description="Product page">
              <Product />
            </PublicLayout>
          }
        />
        <Route
          path="/shop/:title_id"
          element={
            <PublicLayout title="Shop" description="Shop page">
              <ProductDetail />
            </PublicLayout>
          }
        />
        <Route
          path="/cart"
          element={
            <PublicLayout title="Cart" description="Cart page">
              <CartRoute />
            </PublicLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <PublicLayout title="checkout" description="Checkout page">
              <Checkout />
            </PublicLayout>
          }
        />
        <Route
          path="/payment/success"
          element={
            <PublicLayout title="Payment success" description="Payment success page">
              <PaymentSuccess />
            </PublicLayout>
          }
        />
        <Route
          path="/payment/failed"
          element={
            <PublicLayout title="Payment failed" description="Payment failed page">
              <PaymentFail />
            </PublicLayout>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <PublicLayout title="Privacy" description="Father of Maw privacy of service">
              <Privacy />
            </PublicLayout>
          }
        />
        <Route
          path="/cookie-policy"
          element={
            <PublicLayout title="Cookie policy" description="Father of Maw cookie policy of service">
              <Cookies />
            </PublicLayout>
          }
        />

        {/* Dashboard Redirect */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {user?.role === "superadmin" && (
                <Navigate to="/superadmin-dashboard" replace />
              )}
              {user?.role === "client" && (
                <Navigate to="/client-dashboard" replace />
              )}
            </PrivateRoute>
          }
        />

        {/* Super Admin Routes */}
        <Route
          path="/superadmin-dashboard"
          element={
            <PrivateRoute requiredRoles={["superadmin"]}>
              <SuperAdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="profile" element={<SuperAdminProfile />} />
          <Route path="carousel-management" element={<HomeCarousel />} />
          <Route path="blogs" element={<BlogManagement />} />
          <Route path="videos-management" element={<VideoUpload />} />
          <Route path="cats-management" element={<CatsManagement />} />
          <Route path="products-management" element={<ProductsManagement />} />
          <Route path="order-management" element={<OrderManagement />} />
          <Route path="addresses" element={<ManageAddress />} />
          <Route path="my-review" element={<MyReview />} />
          <Route path="my-orders" element={<OrdersClient />} />
        </Route>

        {/* Client Routes */}
        <Route
          path="/client-dashboard"
          element={
            <PrivateRoute requiredRoles={["client"]}>
              <ClientLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<ClientDashboard />} />
          <Route path="profile" element={<ClientProfile />} />
          <Route path="my-orders" element={<OrdersClient />} />
          <Route path="addresses" element={<ManageAddress />} />
          <Route path="my-review" element={<MyReview />} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route
          path="*"
          element={
            <PublicLayout
              title="Page Not Found"
              description="The page you're looking for doesn't exist"
            >
              <ErrorPage type="not-found" />
            </PublicLayout>
          }
        />
      </Routes>
    </Router>
  );
};