import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from '../pages/login/Login';
import { Home } from '../pages/home/Home';
import { useAuth } from '../auth/AuthProvider';
import { PrivateRoute } from '../auth/PrivateRoute';
import { ErrorPage } from '../pages/error/ErrorPage';

import { SuperAdminLayout } from '../pages/superadmin/components/SuperAdminLayout';
import { MemberLayout } from '../pages/member/components/MemberLayout';
import { ClientLayout } from '../pages/client/components/ClientLayout';

import { SuperAdminDashboard } from '../pages/superadmin/SuperAdminDashboard';
import { SuperAdminProfile } from '../pages/superadmin/Profile';
import { UserManagement } from '../pages/superadmin/UserManagement';

import { MemberDashboard } from '../pages/member/MemberDashboard';
import { MemberProfile } from '../pages/member/Profile';
import RMEReports from '../pages/member/HMIS/RMEReports';
import RSSReports from '../pages/member/HMIS/RSSReports';
import TOSReports from '../pages/member/HMIS/TOSReports';

import { ClientDashboard } from '../pages/client/ClientDashboard';
import { ClientProfile } from '../pages/client/Profile';
import ForgotPassword from '../pages/forgot-password/ForgotPassword';
import ResetPassword from '../pages/reset-password/ResetPassword';

import { PublicLayout } from '../layouts/PublicLayout';

export const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes with Layout */}
        <Route
          path="/"
          element={
            <PublicLayout title="Home" description="Professional FatherOfMeow system for tracking and managing your financial operations">
              <Home />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout title="Login" description="Sign in to your FatherOfMeow account">
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicLayout title="Forgot Password" description="Reset your FatherOfMeow account password">
              <ForgotPassword />
            </PublicLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicLayout title="Reset Password" description="Create a new password for your FatherOfMeow account">
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
            <PublicLayout title="Unauthorized" description="You don't have permission to access this page">
              <ErrorPage type="unauthorized" />
            </PublicLayout>
          }
        />
        <Route
          path="/not-found"
          element={
            <PublicLayout title="Page Not Found" description="The page you're looking for doesn't exist">
              <ErrorPage type="not-found" />
            </PublicLayout>
          }
        />
        <Route
          path="/server-error"
          element={
            <PublicLayout title="Server Error" description="Something went wrong on our end">
              <ErrorPage type="server-error" />
            </PublicLayout>
          }
        />

        {/* Dashboard Redirect */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              {user?.role === 'superadmin' && <Navigate to="/superadmin-dashboard" replace />}
              {user?.role === 'member' && <Navigate to="/member-dashboard" replace />}
              {user?.role === 'client' && <Navigate to="/client-dashboard" replace />}
            </PrivateRoute>
          }
        />

        {/* Super Admin Routes */}
        <Route
          path="/superadmin-dashboard"
          element={
            <PrivateRoute requiredRoles={['superadmin']}>
              <SuperAdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="profile" element={<SuperAdminProfile />} />
        </Route>

        {/* Member Routes */}
        <Route
          path="/member-dashboard"
          element={
            <PrivateRoute requiredRoles={['member']}>
              <MemberLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<MemberDashboard />} />
          <Route path="profile" element={<MemberProfile />} />

          {/* Health Department Reports */}
          <Route path="health-department-reports/rme" element={<RMEReports />} />
          <Route path="health-department-reports/rss" element={<RSSReports />} />
          <Route path="health-department-reports/tos" element={<TOSReports />} />
        </Route>

        {/* Tech Routes */}
        <Route
          path="/client-dashboard"
          element={
            <PrivateRoute requiredRoles={['client']}>
              <ClientLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<ClientDashboard />} />
          <Route path="profile" element={<ClientProfile />} />
        </Route>

        {/* Catch-all 404 Route */}
        <Route
          path="*"
          element={
            <PublicLayout title="Page Not Found" description="The page you're looking for doesn't exist">
              <ErrorPage type="not-found" />
            </PublicLayout>
          }
        />
      </Routes>
    </Router>
  );
};