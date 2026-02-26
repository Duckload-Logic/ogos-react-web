export default function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="group flex flex-col">
      <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground group-hover:text-primary transition-colors mb-1">
        {label}
      </span>
      <span className="text-xs font-medium text-card-foreground border-l-2 border-transparent group-hover:border-primary/30 pl-0 group-hover:pl-3 transition-all origin-left">
        {value || "---"}
      </span>
    </div>
  );
}
