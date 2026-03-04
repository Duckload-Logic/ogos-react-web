import { RouteObject, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { PDSGate } from "@/components/PDSGate";

// Shared
import Layout from "@/components/Layout";
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

  // 404
  { path: "*", element: <NotFound /> },
];
