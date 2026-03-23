import { RouteObject, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { IIRGate } from "@/components/IIRGate";

// Shared
import Layout from "@/components/layout/Layout";
import NotFound from "@/pages/shared/NotFound";

// Auth Feature
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";

// Student Features
import { Dashboard as StudentDashboard } from "@/features/students/pages/Dashboard";
import StudentAppointments from "@/features/appointments/pages/student/StudentAppointments";
import { StudentSlips, SubmitSlip } from "@/features/slips/pages/student";

// Admin Feature
import Dashboard from "@/features/admin/pages/Dashboard";
import StudentRecords from "@/features/admin/pages/StudentRecords";
import AppointmentsManagement from "@/features/appointments/pages/admin/AppointmentsManagement";
import ReviewSlips from "@/features/slips/pages/admin/ReviewSlips";
import SlipLogs from "@/features/slips/pages/admin/SlipLogs";
import Reports from "@/features/analytics/pages/Reports";
import Analytics from "@/features/analytics/pages/Analytics";
import IIRProfile from "@/features/iir/pages/IIRProfile";
import IIRForm from "@/features/iir/pages/IIRForm";
import { CreateAppointment } from "@/features/appointments";
import StatementPage from "@/features/consents/pages/StatementPage";
import Profile from "@/features/users/pages/Profile";

// Super Admin Feature
import {
  SuperAdminDashboard,
  APIManagement,
  SecurityLogs,
  SystemLogs,
  AuditLogs,
} from "@/features/superadmin";
import Callback from "@/features/auth/pages/Callback";

export const routes: RouteObject[] = [
  // Root route - redirect to login
  { path: "/", element: <Navigate to="/login" replace /> },

  // Public routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  // Student routes
  {
    path: "/student",
    element: (
      <ProtectedRoute requiredRole="student">
        <IIRGate>
          <StudentDashboard />
        </IIRGate>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/appointments",
    element: (
      <ProtectedRoute requiredRole="student">
        <IIRGate>
          <StudentAppointments />
        </IIRGate>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/appointments/schedule",
    element: (
      <ProtectedRoute requiredRole="student">
        <CreateAppointment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/slips",
    element: (
      <ProtectedRoute requiredRole="student">
        <IIRGate>
          <StudentSlips />
        </IIRGate>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/slips/submit",
    element: (
      <ProtectedRoute requiredRole="student">
        <IIRGate>
          <SubmitSlip />
        </IIRGate>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/form",
    element: (
      <ProtectedRoute requiredRole="student">
        <IIRForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/iir",
    element: (
      <ProtectedRoute requiredRole="student">
        <IIRProfile />
      </ProtectedRoute>
    ),
  },

  // Admin routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/student-records",
    element: (
      <ProtectedRoute requiredRole="admin">
        <StudentRecords />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/student-records/:studentId",
    element: (
      <ProtectedRoute requiredRole="admin">
        <IIRProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/appointments",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AppointmentsManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/admission-slips",
    element: (
      <ProtectedRoute requiredRole="admin">
        <ReviewSlips />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/admission-slips/logs",
    element: (
      <ProtectedRoute requiredRole="admin">
        <SlipLogs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Reports />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/analytics",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Analytics />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/profile",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Profile />
      </ProtectedRoute>
    ),
  },

  // Super Admin routes
  {
    path: "/superadmin",
    element: (
      <ProtectedRoute requiredRole="superadmin">
        <SuperAdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/superadmin/api-management",
    element: (
      <ProtectedRoute requiredRole="superadmin">
        <APIManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/superadmin/security-logs",
    element: (
      <ProtectedRoute requiredRole="superadmin">
        <SecurityLogs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/superadmin/system-logs",
    element: (
      <ProtectedRoute requiredRole="superadmin">
        <SystemLogs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/superadmin/audit-logs",
    element: (
      <ProtectedRoute requiredRole="superadmin">
        <AuditLogs />
      </ProtectedRoute>
    ),
  },

  {
    path: "/terms",
    element: (
      <Layout
        title="Terms and Conditions"
        description="Please read our terms and conditions carefully before using our services"
        badgeText="Legal"
        isLoggedIn={false}
        isLoading={false}
      >
        <div className="prose max-w-none">
          <StatementPage statementType="terms" />
        </div>
      </Layout>
    ),
  },
  {
    path: "/privacy",
    element: (
      <Layout
        title="Privacy Policy"
        description="We value your privacy and are committed to protecting your personal data"
        badgeText="Legal"
        isLoggedIn={false}
        isLoading={false}
      >
        <div className="prose max-w-none">
          <StatementPage statementType="privacy" />
        </div>
      </Layout>
    ),
  },

  // OAuth callback route (public, no layout)
  {
    path: "/auth/callback",
    element: <Callback />,
  },

  // 404
  { path: "*", element: <NotFound /> },
];
