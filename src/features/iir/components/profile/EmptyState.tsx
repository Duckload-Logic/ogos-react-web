export default function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border p-6 text-xs text-muted-foreground italic bg-muted/20">
      {label}
    </div>
  );
}
