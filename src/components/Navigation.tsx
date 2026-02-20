import { act, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Navigation({
  navigationItems,
  location,
  setExpanded,
}: {
  navigationItems: any[];
  location: any;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const isMobile = useIsMobile();

  // 1. Lazy initializer: Read from localStorage immediately
  const [isHovered, setIsHovered] = useState(() => {
    const saved = localStorage.getItem("sidebarHovered");
    return saved ? JSON.parse(saved) : false;
  });

  // 2. Notify parent of state changes safely
  useEffect(() => {
    setExpanded(isHovered);
    localStorage.setItem("sidebarHovered", JSON.stringify(isHovered));
  }, [isHovered, setExpanded]);

  // Render bottom navigation for mobile
  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border">
        <div className="flex items-center justify-around h-16 px-2">
          {navigationItems.map((item) => {
            const activePage = location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  group relative flex flex-col items-center justify-center
                  p-2 transition-colors duration-200
                  min-w-14 h-14
                  ${
                    activePage
                      ? "text-primary bg-background rounded-full"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }
                `}
              >
                <div className="flex flex-col gap-2 items-center justify-center">
                  <div
                    className={`
                    transition-transform duration-300 ease-out
                    group-hover:scale-110
                    text-xl
                  `}
                  >
                    {item.icon}
                  </div>
                  {activePage && (
                    <div className="w-1 h-1 bg-primary rounded-full"></div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  // Render sidebar for desktop
  return (
    <>
      {/* Sidebar */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          fixed md:static z-40 h-full overflow-hidden
          transition-all duration-300 ease-in-out items-center
          border border-border bg-sidebar text-foreground
          ${isHovered ? "w-64" : "w-16"}
        `}
      >
        {/* Navigation */}
        <nav className="relative flex-1 py-4 text-sm font-medium overflow-visible">
          {navigationItems.map((item) => {
            const activePage =
              item.href === "/admin"
                ? location.pathname === "/admin" // Strict match for Home
                : location.pathname.startsWith(item.href); // Partial match for others

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  group relative flex items-center px-4 py-3
                  transition-colors duration-200 mx-2 my-2
                  ${activePage ? "bg-primary rounded-lg text-background" : ""}
                `}
              >
                {/* 1. Icon Anchor: This div stays the same width regardless of sidebar state */}
                <div className="flex items-center justify-center aspect-square w-3 h-3">
                  <div
                    className={`
                      transition-transform duration-300 ease-out
                      group-hover:rotate-[-10deg]
                      group-hover:scale-110
                      ${!activePage ? "group-hover:text-primary" : ""}
                    `}
                  >
                    {item.icon}
                  </div>
                </div>

                {/* 2. Label: Moved to a fixed left position so it doesn't push the icon */}
                <span
                  className={`
                    ml-6 whitespace-nowrap transition-all duration-300 ease-in-out
                    ${
                      isHovered
                        ? "opacity-100 translate-x-0"
                        : "opacity-0 -translate-x-4 pointer-events-none"
                    }
                    ${!activePage ? "group-hover:text-primary" : ""}
                  `}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
