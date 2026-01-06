import { Link, useLocation } from "react-router-dom";
import { User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context";
import PUPLogo from "@/assets/images/PUPLogo.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, username, logout } = useAuth();
  const location = useLocation();

  // Don't show header on login and register pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Schedule Appointment", href: "/schedule" },
    { label: "View Schedules", href: "/schedules" },
    { label: "Excuse Slip", href: "/excuse-slip" },
  ];

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-50 shadow-md">
      {/* Top Bar with Logo and Logout */}
      <div className="bg-primary px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3">
            <div className="h-16 flex-shrink-0">
              <img
                src={PUPLogo}
                alt="PUPT-OGOS Logo"
                className="h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base md:text-lg font-bold leading-tight">
                Polytechnic University
              </h1>
              <p className="text-xs md:text-sm opacity-90">
                of the Philippines - Taguig
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-3 py-2 text-sm font-medium hover:bg-primary-dark rounded transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section: Profile + Mobile Menu */}
          <div className="flex items-center gap-2">
            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 hover:bg-primary-dark rounded transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">{username || "User"}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg border z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-primary-dark rounded transition-colors"
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
              className="block px-4 py-3 text-base font-medium hover:bg-black/10 rounded transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {/* Mobile Profile */}
          <Link
            to="/profile"
            className="block px-4 py-3 text-base font-medium hover:bg-black/10 rounded transition-colors"
          >
            My Profile
          </Link>
        </nav>
      )}
    </header>
  );
}
