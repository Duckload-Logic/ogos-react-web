import NotificationBell from "@/components/notifications/NotificationBell";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ProfileDropdown from "@/components/ProfileDropdown";

const LOGO_SRC = "/logo.svg";

interface HeaderProps {
  title?: string;
  user: any;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  handleLogout: () => void;
  getRoleLabel: () => string;
  showNotifications: boolean;
  setShowNotifications: (value: boolean) => void;
  isLoggedIn: boolean;
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
  isLoggedIn = true,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/20 bg-white/60 backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-950/55">
      <div className="mx-auto flex h-20 w-full items-center justify-between px-4 md:px-6 xl:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/15 blur-md" />
            <img
              src={LOGO_SRC}
              alt="Logo"
              className="relative h-12 w-12 rounded-full border border-white/40 bg-white/70 object-cover shadow-sm dark:border-white/10 dark:bg-white/10"
            />
          </div>

          <div className="hidden min-w-0 md:flex flex-col leading-tight">
            <p className="truncate text-sm font-semibold text-foreground">
              Polytechnic University of the Philippines – Taguig
            </p>
            <p className="truncate text-sm text-muted-foreground">
              Online Guidance Office Services
            </p>
          </div>
        </div>

        {isLoggedIn && (
          <div className="hidden lg:flex flex-col items-center text-center">
            <p className="text-sm font-semibold tracking-tight text-foreground">
              {title}
            </p>
            <p className="text-xs text-muted-foreground">
              Welcome back, {user?.firstName}
            </p>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* <NotificationBell
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          /> */}
          <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
          {isLoggedIn && (
            <div className="hidden md:block">
              <ProfileDropdown
                firstName={user?.firstName}
                lastName={user?.lastName}
                roleLabel={getRoleLabel()}
                profilePath="/admin/profile"
                onLogout={handleLogout}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}