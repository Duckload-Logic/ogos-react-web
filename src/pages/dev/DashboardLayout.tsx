import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
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
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode } = useUI();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Client Manager', path: '/dev/dashboard', icon: <Settings2 size={20} /> },
    { name: 'Documentation', path: '/dev/dashboard/docs', icon: <FileCode2 size={20} /> },
    { name: 'Guides', path: '/dev/dashboard/guides', icon: <BookOpen size={20} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate('/dev');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
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
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}
      >
        <div className="h-20 flex items-center px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Cpu className="text-primary-foreground size-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">SD <span className="text-primary italic">Service</span></span>
          </Link>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group ${location.pathname === item.path
                ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              <span className={`transition-transform group-hover:scale-110 ${location.pathname === item.path ? 'text-primary' : ''}`}>
                {item.icon}
              </span>
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 space-y-4 border-t border-border bg-card/80 backdrop-blur-sm">
          <div className="relative">

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-all font-semibold text-sm"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-grid max-h-screen">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-background via-transparent to-background" />

        {/* Topbar */}
        <header className="h-20 flex items-center justify-between px-6 bg-glass-bg border-b border-glass-border backdrop-blur-glass sticky top-0 z-40 rounded-3xl rounded-tl-none rounded-tr-none mx-4 mt-2 shadow-lg">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
              Service <span className="text-border">/</span> {menuItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            <div className="h-8 w-px bg-border mx-1" />
            <div className="flex items-center gap-3 px-1">
              <div className="text-right hidden sm:block">
                <div className="flex items-center gap-2">
                  <User size={20} />
                  <p className="text-xs font-bold tracking-tight">{user?.firstName} {user?.lastName}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 relative z-10">
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
