import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {actions.map((action) => (
        <Link
          key={action.title}
          to={action.href}
          className={cn(
            "rounded-lg border border-gray-200 bg-card p-4 shadow",
            "transition-shadow hover:shadow-md",
          )}
        >
          <div className="flex gap-3">
            <div className="text-primary">{action.icon}</div>
            <div>
              <h3 className="font-semibold text-foreground">{action.title}</h3>
              <p className="text-sm text-muted-foreground">
                {action.description}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
