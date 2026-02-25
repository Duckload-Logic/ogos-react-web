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
    <div className="flex items-center group">
      <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
      </div>
      <div className="ml-3">
        <p className="text-[10px] uppercase text-muted-foreground font-bold leading-none mb-1 group-hover:text-primary transition-colors">
          {label}
        </p>
        <p
          className={`text-sm font-medium text-card-foreground ${
            truncate ? "truncate max-w-[200px] sm:max-w-full" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
