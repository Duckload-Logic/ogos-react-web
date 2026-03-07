import Header from "@/components/layout/Header";
import NotificationModal from "@/components/notifications/NotificationModal";
import Sidebar from "@/components/layout/Sidebar";
import Toast from "@/components/ui/Toast";
import { NAV_CONFIG, roleMap } from "@/config/navigation";

import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/context";
import { ErrorBoundary } from "../shared";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : false;
    // Apply initial theme immediately
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    return isDark;
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = React.useRef<HTMLDivElement>(null);
  const [toasts, setToasts] = useState<string[]>([]);
  const triggerToast = (message: string) => {
  setToasts((prev) => [...prev, message]);

  setTimeout(() => {
    setToasts((prev) => prev.slice(1));
  }, 4000);
};

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);

  const expanded = isHovered;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigationItems = useMemo(() => {
    if (!user || !user.role?.id) return [];

    const roleKey = roleMap[user.role.id];
    if (!roleKey) return [];

    // Find the object in the array that contains the key for the current role
    const roleData = NAV_CONFIG.find((config) => !!config[roleKey]);

    return roleData ? roleData[roleKey] : [];
  }, [user]);

  const getRoleLabel = () => {
    if (!user) return "";
    if (user.role?.id === 3) return "Front Desk Account";
    if (user.role?.id === 2) return "Admin Account";
    return "Student Account";
  };

  return (
    <>
      <ErrorBoundary>
        <div className="flex flex-col h-screen overflow-hidden bg-background animate-in fade-in duration-300">

        <Header
          title={title}
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
          getRoleLabel={getRoleLabel}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />

        <NotificationModal
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          toasts={toasts}
        />

          <div className="flex flex-1 overflow-hidden relative">
              <Sidebar
                navigationItems={navigationItems}
                location={location}
                setIsHovered={setIsHovered}
              />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full relative">
              {/* Darken content on sidebar hover */}
              {expanded && (
                <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-none" />
              )}

              {/* Page Content */}
              <main
                className={`flex-1 overflow-auto p-4 md:p-8 pb-20 md:pb-8 z-10 bg-transparent transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${expanded ? "blur-sm" : ""}`}
              >
                {/* {title && (
              <h1 className="text-3xl font-bold text-foreground mb-6">
                {title}
              </h1>
            )} */}
                {children}
              </main>
            </div>
          </div>
        </div>
        <Toast toasts={toasts} />
      </ErrorBoundary>
    </>
  );
}
