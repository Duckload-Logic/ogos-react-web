import { Link } from "react-router-dom";

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

interface QuickActionsGridProps {
  actions: QuickAction[];
}

export default function QuickActionsGrid({ actions }: QuickActionsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {actions.map((action) => (
        <Link
          key={action.title}
          to={action.href}
          className="bg-card rounded-lg shadow border border-gray-200 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex gap-3">
            <div className="text-primary">
              {typeof action.icon === 'function' ? action.icon({size: 24}) : action.icon}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
