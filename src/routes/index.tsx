import { RouteObject, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PDSGate } from "@/components/PDSGate";

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

// Super Admin Feature
import {
  SuperAdminDashboard,
  APIManagement,
  SecurityLogs,
  SystemLogs,
  AuditLogs,
} from "@/features/superadmin";

export const routes: RouteObject[] = [
  // Root route - redirect to login
  { path: "/", element: <Navigate to="/login" replace /> },

  // Public routes
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // Student routes
  {
    path: "/student/home",
    element: (
      <ProtectedRoute requiredRole="student">
        <Layout title="Services">
          <StudentDashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/appointments",
    element: (
      <ProtectedRoute requiredRole="student">
        <PDSGate>
          <Layout title="View Appointments">
            <StudentAppointments />
          </Layout>
        </PDSGate>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/appointments/schedule",
    element: (
      <ProtectedRoute requiredRole="student">
        <Layout title="Schedule Appointment">
          <CreateAppointment />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/slips",
    element: (
      <ProtectedRoute requiredRole="student">
        <PDSGate>
          <Layout title="My Admission Slips">
            <StudentSlips />
          </Layout>
        </PDSGate>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/slips/submit",
    element: (
      <ProtectedRoute requiredRole="student">
        <PDSGate>
          <SubmitSlip />
        </PDSGate>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/form",
    element: (
      <ProtectedRoute requiredRole="student">
        <Layout title="Individual Inventory Record">
          <IIRForm />
        </Layout>
      </ProtectedRoute>
    ),
  },

  // Admin routes
  {
    path: "/admin/home",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Layout title="Dashboard">
          <Dashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/student-records",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Layout title="Student Records">
          <StudentRecords />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/student-records/:studentId",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Layout title="Individual Inventory Record">
          <IIRProfile />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/appointments",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Layout title="Appointments">
          <AppointmentsManagement />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/admission-slips",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Layout title="Review Excuse Slips">
          <ReviewSlips />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/admission-slips/logs",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Layout title="Admission Slip Logs">
          <SlipLogs />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/reports",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Layout title="Reports">
          <Reports />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/analytics",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Layout title="Analytics">
          <Analytics />
        </Layout>
      </ProtectedRoute>
    ),
  },

  // Super Admin routes
  {
    path: "/superadmin/home",
    element: (
      <ProtectedRoute requiredRole="superadmin">
        <Layout title="Super Admin Dashboard">
          <SuperAdminDashboard />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/superadmin/api-management",
    element: (
      <ProtectedRoute requiredRole="superadmin">
        <Layout title="API Management">
          <APIManagement />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/superadmin/security-logs",
    element: (
      <ProtectedRoute requiredRole="superadmin">
        <Layout title="Security Logs">
          <SecurityLogs />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/superadmin/system-logs",
    element: (
      <ProtectedRoute requiredRole="superadmin">
        <Layout title="System Logs">
          <SystemLogs />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/superadmin/audit-logs",
    element: (
      <ProtectedRoute requiredRole="superadmin">
        <Layout title="Audit Logs">
          <AuditLogs />
        </Layout>
      </ProtectedRoute>
    ),
  },

  {
    path: "/terms",
    element: (
      <Layout title="Terms and Conditions" showSidebar={false}>
        <div className="prose max-w-none">
          <StatementPage statementType="terms" />
        </div>
      </Layout>
    ),
  },
  {
    path: "/privacy",
    element: (
      <Layout title="Privacy Policy" showSidebar={false}>
        <div className="prose max-w-none">
          <StatementPage statementType="privacy" />
        </div>
      </Layout>
    ),
  },

  // 404
  { path: "*", element: <NotFound /> },
];
