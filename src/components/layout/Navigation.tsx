import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  MoreHorizontal,
  Settings,
  LogOut,
  ShieldCheck,
  Gavel,
  ChevronRight,
  ChevronLeft,
  Pin,
  PinOff,
} from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDebouncedCallback } from "@/hooks/useDebounce";
import { useUI } from "@/context";
import { UISettingsModal } from "@/components/shared/UISettingsModal";

const HOME_HREF = "/";
const SETTINGS_HREF = "/settings";

function NavItem({
  item,
  active,
  variant = "desktop",
  isExpanded = false,
  onClick,
}: {
  item: { label: string; href: string; icon: React.ReactNode };
  active: boolean;
  variant?: "desktop" | "mobile-bottom" | "mobile-drawer";
  isExpanded?: boolean;
  onClick?: () => void;
}) {
  if (variant === "mobile-bottom") {
    return (
      <Link
        to={item.href}
        onClick={onClick}
        className={`flex flex-col items-center p-2 group ${active ? "text-primary" : "text-muted-foreground"
          }`}
      >
        <div className="w-6 h-6 flex items-center justify-center transition-transform group-hover:scale-110">
          {item.icon}
        </div>
      </Link>
    );
  }

  if (variant === "mobile-drawer") {
    return (
      <Link
        to={item.href}
        onClick={onClick}
        className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${active
          ? "bg-primary text-primary-foreground"
          : "bg-muted/50 hover:bg-muted"
          }`}
      >
        <div className="w-6 h-6 flex items-center justify-center">
          {item.icon}
        </div>
        <span className="font-medium">{item.label}</span>
      </Link>
    );
  }

  // Desktop variant
  return (
    <Link
      to={item.href}
      onClick={onClick}
      className={`sidebar-icon-tilt group flex items-center gap-3 rounded-xl px-3 py-3
      transition-all duration-200 hover:shadow-sm
      ${active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
        }`}
    >
      <div
        className={`flex items-center justify-center w-6 shrink-0 transition-transform duration-200
        ${isExpanded ? "scale-110" : ""}`}
      >
        {item.icon}
      </div>

      <span
        className={`transition-all duration-200 whitespace-nowrap overflow-hidden
        ${isExpanded ? "opacity-100 translate-x-0 w-auto" : "opacity-0 translate-x-[-3px] w-0"}`}
      >
        {item.label}
      </span>
    </Link>
  );
}

export default function Navigation({
  navigationItems,
  location,
  user,
  handleLogout,
  role,
  roleLabel,
}: {
  navigationItems: any[];
  location: any;
  user: any;
  handleLogout: () => void;
  role: string;
  roleLabel: string;
}) {
  const {
    sidebarPinned,
    toggleSidebarPinned,
    sidebarHovered,
    setSidebarHovered,
  } = useUI();

  const isExpanded = sidebarPinned || sidebarHovered;
  const isMobile = useIsMobile();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"menu" | "settings">("menu");
  const [uiSettingsOpen, setUiSettingsOpen] = useState(false);
  const isActive = (item: any) => {
    if (
      location.pathname === item.href ||
      location.pathname === `${item.href}/`
    ) {
      return true;
    }

    const isRootPath = ["/admin", "/student", "/superadmin", "/"].includes(
      item.href,
    );
    if (isRootPath) {
      return false;
    }

    return location.pathname.startsWith(`${item.href}/`);
  };

  const debouncedSetHovered = useDebouncedCallback((value: boolean) => {
    setSidebarHovered(value);
  }, 150);

  const handleMouseEnter = () => {
    debouncedSetHovered(true);
  };

  const handleMouseLeave = () => {
    debouncedSetHovered(false);
  };

  if (isMobile) {
    const homeItem = navigationItems.find((i) => i.href === HOME_HREF);
    const overflowItems = navigationItems.filter(
      (i) => i.href !== HOME_HREF && i.href !== SETTINGS_HREF,
    );

    const isOverflowActive = overflowItems.some((item) =>
      location.pathname.startsWith(item.href),
    );

    return (
      <>
        <nav className="fixt bottom-0 w-full bg-background border-t shrink-0 z-50">
          <div className="flex items-center justify-around h-16 px-2">
            {homeItem && (
              <NavItem
                item={homeItem}
                active={isActive(homeItem)}
                variant="mobile-bottom"
              />
            )}

            <button
              onClick={() => {
                setDrawerMode("menu");
                setOpenDrawer(true);
              }}
              className={`flex flex-col items-center p-2 group ${isOverflowActive ? "text-primary" : "text-muted-foreground"
                }`}
            >
              <MoreHorizontal className="w-6 h-6 group-aria-pressed:animate-spin transition-transform" />
            </button>
            <button
              onClick={() => {
                setDrawerMode("settings");
                setOpenDrawer(true);
              }}
              className={`flex flex-col items-center p-2 group ${location.pathname.includes(SETTINGS_HREF)
                ? "text-primary"
                : "text-muted-foreground"
                }`}
            >
              <Settings className="w-6 h-6 group-hover:rotate-45 transition-transform" />
            </button>
          </div>
        </nav>

        <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
          <DrawerContent className="p-4 pb-8 space-y-8">
            {drawerMode === "menu" ? (
              <div className="space-y-3">
                <p className="text-xs font-bold text-muted-foreground px-2">
                  NAVIGATION
                </p>
                {overflowItems.map((item) => {
                  return (
                    <NavItem
                      key={item.href}
                      item={item}
                      active={isActive(item)}
                      variant="mobile-drawer"
                      onClick={() => setOpenDrawer(false)}
                    />
                  );
                })}
              </div>
            ) : (
              <MobileSettingsContent
                user={user}
                role={role}
                roleLabel={roleLabel}
                onLogout={handleLogout}
                closeDrawer={() => setOpenDrawer(false)}
                onOpenUISettings={() => {
                  setOpenDrawer(false);
                  setUiSettingsOpen(true);
                }}
              />
            )}
          </DrawerContent>
        </Drawer>
        <UISettingsModal isOpen={uiSettingsOpen} onClose={() => setUiSettingsOpen(false)} />
      </>
    );
  }

  return (
    <div className="h-full flex items-center justify-center">
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative flex flex-col bg-glass-bg border border-glass-border border-l-0 shadow-lg transition-all duration-300 z-30 h-[95%] rounded-3xl rounded-tl-none rounded-bl-none overflow-x-hidden
        ${isExpanded ? "w-[16.25rem]" : "w-[4.5rem]"}`}
      >
        <nav className="flex flex-col gap-2 p-3 mt-2">
          {navigationItems.map((item) => {
            return (
              <NavItem
                key={item.href}
                item={item}
                active={isActive(item)}
                isExpanded={isExpanded}
                variant="desktop"
              />
            );
          })}
        </nav>

        {/* Pin Toggle (Desktop Only) - Balanced spacing */}
        <div className="mt-auto p-3 mb-2">
          <button
            onClick={toggleSidebarPinned}
            className={`sidebar-icon-tilt group flex items-center gap-3 rounded-xl px-3 py-3 w-full
            transition-all duration-200 hover:shadow-sm
            ${sidebarPinned
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            title={sidebarPinned ? "Unpin Sidebar" : "Pin Sidebar"}
          >
            <div className="flex items-center justify-center w-6 shrink-0">
              {sidebarPinned ? <PinOff size="1.25rem" /> : <Pin size="1.25rem" />}
            </div>
            {isExpanded && (
              <span className="font-medium whitespace-nowrap overflow-hidden w-auto animate-in fade-in slide-in-from-left-2 duration-200">
                {sidebarPinned ? "Unpin Sidebar" : "Pin Sidebar"}
              </span>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}

function MobileSettingsContent({
  user,
  role,
  roleLabel,
  onLogout,
  closeDrawer,
  onOpenUISettings,
}: any) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div
        onClick={() => {
          navigate(`/${role}/profile`);
          closeDrawer();
        }}
        className="flex items-center gap-4 p-2 cursor-pointer hover:bg-muted/50 rounded-xl transition"
      >
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{roleLabel}</p>
        </div>
      </div>
      <div className="border-t border-border my-2" />
      <div className="flex flex-col gap-2">
        <button
          onClick={onOpenUISettings}
          className="w-full flex items-center rounded-xl gap-3 px-4 py-3 text-sm hover:bg-muted transition"
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <a
          href="https://www.pup.edu.ph/terms/"
          target="_blank"
          className="w-full flex items-center rounded-xl gap-3 px-4 py-3 text-sm hover:bg-muted transition"
        >
          <Gavel size={16} />
          <span>Terms of Service</span>
        </a>
        <a
          href="https://www.pup.edu.ph/privacy/"
          target="_blank"
          className="w-full flex items-center rounded-xl gap-3 px-4 py-3 text-sm hover:bg-muted transition"
        >
          <ShieldCheck size={16} />
          <span>Privacy Policy</span>
        </a>
      </div>

      {/* Logout Action */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-3 p-4
          text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-xl font-bold transition"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}
