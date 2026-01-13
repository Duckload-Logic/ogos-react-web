import { Link, useLocation } from "react-router-dom";
import { User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context";
import PUPLogo from "@/assets/images/PUPLogo.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  // Don't show header on login and register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const navigationItems = [
    { label: "Home", href: "/student" },
    { label: "Schedule Appointment", href: "/student/schedule" },
    { label: "View Schedules", href: "/student/schedules" },
    { label: "Excuse Slip", href: "/student/excuse-slip" },
  ];

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      {/* Top Bar with Logo and Logout */}
      <div className="bg-primary px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo Section */}
          <Link to="/login" className="flex items-center gap-3 min-w-0">
            <div className="h-16 flex-shrink-0">
              <img
                src={PUPLogo}
                alt="PUPT-OGOS Logo"
                className="h-full object-contain"
              />
            </div>
            <div className="hidden sm:block min-w-0">
              <h1 className="text-base md:text-lg font-bold leading-tight truncate">
                PUPT Online Guidance Office Services
              </h1>
              <p className="text-xs md:text-sm opacity-90">
                Polytechnic University of the Philippines - Taguig
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0 flex-shrink-0">
            {navigationItems.map((item) => (
              <div key={item.href} className="group relative">
                <Link
                  to={item.href}
                  className="px-4 py-3 text-sm font-medium transition-colors duration-300 group-hover:bg-primary-dark/20 block whitespace-nowrap"
                >
                  {item.label}
                </Link>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-full"></div>
              </div>
            ))}
          </nav>

          {/* Right Section: Profile Display + Mobile Menu */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Profile Display with Logout */}
            <div className="hidden md:flex items-center gap-0">
              <div className="flex items-center gap-2 text-primary-foreground px-4 py-3 whitespace-nowrap">
                <User className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{user?.lastName || "User"}</span>
              </div>
              <button
                onClick={logout}
                className="hidden lg:flex group relative items-center gap-2 px-4 py-3 text-sm font-medium transition-colors duration-300 hover:bg-primary-dark/20 flex-shrink-0 whitespace-nowrap"
              >
                <LogOut className="w-4 h-4 flex-shrink-0" />
                <span>Logout</span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-full"></div>
              </button>
            </div>
            
            {/* Mobile Profile Display */}
            <div className="flex md:hidden items-center gap-2 text-primary-foreground px-4 py-3 whitespace-nowrap">
              <User className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium truncate">{user?.lastName || "User"}</span>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-primary-dark rounded transition-colors flex-shrink-0"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="lg:hidden bg-primary-dark px-4 py-4 space-y-2 border-t border-primary-dark">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="block px-4 py-3 text-base font-medium rounded transition-all duration-300 ease-out hover:bg-black/20 hover:translate-x-2"
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => {
              logout();
              setIsMenuOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-base font-medium rounded transition-all duration-300 ease-out hover:bg-black/20 hover:translate-x-2 text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </nav>
      )}
    </header>
  );
}
