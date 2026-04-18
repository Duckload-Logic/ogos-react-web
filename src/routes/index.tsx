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
import StudentAppointmentDetails from "@/features/appointments/pages/student/AppointmentDetails";
import { StudentSlips, SubmitSlip } from "@/features/slips/pages/student";
import StudentSlipDetails from "@/features/slips/pages/student/SlipDetails";

// Admin Feature
import Dashboard from "@/features/admin/pages/Dashboard";
import StudentRecords from "@/features/admin/pages/StudentRecords";
import AppointmentsManagement from "@/features/appointments/pages/admin/AppointmentsManagement";
import AppointmentDetails from "@/features/appointments/pages/admin/AppointmentDetails";
import AppointmentLogs from "@/features/appointments/pages/admin/AppointmentLogs";
import ReviewSlips from "@/features/slips/pages/admin/ReviewSlips";
import SlipDetails from "@/features/slips/pages/admin/SlipDetails";
import SlipLogs from "@/features/slips/pages/admin/SlipLogs";
import Analytics from "@/features/analytics/pages/Analytics";
import LifecycleManagement from "@/features/admin/pages/LifecycleManagement";
import IIRProfile from "@/features/iir/pages/IIRProfile";
import IIRForm from "@/features/iir/pages/IIRForm";
import { CreateAppointment } from "@/features/appointments";
import StatementPage from "@/features/consents/pages/StatementPage";
import Profile from "@/features/users/pages/Profile";

import Callback from "@/features/auth/pages/Callback";
import NotificationsPage from "@/features/notifications/pages/Notifications";

const TermsContent = () => {
  usePageMetadata({
    title: "Terms and Conditions",
    description:
      "Please read our terms and conditions carefully before using our services",
    badgeText: "Legal",
    isLoading: false,
  });
  return <StatementPage statementType="terms" />;
};

const PrivacyContent = () => {
  usePageMetadata({
    title: "Privacy Policy",
    description:
      "We value your privacy and are committed to protecting your personal data",
    badgeText: "Legal",
    isLoading: false,
  });
  return <StatementPage statementType="privacy" />;
};

export const routes: RouteObject[] = [
  // Root route - redirect to login
  {
    path: "/",
    element: (
      <Navigate
        to="/login"
        replace
      />
    ),
  },

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
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <IIRGate>
            <StudentDashboard />
          </IIRGate>
        ),
      },
      {
        path: "appointments",
        element: (
          <IIRGate>
            <StudentAppointments />
          </IIRGate>
        ),
      },
      {
        path: "appointments/:id",
        element: (
          <IIRGate>
            <StudentAppointmentDetails />
          </IIRGate>
        ),
      },
      {
        path: "appointments/schedule",
        element: (
          <IIRGate>
            <CreateAppointment />
          </IIRGate>
        ),
      },
      {
        path: "slips",
        element: (
          <IIRGate>
            <StudentSlips />
          </IIRGate>
        ),
      },
      {
        path: "slips/:id",
        element: (
          <IIRGate>
            <StudentSlipDetails />
          </IIRGate>
        ),
      },
      {
        path: "slips/submit",
        element: (
          <IIRGate>
            <SubmitSlip />
          </IIRGate>
        ),
      },
      {
        path: "slips/edit/:id",
        element: (
          <IIRGate>
            <SubmitSlip />
          </IIRGate>
        ),
      },
      {
        path: "iir",
        element: <IIRProfile />,
      },
      {
        path: "iir/form",
        element: <IIRForm />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
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
        path: "lifecycle",
        element: <LifecycleManagement />,
      },
      {
        path: "appointments",
        element: <AppointmentsManagement />,
      },
      {
        path: "appointments/:id",
        element: <AppointmentDetails />,
      },
      {
        path: "appointments/logs",
        element: <AppointmentLogs />,
      },
      {
        path: "slips",
        element: <ReviewSlips />,
      },
      {
        path: "slips/:id",
        element: <SlipDetails />,
      },
      {
        path: "slips/logs",
        element: <SlipLogs />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
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
