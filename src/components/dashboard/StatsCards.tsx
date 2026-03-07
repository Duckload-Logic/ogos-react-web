import { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
}

export default function StatsCards({ title, value, icon: Icon }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 500;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= value) {
        start = value;
        clearInterval(timer);
      }

      setCount(Math.floor(start));
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="bg-card border border-border rounded-md p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase font-bold text-muted-foreground tracking-widest">
            {title}
          </p>

          <p className="text-3xl font-black tabular-nums mt-1">
            {count}
          </p>
        </div>

        <div className="p-2 rounded-md bg-primary/10">
          <Icon className="size-5 text-primary" />
        </div>
      </div>
    </div>
  );
}