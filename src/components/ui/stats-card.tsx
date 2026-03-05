import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  to: string;
  count: number;
  label: string;
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  animationDelay?: string;
}

export function StatsCard({
  to,
  count,
  label,
  icon: Icon,
  iconColor,
  bgColor,
  animationDelay = "0.1s",
}: StatsCardProps) {
  return (
    <Link to={to}>
      <Card
        className="animate-fade-in-up hover:shadow-md transition-shadow cursor-pointer"
        style={{ animationDelay, animationFillMode: "both" }}
      >
        <CardContent className="py-4 px-4 flex items-center gap-3">
          <div className={`p-2 rounded-lg ${bgColor}`}>
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
