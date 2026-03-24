import { RouteObject, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { IIRGate } from "@/features/auth/components/IIRGate";

// Shared
import Layout, { usePageMetadata } from "@/components/layout/Layout";
import NotFound from "@/components/shared/NotFound";

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

const TermsContent = () => {
  usePageMetadata({
    title: "Terms and Conditions",
    description: "Please read our terms and conditions carefully before using our services",
    badgeText: "Legal",
    isLoading: false,
  });
  return <StatementPage statementType="terms" />;
};

const PrivacyContent = () => {
  usePageMetadata({
    title: "Privacy Policy",
    description: "We value your privacy and are committed to protecting your personal data",
    badgeText: "Legal",
    isLoading: false,
  });
  return <StatementPage statementType="privacy" />;
};

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
          <Layout />
        </IIRGate>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <StudentDashboard />,
      },
      {
        path: "appointments",
        element: <StudentAppointments />,
      },
      {
        path: "appointments/schedule",
        element: <CreateAppointment />,
      },
      {
        path: "slips",
        element: <StudentSlips />,
      },
      {
        path: "slips/submit",
        element: <SubmitSlip />,
      },
      {
        path: "iir",
        element: <IIRProfile />,
      },
      {
        path: "iir/form",
        element: <IIRForm />,
      },
    ],
  },

  // Admin routes
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "student-records",
        element: <StudentRecords />,
      },
      {
        path: "student-records/:studentId",
        element: <IIRProfile />,
      },
      {
        path: "appointments",
        element: <AppointmentsManagement />,
      },
      {
        path: "admission-slips",
        element: <ReviewSlips />,
      },
      {
        path: "admission-slips/logs",
        element: <SlipLogs />,
      },
      {
        path: "reports",
        element: <Reports />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },

  // Super Admin routes
  {
    path: "/superadmin",
    element: (
      <ProtectedRoute requiredRole="superadmin">
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <SuperAdminDashboard />,
      },
      {
        path: "api-management",
        element: <APIManagement />,
      },
      {
        path: "security-logs",
        element: <SecurityLogs />,
      },
      {
        path: "system-logs",
        element: <SystemLogs />,
      },
      {
        path: "audit-logs",
        element: <AuditLogs />,
      },
    ],
  },

  // OAuth callback route (public, no layout)
  {
    path: "/auth/callback",
    element: <Callback />,
  },

  // 404
  { path: "*", element: <NotFound /> },
];
