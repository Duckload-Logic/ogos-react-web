import NotificationBell from "@/components/notifications/NotificationBell";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ProfileDropdown from "@/components/ProfileDropdown";
import PUPLogo from "@/assets/images/PUPLogo.png";

interface HeaderProps {
  title?: string;
  user: any;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  handleLogout: () => void;
  getRoleLabel: () => string;
  showNotifications: boolean;
  setShowNotifications: (value: boolean) => void;
}

export default function Header({
  title,
  user,
  darkMode,
  setDarkMode,
  handleLogout,
  getRoleLabel,
  showNotifications,
  setShowNotifications,
}: HeaderProps)

{
  return (
    <header className="h-20 flex items-center justify-between px-6 border-b bg-background/80 backdrop-blur-lg sticky top-0 relative z-30">

      {/* Logo */}
      <div className="flex items-center gap-3">
       <img
          src={PUPLogo}
          className="w-8 h-8 rounded-full transition-transform duration-200 hover:scale-110"
        />
        <div className="flex flex-col text-xs">
          <p className="font-semibold">
            Polytechnic University of the Philippines – Taguig
          </p>
          
          <p className="
          text-muted-foreground">
            Online Guidance Office Services
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">
          Welcome back, {user?.firstName}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">

        <NotificationBell
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />

        <ThemeToggle
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <ProfileDropdown
          firstName={user?.firstName}
          lastName={user?.lastName}
          roleLabel={getRoleLabel()}
          profilePath="/admin/profile"
          onLogout={handleLogout}
        />

      </div>

    </header>
  );
}