import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  MoreHorizontal,
  Settings,
  LogOut,
} from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import NavItem from "./NavItem";

const HOME_HREF = "/";
const SETTINGS_HREF = "/settings";

export default function Navigation({
  navigationItems,
  location,
  setIsHovered,
  user,
  handleLogout,
  roleLabel,
}: {
  navigationItems: any[];
  location: any;
  setIsHovered: React.Dispatch<React.SetStateAction<boolean>>;
  user: any;
  handleLogout: () => void;
  roleLabel: string;
}) {
  const isMobile = useIsMobile();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"menu" | "settings">("menu");

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
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/20 bg-white/75 backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-950/80">
          <div className="mx-auto flex h-18 max-w-xl items-center justify-around px-2 py-2">
            {homeItem && (
              <NavItem
                item={homeItem}
                active={location.pathname === homeItem.href}
              />
            )}

            <button
              onClick={() => {
                setDrawerMode("menu");
                setOpenDrawer(true);
              }}
              className={`flex min-w-[64px] flex-col items-center justify-center rounded-2xl px-3 py-2 transition-all duration-200 ${
                isOverflowActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-white/60 hover:text-foreground dark:hover:bg-white/[0.06]"
              }`}
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>

            <button
              onClick={() => {
                setDrawerMode("settings");
                setOpenDrawer(true);
              }}
              className={`flex min-w-[64px] flex-col items-center justify-center rounded-2xl px-3 py-2 transition-all duration-200 ${
                location.pathname.includes(SETTINGS_HREF)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-white/60 hover:text-foreground dark:hover:bg-white/[0.06]"
              }`}
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </nav>

        <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
          <DrawerContent className="border-white/20 bg-white/85 p-4 pb-8 backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/90">
            {drawerMode === "menu" ? (
              <div className="space-y-4">
                <div className="px-2 pt-2">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Navigation
                  </p>
                </div>

                <div className="space-y-2">
                  {overflowItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setOpenDrawer(false)}
                      className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/60 p-4 shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/80 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.06]"
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/50 dark:border-white/10 dark:bg-white/[0.04]">
                        {item.icon}
                      </span>
                      <span className="font-medium text-foreground">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <MobileSettingsContent
                user={user}
                roleLabel={roleLabel}
                onLogout={handleLogout}
                closeDrawer={() => setOpenDrawer(false)}
              />
            )}
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative z-30 hidden h-full shrink-0 border-r border-white/20 bg-white/60 backdrop-blur-2xl transition-all duration-300 dark:border-white/10 dark:bg-white/[0.04] md:flex md:w-[84px] md:hover:w-[280px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.22),transparent_18%,transparent_82%,rgba(255,255,255,0.08))] dark:bg-[linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_20%,transparent_85%,rgba(255,255,255,0.03))]" />

      <div className="relative flex h-full w-full flex-col">
        <div className="px-3 pt-4">
          <div className="rounded-2xl border border-white/20 bg-white/55 p-2 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04]">
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <NavItem
                  key={item.href}
                  item={item}
                  active={location.pathname === item.href}
                />
              ))}
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MobileSettingsContent({
  user,
  roleLabel,
  onLogout,
  closeDrawer,
}: any) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <button
        onClick={() => {
          navigate("/admin/profile");
          closeDrawer();
        }}
        className="flex w-full items-center gap-4 rounded-2xl border border-white/20 bg-white/60 p-4 text-left shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/80 dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/[0.06]"
      >
        <Avatar className="h-12 w-12 border border-white/20 dark:border-white/10">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {user?.firstName?.charAt(0)}
            {user?.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs text-muted-foreground">{roleLabel}</p>
        </div>
      </button>

      <button
        onClick={onLogout}
        className="flex w-full items-center justify-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 font-semibold text-red-600 transition-all duration-200 hover:bg-red-500/15 dark:text-red-400"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}