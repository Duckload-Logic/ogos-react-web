import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PUPLogo from "@/assets/images/PUPLogo.png";
import { is } from "zod/v4/locales";
import { set } from "zod";

export default function Sidebar(
  { navigationItems, location, setExpanded }: { navigationItems: any[], location: any, setExpanded: React.Dispatch<React.SetStateAction<boolean>> }
) {
  // 1. Lazy initializer: Read from localStorage immediately
  const [isHovered, setIsHovered] = useState(() => {
    const saved = localStorage.getItem('sidebarHovered');
    return saved ? JSON.parse(saved) : false;
  });

  // 2. Notify parent of state changes safely
  useEffect(() => {
    setExpanded(isHovered);
    localStorage.setItem('sidebarHovered', JSON.stringify(isHovered));
  }, [isHovered, setExpanded]);
  
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
        <nav className="relative flex-1 py-4  text-sm font-medium overflow-visible">
          {navigationItems.map((item) => {
            const active = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  group relative flex items-center px-4 py-3
                  transition-colors duration-200 mx-2 my-2
                  ${active ? "bg-primary rounded-lg text-background" : ""}
                `}
              >
                {/* 1. Icon Anchor: This div stays the same width regardless of sidebar state */}
                <div className="flex items-center justify-center aspect-square w-3 h-3">
                  <div
                    className={`
                      transition-transform duration-300 ease-out
                      group-hover:rotate-[-10deg]
                      group-hover:scale-110 
                      ${!active ? 'group-hover:text-primary' : ''}
                    `}
                  >
                    {item.icon}
                  </div>
                </div>

                {/* 2. Label: Moved to a fixed left position so it doesn't push the icon */}
                <span
                  className={`
                    ml-6 whitespace-nowrap transition-all duration-300 ease-in-out
                    ${isHovered 
                      ? "opacity-100 translate-x-0" 
                      : "opacity-0 -translate-x-4 pointer-events-none"}
                    ${!active ? 'group-hover:text-primary' : ''}
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
  ) 
}