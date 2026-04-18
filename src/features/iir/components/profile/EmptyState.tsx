import { cn } from "@/lib/utils";
export default function EmptyState({ label }: { label: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-border bg-muted/20",
        "p-6 text-xs italic text-muted-foreground",
      )}
    >
      {label}
    </div>
  );
}
