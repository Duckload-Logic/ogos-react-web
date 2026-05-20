import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth, useUI } from "@/context";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  FileCode2,
  Settings2,
  BookOpen,
  LogOut,
  Menu,
  X,
  Cpu,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode } = useUI();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Client Manager",
      path: "/developer/dashboard",
      icon: <Settings2 size={20} />,
    },
    {
      name: "Documentation",
      path: "/developer/docs",
      icon: <FileCode2 size={20} />,
    },
    { name: "Guides", path: "/developer/guides", icon: <BookOpen size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/developer");
  };

  return (
    <div className="flex min-h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {!sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-border bg-card transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:translate-x-0`}
      >
        <div className="flex h-20 items-center border-b border-border px-6">
          <Link
            to="/"
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Cpu className="size-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              SD <span className="italic text-primary">Service</span>
            </span>
          </Link>
        </div>

        <nav className="space-y-1 overflow-y-auto p-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all duration-200 ${
                location.pathname === item.path
                  ? "border border-primary/20 bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span
                className={`transition-transform group-hover:scale-110 ${location.pathname === item.path ? "text-primary" : ""}`}
              >
                {item.icon}
              </span>
              <span className="text-sm font-semibold">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full space-y-4 border-t border-border bg-card/80 p-4 backdrop-blur-sm">
          <div className="relative">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-destructive transition-all hover:bg-destructive/10"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="bg-grid relative flex max-h-screen min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-background via-transparent to-background" />

        {/* Topbar */}
        <header className="sticky top-0 z-40 mx-4 mt-2 flex h-20 items-center justify-between rounded-3xl rounded-tl-none rounded-tr-none border-b border-glass-border bg-glass-bg px-6 shadow-lg backdrop-blur-glass">
          <div className="flex items-center gap-4">
            <button
              className="rounded-lg bg-muted/50 p-2 text-muted-foreground hover:text-foreground lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden items-center gap-2 text-xs font-bold uppercase text-muted-foreground/60 lg:flex">
              Service <span className="text-border">/</span>{" "}
              {menuItems.find((i) => i.path === location.pathname)?.name ||
                "Dashboard"}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
            <div className="mx-1 h-8 w-px bg-border" />
            <div className="flex items-center gap-3 px-1">
              <div className="hidden text-right sm:block">
                <div className="flex items-center gap-2">
                  <User size={20} />
                  <p className="text-xs font-bold tracking-tight">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
