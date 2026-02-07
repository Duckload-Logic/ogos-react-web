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
    const saved = localStorage.getItem('theme');
    const isDark = saved ? saved === 'dark' : false;
    // Apply initial theme immediately
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return isDark;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
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
        { label: "Dashboard", href: "/frontdesk", icon: <Home size={ICON_SIZE} /> },
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
    <div
      className="flex flex-col h-screen overflow-hidden transition-colors duration-300"
    >
      {/* Header */}
      <header
        className="
          h-20 flex items-center justify-between px-6
          relative z-20 transition-colors duration-300
          border-b
        "
      >
  
        {/* Logo */}
        <div className="h-16 flex items-center gap-3 ml-[-8px] ">
          <img src={PUPLogo} className="w-8 h-8 rounded-full" />
            <div className="flex flex-col items-center leading-tight font-semibold hidden sm:block ">
              <p className="text-foreground">Polytechnic University of the Philippines – Taguig</p>
              <p className="text-[12px] text-muted-foreground">
                Online Guidance Office Services
              </p>
            </div>
        </div>
        
        <span className="text-sm opacity-90">{title}</span>

        <div className="flex items-center gap-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 hover:bg-primary-foreground/10 rounded transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Admin Profile Icon */}
          <div className="flex items-center gap-2">
            <UserCircle size={28} />
            <span className="text-sm hidden md:block">
              {getRoleLabel()}
            </span>
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

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar navigationItems={navigationItems} location={location} setExpanded={setIsHovered} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden w-full relative">
          {/* Darken content on sidebar hover */}
          {expanded && (
            <div className="absolute inset-0 z-20 bg-black/50 pointer-events-none transition-opacity" />
          )}

          {/* Page Content */}
          <main className={`flex-1 overflow-auto p-4 md:p-8 z-1 bg-transparent`}>
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