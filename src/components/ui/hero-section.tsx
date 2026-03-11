interface HeroSectionProps {
  greeting: string;
  title: string;
  subtitle: string;
}

export function HeroSection({ greeting, title, subtitle }: HeroSectionProps) {
  return (
    <div className="animate-fade-in-down bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-primary-foreground py-8 md:py-12 -mx-4 md:-mx-8 -mt-4 md:-mt-8 w-[calc(100%+2rem)] md:w-[calc(100%+4rem)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <p className="text-sm md:text-base opacity-90">{greeting}</p>
        <h1 className="text-2xl md:text-3xl font-bold mt-1">{title}</h1>
        <p className="text-sm md:text-base mt-2 opacity-75">{subtitle}</p>
      </div>
    </div>
  );
}
