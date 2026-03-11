const LOGO_SRC = "/logo.svg";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-[hsl(var(--border)/0.6)] px-6 py-8 sm:px-8 lg:min-h-full lg:border-b-0 lg:border-r lg:border-[hsl(var(--border)/0.6)] lg:px-10 lg:py-10">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.08),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.08),transparent_28%)]" />
      <div className="absolute -left-8 top-0 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-36 w-36 rounded-full bg-red-500/8 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-[hsl(var(--border)/0.7)] bg-[hsl(var(--background)/0.75)] shadow-[0_12px_30px_-16px_rgba(15,23,42,0.22)] backdrop-blur">
          <img src={LOGO_SRC} alt="Logo" className="h-10 w-10 object-contain" />
        </div>

        <div className="mb-4 w-fit rounded-full border border-[hsl(var(--primary)/0.25)] bg-[hsl(var(--background)/0.72)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur">
          Guidance Portal
        </div>

        <h1 className="max-w-sm text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h1>

        <p className="mt-4 max-w-md text-base leading-7 text-muted-foreground">
          {subtitle}
        </p>

        <div className="mt-8 h-px w-24 bg-gradient-to-r from-[hsl(var(--primary)/0.5)] to-transparent" />
      </div>
    </div>
  );
}