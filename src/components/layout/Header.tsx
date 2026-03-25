import NotificationBell from "@/features/notifications/components/NotificationBell";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ProfileMenu from "./ProfileMenu";
import { Settings } from "lucide-react";
import { UISettingsModal } from "@/components/shared/UISettingsModal";
import { useState } from "react";

const LOGO_SRC = "/logo.svg";

interface HeaderProps {
  title?: string;
  user: any;
  role: string;
  handleLogout: () => void;
  getRoleLabel: () => string;
  showNotifications: boolean;
  setShowNotifications: (value: boolean) => void;
  isLoggedIn: boolean;
}

import { useUI } from "@/context/UIContext";

export default function Header({
  title,
  user,
  role,
  handleLogout,
  getRoleLabel,
  showNotifications,
  setShowNotifications,
  isLoggedIn = true,
}: HeaderProps) {
  const { darkMode, setDarkMode } = useUI();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="h-20 flex items-center justify-between px-6 bg-gradient-to-t from-primary/80 via-primary to-primary backdrop-blur-lg sticky top-0 z-30">
      <div className="flex items-center gap-3 text-primary-foreground">
        <img
          src={LOGO_SRC}
          alt="Logo"
          className="w-12 h-12 rounded-full transition-transform duration-200 hover:scale-110"
        />
        <div className="md:flex flex-col text-xs hidden gap-1">
          <p className="font-semibold">
            Polytechnic University of the Philippines – Taguig
          </p>
          <p className="text-primary-foreground/50">
            Online Guidance Office Services
          </p>
        </div>
      </div>

      {isLoggedIn && (
        <div className="text-center md:block">
          <p className="text-sm text-primary-foreground font-medium">{title}</p>
          <p className="text-xs text-primary-foreground/50">
            Welcome back, {user?.firstName}
          </p>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* <NotificationBell
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        /> */}
        {/* <button
          onClick={() => setSettingsOpen(true)}
          className="p-2 hover:bg-muted/30 rounded-lg transition-colors duration-300 text-primary-foreground"
          aria-label="UI Settings"
        >
          <Settings size={18} />
        </button> */}
        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        {isLoggedIn && (
          <div className="hidden md:block">
            <ProfileMenu
              firstName={user?.firstName}
              middleName={user?.middleName}
              lastName={user?.lastName}
              roleLabel={getRoleLabel()}
              profilePath={`/${role}/profile`}
              onLogout={handleLogout}
            />
          </div>
        )}
      </div>
      <UISettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </header>
  );
}