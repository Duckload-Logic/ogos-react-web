import { useState, useEffect } from "react";
import { Check, AlertCircle, ChevronDown, Lock } from "lucide-react";
import { useToast } from "@/context";
import { cn } from "@/lib/utils";

interface Section {
  id: number;
  title: string;
  key: string;
}

interface SectionProgressProps {
  sections: Section[];
  currentSection: number;
  sectionsWithErrors: number[];
  visitedSections: number[];
  onNavigate: (sectionId: number) => void;
  calculateCompletion?: (sectionId: number) => number;
  lastSaved?: string;
}

export function SectionProgress({
  sections,
  currentSection,
  sectionsWithErrors,
  visitedSections,
  onNavigate,
  calculateCompletion,
  lastSaved,
}: SectionProgressProps) {
  const { triggerToast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shakingSection, setShakingSection] = useState<number | null>(null);

  useEffect(() => {
    const styleId = "section-progress-shake";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        @keyframes subtle-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-subtle-shake {
          animation: subtle-shake 0.3s ease-in-out;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const isSectionFinished = (id: number) => {
    const hasError = sectionsWithErrors.includes(id);
    const completionPercent = calculateCompletion ? calculateCompletion(id) : 0;
    const wasVisited = visitedSections.includes(id);
    return !hasError && completionPercent === 100 && wasVisited;
  };

  const isNavigable = (id: number) => {
    if (id === currentSection) return true;
    if (id < currentSection && visitedSections.includes(id)) return true;
    for (let i = 1; i < id; i++) {
      if (!isSectionFinished(i)) return false;
    }
    return true;
  };

  const handleSectionClick = (id: number) => {
    if (id === currentSection) return;
    if (isNavigable(id)) {
      setIsMobileMenuOpen(false);
      onNavigate(id);
    } else {
      setShakingSection(id);
      triggerToast("Please complete the previous sections first.");
      setTimeout(() => setShakingSection(null), 300);
    }
  };

  const currentSectionItem =
    sections.find((s) => s.id === currentSection) || sections[0];

  return (
    <div className="mb-6 select-none">
      <div className="w-full">
        {/* === Mobile View === */}
        <div className="relative py-2 md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "flex w-full items-center justify-between rounded-2xl border",
              "border-neutral-200 bg-neutral-100 p-4 shadow-sm",
              "dark:border-neutral-800 dark:bg-neutral-900",
            )}
          >
            <div className="flex flex-col text-left">
              <span className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Section {currentSection} of {sections.length}
              </span>
              <span className="max-w-[200px] truncate text-sm font-bold text-foreground">
                {currentSectionItem.title.split(". ")[1] ||
                  currentSectionItem.title}
              </span>
            </div>
            <ChevronDown
              className={cn(
                "h-5 w-5 text-muted-foreground transition-transform",
                "duration-300",
                isMobileMenuOpen && "rotate-180",
              )}
            />
          </button>

          {isMobileMenuOpen && (
            <div
              className={cn(
                "animate-in fade-in slide-in-from-top-2 absolute left-0",
                "right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border",
                "border-neutral-200 bg-white shadow-xl dark:border-neutral-800",
                "dark:bg-neutral-900",
              )}
            >
              {sections.map((section) => {
                const active = currentSection === section.id;
                const finished = isSectionFinished(section.id);
                const navigable = isNavigable(section.id);
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={cn(
                      "flex w-full items-center justify-between p-4",
                      "text-left transition-colors",
                      active
                        ? "bg-primary/5 font-bold text-primary"
                        : cn(
                            "text-muted-foreground hover:bg-neutral-50",
                            "dark:hover:bg-white/5",
                          ),
                      !navigable && !active && "cursor-not-allowed opacity-30",
                    )}
                  >
                    <span className="text-sm">
                      {section.id}.{" "}
                      {section.title.split(". ")[1] || section.title}
                    </span>
                    {finished ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : !navigable && !active ? (
                      <Lock className="h-3.5 w-3.5 opacity-40" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* === Desktop Professional Segmented Bar === */}
        <div className="hidden md:block">
          <div className="mb-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                Form Progress
              </h2>
              {lastSaved && (
                <span className="text-[10px] italic text-muted-foreground/40">
                  Draft saved {lastSaved}
                </span>
              )}
            </div>
            <div
              className={cn(
                "flex items-center gap-4 text-[10px] font-bold uppercase",
                "tracking-wider text-muted-foreground/60",
              )}
            >
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary" /> Active
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500" /> Complete
              </div>
            </div>
          </div>

          <div
            className={cn(
              "flex w-full overflow-hidden rounded-2xl border",
              "border-neutral-200 bg-neutral-100/50 shadow-sm",
              "dark:border-neutral-800 dark:bg-neutral-900/50",
            )}
          >
            {sections.map((section, index) => {
              const active = currentSection === section.id;
              const finished = isSectionFinished(section.id);
              const hasError = sectionsWithErrors.includes(section.id);
              const navigable = isNavigable(section.id);
              const isShaking = shakingSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={cn(
                    "relative flex flex-1 items-center justify-center",
                    "gap-2.5 border-r border-neutral-200 py-4.5 px-4",
                    "transition-all last:border-r-0 dark:border-neutral-800",
                    active
                      ? "bg-white text-foreground dark:bg-neutral-800"
                      : cn(
                          "text-muted-foreground hover:bg-white/50",
                          "dark:hover:bg-neutral-800/50",
                        ),
                    !navigable && !active
                      ? "cursor-not-allowed opacity-30"
                      : "cursor-pointer",
                    isShaking && "animate-subtle-shake bg-destructive/5",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-6 w-6 flex-shrink-0 items-center",
                      "justify-center rounded-lg border text-[11px]",
                      "font-bold",
                      active
                        ? "border-primary bg-primary text-white"
                        : finished
                          ? "border-green-500/20 bg-green-500/10 text-green-600"
                          : "bg-neutral-200/50 dark:border-neutral-700",
                      !active && !finished && "text-muted-foreground",
                    )}
                  >
                    {finished ? (
                      <Check
                        className="h-3.5 w-3.5"
                        strokeWidth={4}
                      />
                    ) : (
                      section.id
                    )}
                  </div>

                  <span
                    className={cn(
                      "text-[11px] font-bold uppercase tracking-tight",
                      active ? "opacity-100" : "opacity-60",
                    )}
                  >
                    {section.title.split(". ")[1] || section.title}
                  </span>

                  {!navigable && !active && (
                    <Lock className="ml-1 h-3 w-3 opacity-40" />
                  )}
                  {hasError && (
                    <AlertCircle className="ml-1 h-3 w-3 text-orange-500" />
                  )}

                  {active && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
