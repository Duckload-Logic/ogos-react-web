import Header from "@/components/layout/Header";
import NotificationModal from "@/components/notifications/NotificationModal";
import AppFooter from "@/components/common/AppFooter";
import Toast from "@/components/ui/Toast";
import { NAV_CONFIG } from "@/config/navigation";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/context";
import { ErrorBoundary } from "../shared";
import ConsentModal from "@/features/consents/components/ConsentModal";
import { useGetLatestStatement } from "@/features/consents/hooks";
import useCheckUserConsent from "@/features/consents/hooks/useCheckUserConsent";
import { useGiveConsent } from "@/features/consents/hooks/useGiveConsent";
import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  isLoggedIn?: boolean;
}

export default function Layout({
  children,
  title,
  isLoggedIn = true,
}: LayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sessionAccepted, setSessionAccepted] = useState(() => {
    // Check if they accepted during THIS specific browser session
    return sessionStorage.getItem("session_consent_accepted") === "true";
  });

  const excludedPaths = ["/terms", "/privacy"];
  const currentPath = location.pathname;
  const isExcluded = excludedPaths.includes(currentPath);
  const mustAcceptTerms =
    !sessionAccepted && !isExcluded && !!user && isLoggedIn;

  useEffect(() => {
    setTermsOpen(mustAcceptTerms);
  }, [mustAcceptTerms]);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    const isDark = saved ? saved === "dark" : false;

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    return isDark;
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [toasts, setToasts] = useState<string[]>([]);
  const [termsOpen, setTermsOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const expanded = isHovered;

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

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navigationItems = useMemo(() => {
    if (!user || user.roles.length === 0) return [];

    const roleKey = user.roles[0]?.toLowerCase().replace(" ", "");
    if (!roleKey) return [];

    const roleData = NAV_CONFIG.find((config) => !!config[roleKey]);

    return roleData ? roleData[roleKey] : [];
  }, [user]);

  const getRoleLabel = () => {
    if (!user) return "";
    if (
      user.roles.some((r) => r.toLowerCase().replace(" ", "") === "superadmin")
    )
      return "Super Admin Account";
    if (user.roles.some((r) => r.toLowerCase().replace(" ", "") === "admin"))
      return "Admin Account";
    return "Student Account";
  };

  const currentRole = user?.roles.some((r) => {
    const key = r.toLowerCase().replace(" ", "");
    return key === "admin" || key === "superadmin";
  })
    ? "admin"
    : "student";

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return;

    if (termsOpen) {
      node.setAttribute("inert", "");
      node.setAttribute("aria-hidden", "true");
    } else {
      node.removeAttribute("inert");
      node.removeAttribute("aria-hidden");
    }
  }, [termsOpen]);

  const handleAcceptTerms = () => {
    if (!user) {
      triggerToast("");
      return;
    }

    try {
      sessionStorage.setItem("session_consent_accepted", "true");

      setSessionAccepted(true);
      setTermsOpen(false);

      triggerToast("Terms and Conditions accepted.");
    } catch (err) {
      console.error("[Layout] Consent Update: ", err);
      triggerToast("Failed to accept terms. Please try again.");
    }
  };

  return (
    <ErrorBoundary>
      <div className="relative flex h-screen flex-col overflow-hidden bg-neutral-100 text-foreground dark:bg-neutral-950">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.08),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.06),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.10),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.07),transparent_24%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.14))] dark:bg-[linear-gradient(to_bottom,transparent,rgba(255,255,255,0.02))]" />
        </div>

        {mustAcceptTerms && (
          <ConsentModal
            open={termsOpen}
            role={currentRole}
            onAccept={handleAcceptTerms}
          />
        )}

        <div
          ref={contentRef}
          className={`relative z-10 flex min-h-0 flex-1 flex-col transition-all duration-300 transform-gpu ${termsOpen
              ? "pointer-events-none select-none opacity-40 grayscale-[0.5]"
              : ""
            }`}
        >
          <Header
            title={title}
            user={user}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            handleLogout={handleLogout}
            getRoleLabel={getRoleLabel}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            isLoggedIn={isLoggedIn}
          />

          <NotificationModal
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            toasts={toasts}
          />

          <div className="flex flex-col-reverse md:flex-row min-h-0 w-full flex-1">
            {isLoggedIn && (
              <Navigation
                navigationItems={navigationItems}
                location={location}
                setIsHovered={setIsHovered}
                user={user}
                handleLogout={handleLogout}
                roleLabel={getRoleLabel()}
              />
            )}

            <div className="relative min-w-0 flex-1 overflow-hidden">
              {/* The Overlay: Handle both the dark tint and the blur here */}
              {expanded && !termsOpen && (
                <div
                  className="pointer-events-none absolute inset-0 z-20
                 bg-black/20 animate-in
                 fade-in duration-200"
                />
              )}

              <div
                className="absolute inset-0 z-0 bg-[url('/src/assets/images/bg.png')]
               bg-cover bg-center bg-no-repeat opacity-[0.15] dark:opacity-10 transform-gpu"
              />
              <div className="relative z-10 flex h-full flex-col overflow-x-hidden overflow-y-auto">
                <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
              </div>
            </div>
          </div>
        </div>

        <Toast toasts={toasts} />
      </div>
    </ErrorBoundary>
  );
}
