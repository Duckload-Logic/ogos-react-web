import { useRoutes, Navigate, RouteObject } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, UIProvider, ToastProvider } from "@/context";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import Layout from "@/components/layout/Layout";
import Login from "@/features/auth/pages/Login";
import Register from "@/features/auth/pages/Register";
import Callback from "@/features/auth/pages/Callback";
import NotFound from "@/components/shared/NotFound";
import AdminWhitelist from "@/features/superadmin/pages/AdminWhitelist";

// Super Admin Pages
import {
  SuperAdminDashboard,
  M2MManagement,
  UserManagement,
  AnalyticsOverview,
  SecurityLogs,
  SystemLogs,
  AuditLogs,
  UserActivity,
  UserSessions,
} from "@/features/superadmin";
import Profile from "@/features/users/pages/Profile";
import NotificationsPage from "@/features/notifications/pages/Notifications";

const QUERY_CLIENT_STALE_TIME = 1000 * 60 * 5; // 5 minutes
const QUERY_CLIENT_GC_TIME = 1000 * 60 * 60; // 1 hour

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CLIENT_STALE_TIME,
      gcTime: QUERY_CLIENT_GC_TIME,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: 2,
    },
  },
});

const routes: RouteObject[] = [
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/auth/callback", element: <Callback /> },
  {
    path: "/superadmin",
    element: (
      <ProtectedRoute requiredRole="superadmin">
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <SuperAdminDashboard /> },
      { path: "m2m-management", element: <M2MManagement /> },
      { path: "users", element: <UserManagement /> },
      { path: "whitelist", element: <AdminWhitelist /> },
      { path: "analytics", element: <AnalyticsOverview /> },
      { path: "security-logs", element: <SecurityLogs /> },
      { path: "system-logs", element: <SystemLogs /> },
      { path: "audit-logs", element: <AuditLogs /> },
      { path: "users/:userId/activity", element: <UserActivity /> },
      { path: "users/:userId/sessions", element: <UserSessions /> },
      { path: "profile", element: <Profile /> },
      { path: "notifications", element: <NotificationsPage /> },
    ],
  },
  { path: "*", element: <NotFound /> },
];

function AppRoutes() {
  const element = useRoutes(routes);
  return element;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UIProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </UIProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
