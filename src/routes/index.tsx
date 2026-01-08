import { RouteObject } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "@/pages/NotFound";

// Student pages
import Header from "@/components/Header";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import GuidanceServices from "@/pages/student/GuidanceServices";
import ScheduleAppointment from "@/pages/student/ScheduleAppointment";
import StudentForm from "@/pages/student/StudentForm";
import ExcuseSlip from "@/pages/student/ExcuseSlip";
import ViewSchedules from "@/pages/student/ViewSchedules";
import Profile from "@/pages/Profile";

// Admin pages
import Dashboard from "@/pages/admin/Dashboard";
import IndexFrontdesk from "@/pages/admin/Index-Frontdesk";
import StudentRecords from "@/pages/admin/StudentRecords";
import Appointments from "@/pages/admin/Appointments";
import AppointmentsManagement from "@/pages/admin/AppointmentsManagement";
import ReviewExcuses from "@/pages/admin/ReviewExcuses";
import Reports from "@/pages/admin/Reports";
import Frontdesk from "@/pages/admin/Frontdesk";

export const routes: RouteObject[] = [
  // Public routes
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // Student routes
  {
    path: "/",
    element: (
      <ProtectedRoute requiredRole="student">
        <Header />
        <GuidanceServices />
      </ProtectedRoute>
    ),
  },
  {
    path: "/schedule",
    element: (
      <ProtectedRoute requiredRole="student">
        <Header />
        <ScheduleAppointment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/form",
    element: (
      <ProtectedRoute requiredRole="student">
        <Header />
        <StudentForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/excuse-slip",
    element: (
      <ProtectedRoute requiredRole="student">
        <Header />
        <ExcuseSlip />
      </ProtectedRoute>
    ),
  },
  {
    path: "/schedules",
    element: (
      <ProtectedRoute requiredRole="student">
        <Header />
        <ViewSchedules />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
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
        <IndexFrontdesk />
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

  // 404
  { path: "*", element: <NotFound /> },
];