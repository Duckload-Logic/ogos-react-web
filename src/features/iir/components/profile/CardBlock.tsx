import { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function CardBlock({
  icon: Icon,
  title,
  children,
}: {
  icon?: ElementType;
  title?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-xl border border-border",
        "bg-muted/20 p-4 shadow-md transition-shadow hover:shadow-lg",
      )}
    >
      <div
        className={cn(
          "mb-3 flex items-center gap-2 text-[10px] font-bold uppercase",
          "tracking-wider text-muted-foreground",
        )}
      >
        {Icon && (
          // 3. Render the Icon directly
          <Icon className="h-4 w-4 text-primary" />
        )}
        {title && <span>{title}</span>}
      </div>
      {children}
    </div>
  );
}
