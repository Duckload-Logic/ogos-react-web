import { RouteObject, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Header from "@/components/Header";

// Shared
import NotFound from "@/pages/shared/NotFound";

// Auth Feature
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";

// Student Features
import GuidanceServices from "@/features/guidance-services/pages/GuidanceServices";
import ScheduleAppointment from "@/features/appointments/pages/ScheduleAppointment";
import StudentForm from "@/features/pds/pages/StudentForm";
import ExcuseSlip from "@/features/excuse-slips/pages/ExcuseSlip";
import ViewSchedules from "@/features/schedules/pages/ViewSchedules";
import Profile from "@/features/profile/pages/Profile";

// Admin Feature
import Dashboard from "@/features/admin/pages/Dashboard";
import StudentRecords from "@/features/admin/pages/StudentRecords";
import Appointments from "@/features/admin/pages/Appointments";
import AppointmentsManagement from "@/features/admin/pages/AppointmentsManagement";
import ReviewExcuses from "@/features/admin/pages/ReviewExcuses";
import Reports from "@/features/admin/pages/Reports";
import Frontdesk from "@/features/frontdesk/pages/Frontdesk";

export const routes: RouteObject[] = [
  // Root route - redirect to login
  { path: "/", element: <Navigate to="/login" replace /> },

  // Public routes
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // Student routes
  {
    path: "/student",
    element: (
      <ProtectedRoute requiredRole="student">
        <Header />
        <GuidanceServices />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/schedule",
    element: (
      <ProtectedRoute requiredRole="student">
        <Header />
        <ScheduleAppointment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/form",
    element: (
      <ProtectedRoute requiredRole="student">
        <Header />
        <StudentForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/excuse-slip",
    element: (
      <ProtectedRoute requiredRole="student">
        <Header />
        <ExcuseSlip />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/schedules",
    element: (
      <ProtectedRoute requiredRole="student">
        <Header />
        <ViewSchedules />
      </ProtectedRoute>
    ),
  },
  {
    path: "/student/profile",
    element: (
      <ProtectedRoute requiredRole="student">
        <Header />
        <Profile />
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
    path: "/admin/appointments",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AppointmentsManagement />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/view-schedule",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Appointments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/review-excuses",
    element: (
      <ProtectedRoute requiredRole="admin">
        <ReviewExcuses />
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
