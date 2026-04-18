import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  to: string;
  count: number;
  label: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  animationDelay?: string;
}

export function StatsCard({
  to,
  count,
  label,
  icon: Icon,
  iconColor,
  bgColor,
  borderColor,
  animationDelay = "0.1s",
}: StatsCardProps) {
  return (
    <Link to={to}>
      <Card
        className={cn(
          "animate-fade-in-up cursor-pointer border-l-4 transition-shadow",
          "hover:shadow-md",
          borderColor,
        )}
        style={{ animationDelay, animationFillMode: "both" }}
      >
        <CardContent className="flex items-center gap-3 px-4 py-4">
          <div className={`rounded-lg p-2 ${bgColor}`}>
            <Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{count}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
