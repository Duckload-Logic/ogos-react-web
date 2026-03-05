import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, ChevronRight } from "lucide-react";

export interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color: string;
}

interface QuickActionsGridProps {
  actions: QuickAction[];
  title?: string;
  animationDelay?: string;
}

export function QuickActionsGrid({
  actions,
  title = "Quick Actions",
  animationDelay = "0.15s",
}: QuickActionsGridProps) {
  return (
    <div
      className="animate-fade-in-up mb-6"
      style={{ animationDelay, animationFillMode: "both" }}
    >
      <h2 className="text-base font-semibold text-foreground mb-3">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Link key={index} to={action.to}>
            <Card
              className="animate-fade-in-scale group hover:shadow-md transition-all duration-300 cursor-pointer"
              style={{
                animationDelay: `${0.2 + index * 0.05}s`,
                animationFillMode: "both",
              }}
            >
              <CardContent className="py-4 px-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
