export default function AppFooter() {
  return (
    <div className="flex w-full justify-center items-center">
      <footer className="w-[80%] px-8 border-t bg-primary backdrop-blur-lg rounded-t-lg text-primary-foreground">
        <div className="flex min-h-[68px] w-full items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
          <p className="text-sm font-medium">
            © 1998–2026 Polytechnic University of the Philippines
          </p>

          <div className="flex items-center gap-4 text-sm">
            <a href="/terms" className="transition hover:text-white/80">
              Terms of Service
            </a>
            <span className="text-white/50">|</span>
            <a href="/privacy" className="transition hover:text-white/80">
              Privacy Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
