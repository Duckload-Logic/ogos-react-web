import React, { useMemo, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  Home,
  Users,
  Calendar,
  FileText,
  BarChart3,
  UserCircle,
  Moon,
  Sun,
  Settings,
  Bell,
} from "lucide-react";
import { useAuth } from "@/context";
import PUPLogo from "@/assets/images/PUPLogo.png";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const ICON_SIZE = 20;

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

  const navigationItems: NavItem[] = useMemo(() => {
    if (!user) return [];

    if (user.roleId === 3) {
      return [
        {
          label: "Dashboard",
          href: "/frontdesk",
          icon: <Home size={ICON_SIZE} />,
        },
        {
          label: "Review Excuses",
          href: "/frontdesk/review-excuses",
          icon: <FileText size={ICON_SIZE} />,
        },
      ];
    }

    if (user.roleId === 2) {
      return [
        { label: "Dashboard", href: "/admin", icon: <Home size={ICON_SIZE} /> },
        {
          label: "Student Records",
          href: "/admin/student-records",
          icon: <Users size={ICON_SIZE} />,
        },
        {
          label: "Appointments",
          href: "/admin/appointments",
          icon: <Calendar size={ICON_SIZE} />,
        },
        {
          label: "Review Excuses",
          href: "/admin/review-excuses",
          icon: <FileText size={ICON_SIZE} />,
        },
        {
          label: "Reports",
          href: "/admin/reports",
          icon: <BarChart3 size={ICON_SIZE} />,
        },
      ];
    }

    return [];
  }, [user]);

  const getRoleLabel = () => {
    if (!user) return "";
    if (user.roleId === 3) return "Front Desk Account";
    if (user.roleId === 2) return "Admin Account";
    return "Student Account";
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden transition-colors duration-300">
      {/* Header */}
      <header
        className="
          h-20 flex items-center justify-between px-6
          relative z-20 transition-colors duration-300
          border-b
        "
      >
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 ml-[-8px]">
          <img src={PUPLogo} className="w-8 h-8 rounded-full" />
          <div className="flex flex-col items-center leading-tight font-semibold sm:block scale-[0.8] origin-left">
            <p className="text-foreground text-[10px]">
              Polytechnic University of the Philippines – Taguig
            </p>
            <p className="text-[8px] text-muted-foreground">
              Online Guidance Office Services
            </p>
          </div>
        </div>

        <span className="text-sm opacity-90">{title}</span>

        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            onClick={() => setShowNotifications(true)}
            className="p-2 hover:bg-primary-foreground/10 rounded transition relative"
          >
            <Bell size={18} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              3
            </span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-primary-foreground/10 rounded transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Profile */}
          <div className="flex items-center gap-2">
            <UserCircle size={28} />
            <span className="text-sm hidden md:block">{getRoleLabel()}</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-primary-foreground/10 rounded transition"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Notification Modal */}
      {showNotifications && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNotifications(false)}
          />

          {/* Modal */}
          <div className="relative bg-card w-[85%] max-w-3xl h-[70vh] rounded-2xl shadow-2xl border border-border flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b dark:border-gray-700">
              <div>
                <h2 className="text-xl font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">
                  You have 3 unread notifications
                </p>
              </div>

              <div className="flex items-center gap-4">
                <button className="text-sm text-card-foreground hover:underline">
                  Mark all as read
                </button>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-500 hover:text-red-500 text-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto">
              {/* Item 1 */}
              <div className="flex items-start gap-4 p-5 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                {/* Unread Dot */}
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>

                {/* Icon */}
                <Calendar size={20} className="text-blue-500 mt-1" />

                {/* Content */}
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    New appointment request submitted
                  </p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-4 p-5 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>

                <FileText size={20} className="text-purple-500 mt-1" />

                <div className="flex-1">
                  <p className="font-medium text-sm">
                    Student excuse letter awaiting review
                  </p>
                  <p className="text-xs text-muted-foreground">
                    30 minutes ago
                  </p>
                </div>
              </div>

              {/* Item 3 (Read example) */}
              <div className="flex items-start gap-4 p-5 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                {/* No unread dot = already read */}
                <span className="w-2 h-2 mt-2"></span>

                <BarChart3 size={20} className="text-green-500 mt-1" />

                <div className="flex-1">
                  <p className="font-medium text-sm">Monthly report is ready</p>
                  <p className="text-xs text-muted-foreground">
                    Yesterday at 4:12 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t dark:border-gray-700 text-center">
              <button className="text-blue-500 hover:underline text-sm">
                View All Notifications
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          navigationItems={navigationItems}
          location={location}
          setExpanded={setIsHovered}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden w-full relative">
          {/* Darken content on sidebar hover */}
          {expanded && (
            <div className="absolute inset-0 z-20 bg-black/50 pointer-events-none transition-opacity" />
          )}

          {/* Page Content */}
          <main
            className={`flex-1 overflow-auto p-4 md:p-8 z-1 bg-transparent transition-colors duration-300 ${expanded ? "blur-sm" : ""}`}
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
  );
}
