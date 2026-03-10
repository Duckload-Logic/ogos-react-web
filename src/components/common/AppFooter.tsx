export default function AppFooter() {
  return (
    <footer className="w-full border-t border-[#8f1113] bg-[#8f1113] text-white">
      <div className="flex min-h-[68px] w-full items-center justify-between px-6 py-4 sm:px-8 lg:px-10">
        <p className="text-sm font-medium">
          © 1998–2026 Polytechnic University of the Philippines
        </p>

        <div className="flex items-center gap-4 text-sm">
          <a href="#" className="transition hover:text-white/80">
            Terms of Use
          </a>
          <span className="text-white/50">|</span>
          <a href="#" className="transition hover:text-white/80">
            Privacy Statement
          </a>
        </div>
      </div>
    </footer>
  );
}