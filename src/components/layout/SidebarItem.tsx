import { Link } from "react-router-dom";

interface Props {
  item: {
    label: string;
    href: string;
    icon: React.ReactNode;
  };
  active: boolean;
}

export default function SidebarItem({ item, active }: Props) {
  return (
    <Link
      to={item.href}
      className={`sidebar-icon-tilt group flex items-center gap-3 rounded-xl px-3 py-3
      transition-all duration-200 hover:shadow-sm
      ${
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
      }`}
    >
      <div
        className="
        flex items-center justify-center min-w-[24px]
        transition-transform duration-200
        group-hover:rotate-6 group-hover:scale-110
        "
      >
        {item.icon}
      </div>

      <span
        className="
        opacity-0
        translate-x-[-6px]
        group-hover:opacity-100
        group-hover:translate-x-0
        transition-all duration-200 hover:shadow-sm
        whitespace-nowrap
        "
      >
        {item.label}
      </span>
    </Link>
  );
}