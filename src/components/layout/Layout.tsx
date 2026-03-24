import Header from "@/components/layout/Header";
import NotificationModal from "@/features/notifications/components/NotificationModal";

import Toast from "@/components/ui/Toast";
import { NAV_CONFIG } from "@/config/navigation";
import { Spinner } from "@/components/shared/Spinner";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

import { useAuth, useUI, PageMetadata } from "@/context";
import { ErrorBoundary } from "../shared/ErrorBoundary";
import ConsentModal from "@/features/consents/components/ConsentModal";
import { useGetLatestStatement } from "@/features/consents/hooks";
import useCheckUserConsent from "@/features/consents/hooks/useCheckUserConsent";
import { useGiveConsent } from "@/features/consents/hooks/useGiveConsent";
import Navigation from "./Navigation";
import SubHeader from "./SubHeader";
import { SpeechControl } from "../shared/SpeechControl";
import { AnimationStyles } from "../ui/animations";

interface LayoutProps {
  showHeader?: boolean;
  children?: React.ReactNode;
  title?: string;
  subTitle?: string;
  headerChildren?: React.ReactNode;
  isLoggedIn?: boolean;
  isLoading?: boolean;
  description?: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  headerActions?: React.ReactNode;
  headerStats?: React.ReactNode;
  showDate?: boolean;
}

export default function Layout({
  showHeader = true,
  children,
  title: propsTitle,
  subTitle: propsSubTitle,
  headerChildren,
  isLoggedIn = true,
  isLoading: propsIsLoading,
  description: propsDescription,
  badgeText: propsBadgeText,
  badgeIcon: propsBadgeIcon,
  headerActions: propsHeaderActions,
  headerStats: propsHeaderStats,
  showDate: propsShowDate,
}: LayoutProps) {
  const {
    sidebarExpanded: isHovered,
    setSidebarExpanded: setIsHovered,
    pageMetadata,
  } = useUI();

  // Merge props with context metadata (props take precedence)
  const title = propsTitle || pageMetadata.title;
  const description =
    propsDescription || propsSubTitle || pageMetadata.description;
  const badgeText = propsBadgeText || pageMetadata.badgeText;
  const badgeIcon = propsBadgeIcon || pageMetadata.badgeIcon;
  const headerActions = propsHeaderActions || pageMetadata.headerActions;
  const headerStats = propsHeaderStats || pageMetadata.headerStats;
  const showDate =
    propsShowDate !== undefined
      ? propsShowDate
      : (pageMetadata.showDate ?? false);
  const isLoading =
    propsIsLoading !== undefined
      ? propsIsLoading
      : (pageMetadata.isLoading ?? false);

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
  const mustAcceptTerms = !sessionAccepted && !isExcluded && !!user && isLoggedIn;

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

  const [grayscale, setGrayscale] = useState(() => {
    return localStorage.getItem("grayscale") === "true";
  });

  const [isDyslexic, setIsDyslexic] = useState(() => {
  const saved = localStorage.getItem("dyslexic");
  const enabled = saved === "true";
  
  // Apply immediately on load
  if (enabled) {
    document.body.classList.add("dyslexic-mode");
  }
  
  return enabled;
});

  const [showNotifications, setShowNotifications] = useState(false);
  const [toasts, setToasts] = useState<string[]>([]);
  const [termsOpen, setTermsOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const expanded = isHovered;

  const triggerToast = (message: string) => {
    setToasts((prev) => [...prev, message]);

    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 4000);
  };

  useEffect(() => {
  localStorage.setItem("dyslexic", String(isDyslexic));

  if (isDyslexic) {
    document.body.classList.add("dyslexic-mode");
  } else {
    document.body.classList.remove("dyslexic-mode");
  }
  }, [isDyslexic]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("grayscale", String(grayscale));
  }, [grayscale]);

  const handleLogout = () => {
    setIsHovered(false); // Reset sidebar state on logout
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

  useEffect(() => {
    // Reset sidebar expanded state on navigation to ensure overlay is dismissed
    if (isHovered) {
      setIsHovered(false);
    }
  }, [location.pathname, setIsHovered]);

  const currentRole: string =
    user?.roles.map((r) => {
      const key = r.toLowerCase().replace(" ", "");
      if (key === "superadmin") return "superadmin";
      if (key === "admin") return "admin";
      if (key === "student") return "student";
      return "";
    })[0] || "";

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
      <div
        className={`relative flex h-screen flex-col overflow-hidden bg-neutral-100 text-foreground dark:bg-neutral-950 ${
          grayscale ? "grayscale" : ""
        }`}
      >
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
          className={`relative z-10 flex min-h-0 flex-1 flex-col transition-all duration-300 transform-gpu ${
            termsOpen ? "pointer-events-none select-none opacity-40 grayscale-[0.5]" : ""
          }`}
        >
        <Header
          title={title}
          user={user}
          role={currentRole}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          grayscale={grayscale}
          setGrayscale={setGrayscale}
          handleLogout={handleLogout}
          getRoleLabel={getRoleLabel}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          isLoggedIn={isLoggedIn}
          isDyslexic={isDyslexic}
          setIsDyslexic={setIsDyslexic}
        />

          <NotificationModal
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            toasts={toasts}
          />

          <div className="flex flex-col-reverse md:flex-row min-h-0 w-full flex-1 bg-[radial-gradient(circle_at_bottom_left,rgba(220,38,38,0.1),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.1),transparent_28%)]">
            {isLoggedIn && (
              <Navigation
                navigationItems={navigationItems}
                location={location}
                isHovered={isHovered}
                setIsHovered={setIsHovered}
                user={user}
                handleLogout={handleLogout}
                roleLabel={getRoleLabel()}
              />
            )}

            <div className="relative min-w-0 flex-1 overflow-hidden">
              <div
                className="absolute inset-0 z-0 bg-[url('/src/assets/images/bg.png')]
               bg-cover bg-center bg-no-repeat opacity-[0.15] dark:opacity-10 transform-gpu"
              />
              <div className="relative z-10 flex h-full flex-col overflow-x-hidden overflow-y-auto">
                <main className="flex-1 p-4 md:p-6 lg:p-8">
                  {showHeader && (
                    <SubHeader
                      title={title || ""}
                      description={description || propsSubTitle}
                      badgeText={badgeText}
                      badgeIcon={badgeIcon}
                      headerActions={headerActions}
                      headerStats={headerStats}
                      showDate={showDate}
                    />
                  )}
                  {isLoading ? (
                    <div className="flex h-full w-full items-center justify-center min-h-[400px]">
                      <Spinner size="lg" />
                    </div>
                  ) : null}
                  <div className={isLoading ? "hidden" : "block"}>
                    {children || <Outlet />}
                  </div>
                </main>
              </div>

              {/* The Overlay: Handle both the dark tint and the blur here */}
              {expanded && isLoggedIn && !termsOpen && (
                <div
                  className="pointer-events-none absolute inset-0 z-20
                 bg-black/50 animate-in
                 fade-in duration-200"
                />
              )}
            </div>
          </div>
        </div>

        <Toast toasts={toasts} />
        <SpeechControl />
        <AnimationStyles />
      </div>
    </ErrorBoundary>
  );
}

/**
 * Hook for child pages to set layout metadata when using Shared Layout
 */
export function usePageMetadata(metadata: Partial<PageMetadata>) {
  const { setPageMetadata } = useUI();

  useEffect(() => {
    setPageMetadata((prev) => {
      // Shallow comparison of all metadata fields
      const hasChanged = Object.entries(metadata).some(([key, value]) => {
        return prev[key as keyof PageMetadata] !== value;
      });

      if (!hasChanged) return prev;
      return { ...prev, ...metadata };
    });

    // Clean up metadata when the component unmounts to prevent stale data
    // on the next page (e.g., persistent stats or actions)
    return () => {
      setPageMetadata({
        title: "",
        description: undefined,
        badgeText: undefined,
        badgeIcon: undefined,
        headerActions: undefined,
        headerStats: undefined,
        showDate: false,
        isLoading: false,
      });
    };
  }, [
    metadata.title,
    metadata.description,
    metadata.badgeText,
    metadata.showDate,
    metadata.isLoading,
    setPageMetadata,
  ]);
}