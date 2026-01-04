import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigationItems = [
    { label: "Student Records", href: "/student-records" },
    { label: "Appointments", href: "/appointments" },
    { label: "View Schedule", href: "/view-schedule" },
    { label: "Review Excuses Slip", href: "/review-excuses" },
    { label: "Reports", href: "/reports" },
    { label: "Logs", href: "/logs" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 z-40 h-screen bg-primary text-primary-foreground flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 md:w-64"
        } overflow-hidden`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <img
              src="/PUPLogo.png"
              alt="PUP Logo"
              className="w-10 h-10 rounded-full"
            />
            <span className="hidden sm:inline">PUPT</span>
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 font-sans text-sm font-medium">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="px-6 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors block border-l-4 border-transparent hover:border-sidebar-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sidebar-foreground hover:bg-sidebar-accent rounded transition-colors text-left"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-primary text-primary-foreground shadow-md">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-primary-foreground/10 rounded transition-colors"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h2 className="text-xl font-semibold hidden md:block">
                PUP-Taguig Guidance Information System
              </h2>
            </div>
            <div className="text-sm opacity-90">Admin Account</div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            {title && (
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
