import React, { useMemo, useState } from "react";
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
} from "lucide-react";
import { useAuth } from "@/context";
import PUPLogo from "@/assets/images/PUPLogo.png";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export default function Layout({ children, title }: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const expanded = isHovered;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigationItems: NavItem[] = useMemo(() => {
    if (!user) return [];

    if (user.roleId === 3) {
      return [
        { label: "Dashboard", href: "/frontdesk", icon: <Home size={20} /> },
        {
          label: "Review Excuses",
          href: "/frontdesk/review-excuses",
          icon: <FileText size={20} />,
        },
      ];
    }

    if (user.roleId === 2) {
      return [
        { label: "Dashboard", href: "/admin", icon: <Home size={20} /> },
        {
          label: "Student Records",
          href: "/admin/student-records",
          icon: <Users size={20} />,
        },
        {
          label: "Appointments",
          href: "/admin/appointments",
          icon: <Calendar size={20} />,
        },
        {
          label: "Review Excuses",
          href: "/admin/review-excuses",
          icon: <FileText size={20} />,
        },
        {
          label: "Reports",
          href: "/admin/reports",
          icon: <BarChart3 size={20} />,
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
      className={`flex h-screen overflow-hidden transition-colors duration-300 ${
        darkMode ? "bg-[#1A1A1A] text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed md:static z-40 h-full
          transition-all duration-300 ease-in-out
          ${expanded ? "w-64" : "w-16"}

          ${
            darkMode
              ? "bg-transparent backdrop-blur-md border-r border-white/10 text-gray-100"
              : "bg-primary text-primary-foreground"
          }
        `}
      >


        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-sidebar-border">
          <img src={PUPLogo} className="w-8 h-8 rounded-full" />
          {expanded && (
            <div className="text-xs leading-tight font-semibold">
              Polytechnic University of the Philippines – Taguig
              <div className="text-[10px] opacity-80">
                Online Guidance Office Services
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="relative flex-1 py-4 text-sm font-medium overflow-visible">
          {navigationItems.map((item) => {
            const active = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  group relative flex items-center gap-3 px-4 py-3
                  transition-colors duration-200
                  ${
                    darkMode
                      ? active
                        ? "bg-white/10 text-white"
                        : "hover:bg-white/5"
                      : active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent"
                  }
                `}
              >
                {/* Active Indicator */}
                <span
                  className={`
                    absolute left-0 top-0 h-full w-1 bg-sidebar-primary
                    transition-transform duration-300
                    ${active ? "scale-y-100" : "scale-y-0"}
                  `}
                />

                {/* Icon Animation */}
                <div
                  className="
                    transition-transform duration-300 ease-out
                    group-hover:rotate-[-10deg]
                    group-hover:scale-110
                  "
                >
                  {item.icon}
                </div>

                {expanded && <span>{item.label}</span>}

                {!expanded && (
                  <span
                    className="
                      absolute left-16 z-50 px-2 py-1 text-xs rounded
                      bg-sidebar-accent text-sidebar-accent-foreground
                      opacity-0 group-hover:opacity-100
                      pointer-events-none whitespace-nowrap
                      transition-opacity duration-200 delay-75
                    "
                  >
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Darken content on sidebar hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none transition-opacity" />
        )}

        {/* Header */}
        <header
          className={`
            h-16 flex items-center justify-between px-6
            relative z-20 transition-colors duration-300

            ${
              darkMode
                ? "bg-transparent backdrop-blur-md border-b border-white/10 text-gray-100"
                : "bg-primary text-primary-foreground shadow"
            }
          `}
      >

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

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 relative z-0 bg-transparent">
          {title && (
            <h1 className="text-3xl font-bold text-foreground mb-6">
              {title}
            </h1>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}