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
import GuidanceServices from "@/features/students/pages/GuidanceServices";
import ScheduleAppointment from "@/features/students/pages/ScheduleAppointment";
import StudentForm from "@/features/students/pages/StudentForm";
import AdmissionSlip from "@/features/students/pages/AdmissionSlip";
import ViewSchedules from "@/features/students/pages/ViewSchedules";

// Admin Feature
import Dashboard from "@/features/admin/pages/Dashboard";
import StudentRecords from "@/features/admin/pages/StudentRecords";
import Appointments from "@/features/admin/pages/Appointments";
import AppointmentsManagement from "@/features/admin/pages/AppointmentsManagement";
import ReviewExcuses from "@/features/admin/pages/ReviewExcuses";
import Reports from "@/features/admin/pages/Reports";
import Frontdesk from "@/features/frontdesk/pages/Frontdesk";
import StudentProfile from "@/features/students/pages/StudentProfile";

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
          <GuidanceServices />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/appointment",
    element: (
      <ProtectedRoute requiredRole="student">
        <PDSGate>
          <Layout title="Schedule Appointment">
            <ScheduleAppointment />
          </Layout>
        </PDSGate>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/form",
    element: (
      <ProtectedRoute requiredRole="student">
        <Layout title="Individual Inventory Record">
          <StudentForm />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/excuse-slip",
    element: (
      <ProtectedRoute requiredRole="student">
        <PDSGate>
          <Layout title="Excuse Slip">
            <AdmissionSlip />
          </Layout>
        </PDSGate>
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/schedules",
    element: (
      <ProtectedRoute requiredRole="student">
        <PDSGate>
          <Layout title="View Schedules">
            <ViewSchedules />
          </Layout>
        </PDSGate>
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
        <Layout title="Student Profile">
          <StudentProfile />
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
    path: "/admin/view-schedule",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Layout title="View Appointments">
          <Appointments />
        </Layout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/review-excuses",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Layout title="Review Excuse Slips">
          <ReviewExcuses />
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

  // Frontdesk routes
  {
    path: "/frontdesk",
    element: (
      <ProtectedRoute requiredRole="frontdesk">
        <Frontdesk />
      </ProtectedRoute>
    ),
  },
  {
    path: "/frontdesk/appointments",
    element: (
      <ProtectedRoute requiredRole="frontdesk">
        <Appointments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/frontdesk/review-excuses",
    element: (
      <ProtectedRoute requiredRole="frontdesk">
        <ReviewExcuses />
      </ProtectedRoute>
    ),
  },

  // 404
  { path: "*", element: <NotFound /> },
];
