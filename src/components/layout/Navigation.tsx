import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/useIsMobile";
import {
  MoreHorizontal,
  Settings,
  LogOut,
  User,
  Minus,
  Plus,
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
        <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t">
          <div className="flex items-center justify-around h-16 px-2">
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
              className={`flex flex-col items-center p-2 group ${
                isOverflowActive
                  ? "text-muted-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <MoreHorizontal className="w-6 h-6 group-aria-pressed:animate-spin" />
            </button>

            <button
              onClick={() => {
                setDrawerMode("settings");
                setOpenDrawer(true);
              }}
              className={`flex flex-col items-center p-2 ${
                location.pathname.includes(SETTINGS_HREF)
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <Settings className="w-6 h-6" />
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
                {overflowItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setOpenDrawer(false)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-muted/50"
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
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
      className="group relative flex flex-col bg-background/95 border-r
        w-[72px] hover:w-[260px] transition-all duration-300 z-30"
    >
      <nav className="flex flex-col gap-2 p-3 mt-2">
        {navigationItems.map((item) => (
          <NavItem
            key={item.href}
            item={item}
            active={location.pathname === item.href}
          />
        ))}
      </nav>
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
      {/* Profile Section */}
      <div
        onClick={() => {
          navigate("/admin/profile");
          closeDrawer();
        }}
        className="flex items-center gap-4 p-2"
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

      {/* Logout Action */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-3 p-4
          text-red-500 bg-red-500/10 rounded-xl font-bold transition"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}
