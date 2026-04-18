import { cn } from "@/lib/utils";
export default function QuickInfo({
  icon: Icon,
  label,
  value,
  truncate = false,
}: {
  icon: any;
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="group flex items-center">
      <div
        className={cn(
          "rounded-lg bg-muted p-2 transition-colors",
          "group-hover:bg-primary/10",
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 text-muted-foreground",
            "group-hover:text-primary",
          )}
        />
      </div>
      <div className="ml-3">
        <p
          className={cn(
            "mb-1 text-[10px] font-bold uppercase leading-none",
            "text-muted-foreground transition-colors",
            "group-hover:text-primary",
          )}
        >
          {label}
        </p>
        <p
          className={`text-sm font-medium text-card-foreground ${
            truncate ? "max-w-[200px] truncate sm:max-w-full" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
