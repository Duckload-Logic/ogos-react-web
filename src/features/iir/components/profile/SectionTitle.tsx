export default function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-12 bg-primary rounded-full" />
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">
        {title}
      </h3>
    </div>
  );
}
