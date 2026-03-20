export default function AppFooter() {
  return (
    <footer className="relative w-full overflow-hidden border-t border-primary/20 bg-gradient-to-r from-white/55 via-white/40 to-primary/10 backdrop-blur-xl dark:border-white/10 dark:from-white/[0.05] dark:via-white/[0.04] dark:to-primary/15">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-primary/10 to-transparent dark:from-primary/12" />
      </div>

      <div className="relative flex min-h-[56px] w-full flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between md:px-5 xl:px-6">
        <p className="text-xs font-medium text-foreground/75 sm:text-sm dark:text-white/75">
          © 1998–2026 Polytechnic University of the Philippines
        </p>

        <div className="flex items-center gap-3 text-xs sm:text-sm">
          <a
            href="/terms"
            className="text-foreground/70 transition-colors duration-200 hover:text-primary dark:text-white/70 dark:hover:text-white"
          >
            Terms of Service
          </a>
          <span className="text-foreground/30 dark:text-white/30">|</span>
          <a
            href="/privacy"
            className="text-foreground/70 transition-colors duration-200 hover:text-primary dark:text-white/70 dark:hover:text-white"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}