/**
 * Route Configuration
 * Centralized route definitions for the application
 */

import { RouteObject } from "react-router-dom";

// Import page components
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import GuidanceServices from "@/pages/GuidanceServices";
import ScheduleAppointment from "@/pages/ScheduleAppointment";
import StudentForm from "@/pages/StudentForm";
import ExcuseSlip from "@/pages/ExcuseSlip";
import ViewSchedules from "@/pages/ViewSchedules";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import { ProtectedRoute } from "@/components/ProtectedRoute";

/**
 * Main application routes
 *
 * Structure:
 * - /login : Login page (public)
 * - /register : Register page (public)
 * - / : Home/Dashboard (Guidance Services) - protected
 * - /schedule : Schedule appointment - protected
 * - /form : Student enrollment form - protected
 * - /excuse-slip : Excuse slip request - protected
 * - /schedules : View appointments - protected
 * - * : 404 Not Found
 */
export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <GuidanceServices />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
  },
  {
    path: "/schedule",
    element: (
      <ProtectedRoute>
        <ScheduleAppointment />
      </ProtectedRoute>
    ),
  },
  {
    path: "/form",
    element: (
      <ProtectedRoute>
        <StudentForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/excuse-slip",
    element: (
      <ProtectedRoute>
        <ExcuseSlip />
      </ProtectedRoute>
    ),
  },
  {
    path: "/schedules",
    element: (
      <ProtectedRoute>
        <ViewSchedules />
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
    path: "*",
    element: <NotFound />,
  },
];

/**
 * Route metadata for navigation and breadcrumbs
 */
export const routeMetadata = {
  "/login": {
    title: "Login",
    description: "Login to access the guidance services portal",
  },
  "/register": {
    title: "Register",
    description: "Create a new account",
  },
  "/": {
    title: "Guidance Services",
    description: "View guidance services and make requests",
  },
  "/schedule": {
    title: "Schedule Appointment",
    description: "Schedule a guidance appointment",
  },
  "/form": {
    title: "Student Form",
    description: "Fill out your personal data sheet",
  },
  "/excuse-slip": {
    title: "Excuse Slip",
    description: "Request or view excuse slips",
  },
  "/schedules": {
    title: "My Schedules",
    description: "View your scheduled appointments",
  },
} as const;
