import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface QuickAction {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  color: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
  title?: string;
  animationDelay?: string;
}

export function QuickActions({
  actions,
  title = "Quick Actions",
  animationDelay = "0.15s",
}: QuickActionsProps) {
  return (
    <div
      className="animate-fade-in-up mb-6"
      style={{ animationDelay, animationFillMode: "both" }}
    >
      <h2 className="mb-3 text-base font-semibold text-foreground">{title}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.to}
          >
            <Card
              className={cn(
                "animate-fade-in-scale group cursor-pointer transition-all",
                "duration-300 hover:shadow-md",
              )}
              style={{
                animationDelay: `${0.2 + index * 0.05}s`,
                animationFillMode: "both",
              }}
            >
              <CardContent className="flex items-center gap-3 px-4 py-4">
                <div className={`rounded-lg p-2.5 ${action.color}`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className={cn(
                      "text-sm font-semibold text-foreground transition-colors",
                      "group-hover:text-primary",
                    )}
                  >
                    {action.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-all",
                    "group-hover:translate-x-1 group-hover:text-primary",
                  )}
                />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
