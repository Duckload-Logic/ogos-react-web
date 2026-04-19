import { cn } from "@/lib/utils";
interface HeroSectionProps {
  greeting: string;
  title: string;
  subtitle: string;
}

export function HeroSection({ greeting, title, subtitle }: HeroSectionProps) {
  return (
    <div
      className={cn(
        "animate-fade-in-down -mx-4 -mt-4 w-[calc(100%+2rem)]",
        "bg-gradient-to-br from-primary via-primary/90 to-primary/80",
        "py-8 text-primary-foreground md:-mx-8 md:-mt-8",
        "md:w-[calc(100%+4rem)] md:py-12",
      )}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <p className="text-sm opacity-90 md:text-base">{greeting}</p>
        <h1 className="mt-1 text-2xl font-bold md:text-3xl">{title}</h1>
        <p className="mt-2 text-sm opacity-75 md:text-base">{subtitle}</p>
      </div>
    </div>
  );
}
