import { ElementType, ReactNode } from "react";

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
    <div className="rounded-xl border border-border bg-muted/20 p-4 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">
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
