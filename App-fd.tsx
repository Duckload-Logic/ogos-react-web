import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth-context";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";
import Dashboard from "./pages/Dashboard";
import IndexFrontdesk from "./pages/Index-Frontdesk";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login-Admin";
import Register from "./pages/Register-Admin";
import StudentRecords from "./pages/StudentRecords";
import Appointments from "./pages/Appointments";
import AppointmentsManagement from "./pages/AppointmentsManagement";
import ReviewExcuses from "./pages/ReviewExcuses";
import Reports from "./pages/Reports";
import Frontdesk from "./pages/Frontdesk";

const queryClient = new QueryClient();

// Role-based home page component
const RoleBasedHome = () => {
  const { userRole } = useAuth();

  if (userRole === "frontdesk") {
    return <IndexFrontdesk />;
  }

  return <Dashboard />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <RoleBasedHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student-records"
              element={
                <ProtectedRoute>
                  <StudentRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <ProtectedRoute>
                  <AppointmentsManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-schedule"
              element={
                <ProtectedRoute>
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/review-excuses"
              element={
                <ProtectedRoute>
                  <ReviewExcuses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/frontdesk"
              element={
                <ProtectedRoute>
                  <Frontdesk />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
