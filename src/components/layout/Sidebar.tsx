import SidebarItem from "./SidebarItem";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navigationItems: NavItem[];
  location: any;
  setIsHovered: (value: boolean) => void;
}

export default function Sidebar({
  navigationItems,
  location,
  setIsHovered,
}: SidebarProps) {
  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="
      group
      relative
      flex flex-col
      bg-background/95 backdrop-blur-md
      border-r border-border
      w-[72px] hover:w-[260px] will-change-[width]
      transition-all duration-300 ease-in-out
      z-30
      "
    >
      <nav className="flex flex-col gap-2 p-3 mt-2">
        {navigationItems.map((item) => (
          <SidebarItem
            key={item.href}
            item={item}
            active={location.pathname.startsWith(item.href)}
          />
        ))}
      </nav>
    </aside>
  );
}
