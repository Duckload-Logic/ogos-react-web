import Header from "@/components/layout/Header";
import NotificationModal from "@/components/notifications/NotificationModal";
import AppFooter from "@/components/common/AppFooter";
import Toast from "@/components/ui/Toast";
import { NAV_CONFIG, roleMap } from "@/config/navigation";

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

  const { data: latestDocument, isLoading: isLatestDocumentLoading } =
    useGetLatestStatement("terms");
  const { data: userConsent, isLoading: isUserConsentLoading } =
    useCheckUserConsent(latestDocument?.id);
  const { mutate: giveConsent } = useGiveConsent();

  // pages excluded from consent modal
  const excludedPaths = ["/terms", "/privacy"];
  const currentPath = location.pathname;
  const isExcluded = excludedPaths.includes(currentPath);

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
    if (!user || !user.role?.id) return [];

    const roleKey = roleMap[user.role.id];
    if (!roleKey) return [];

    const roleData = NAV_CONFIG.find((config) => !!config[roleKey]);

    return roleData ? roleData[roleKey] : [];
  }, [user]);

  const getRoleLabel = () => {
    if (!user) return "";
    if (user.role?.id === 3) return "Super Admin Account";
    if (user.role?.id === 2) return "Admin Account";
    return "Student Account";
  };

  const currentRole =
    user?.role?.id === 2 || user?.role?.id === 3 ? "admin" : "student";

  const mustAcceptTerms =
    !isUserConsentLoading && userConsent?.accepted === false && !isExcluded;
  useEffect(() => {
    if (!user) return;
    setTermsOpen(mustAcceptTerms);
  }, [user, mustAcceptTerms]);

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
    console.log("handleAcceptTerms called", {
      user: user?.id,
      docId: latestDocument?.id,
    });
    if (!user || !latestDocument?.id) {
      triggerToast("Document not ready. Please try again.");
      return;
    }
    giveConsent(
      { type: "terms", docId: latestDocument.id },
      {
        onSuccess: () => {
          console.log("Consent mutation succeeded");
          setTermsOpen(false);
          triggerToast("Terms and Conditions accepted.");
        },
        onError: (error) => {
          console.error("Consent mutation failed:", error);
          triggerToast("Failed to accept terms. Please try again.");
        },
      },
    );
  };

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col overflow-hidden bg-background animate-in fade-in duration-300">
        {!userConsent?.accepted && (
          <ConsentModal
            open={termsOpen}
            role={currentRole}
            onAccept={handleAcceptTerms}
          />
        )}

        <div
          ref={contentRef}
          className={`flex min-h-0 flex-1 flex-col ${
            termsOpen ? "pointer-events-none select-none blur-[3px]" : ""
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

          <div className="flex min-h-0 flex-1 w-full">
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
              {expanded && !termsOpen && (
                <div className="absolute inset-0 z-0 bg-black/10 backdrop-blur-sm animate-in fade-in duration-200 pointer-events-none" />
              )}

              <div
                className={`relative z-10 flex h-full flex-col overflow-y-auto transition-all duration-300 ${
                  expanded && !termsOpen ? "blur-sm" : ""
                }`}
              >
                <main className="flex-1 bg-transparent p-4 md:p-8 animate-in fade-in slide-in-from-bottom-2">
                  {children}
                </main>
              </div>
            </div>
          </div>
        </div>

        <Toast toasts={toasts} />
      </div>
    </ErrorBoundary>
  );
}
