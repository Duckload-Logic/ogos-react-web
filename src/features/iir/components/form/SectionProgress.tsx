import { useState, useEffect } from "react";
import { Check, AlertCircle, ChevronDown, Lock } from "lucide-react";

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
  onToast?: (message: string) => void;
  lastSaved?: string;
}

export function SectionProgress({
  sections,
  currentSection,
  sectionsWithErrors,
  visitedSections,
  onNavigate,
  calculateCompletion,
  onToast,
  lastSaved,
}: SectionProgressProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shakingSection, setShakingSection] = useState<number | null>(null);

  // Add CSS keyframes for shake to document head if not exists (handled inline via classes or quick style tag)
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

  const isCompleteAndInteracted = (id: number) => {
    const hasError = sectionsWithErrors.includes(id);
    const hasInteracted = visitedSections.includes(id);
    const completionPercent = calculateCompletion ? calculateCompletion(id) : 0;

    // Valid if no errors and either interacted with or magically 100% (e.g., prefilled)
    if (!hasError && (hasInteracted || completionPercent === 100)) return true;
    return false;
  };

  const isNavigable = (id: number) => {
    if (visitedSections.includes(id)) return true;
    if (isCompleteAndInteracted(id)) return true;

    // Check if the previous section is complete and valid
    if (id > 1) {
      const prevId = id - 1;
      const isPrevComplete = isCompleteAndInteracted(prevId);
      if (isPrevComplete) return true;
    }
    return false;
  };

  const handleSectionClick = (id: number) => {
    if (id === currentSection) return;

    if (isNavigable(id)) {
      setIsMobileMenuOpen(false);
      onNavigate(id);
    } else {
      setShakingSection(id);
      if (onToast) onToast("Please complete the current section first.");
      setTimeout(() => setShakingSection(null), 300);
    }
  };

  const currentSectionItem =
    sections.find((s) => s.id === currentSection) || sections[0];

  return (
    <div className="mb-6">
      <div className="w-full">
        {lastSaved && (
          <span className="text-[10px] text-muted-foreground/60 bottom-1 pointer-events-none ">
            Draft saved at {lastSaved}
          </span>
        )}
        {/* === Mobile View === */}
        <div className="md:hidden py-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between text-left p-2 rounded-md hover:bg-muted/50 transition-colors"
          >
            <div>
              <p className="text-xs text-muted-foreground font-semibold">
                Step {currentSection} of {sections.length}
              </p>
              <h4 className="text-sm font-bold text-primary">
                {currentSectionItem.title}
              </h4>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isMobileMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Mobile Dropdown Menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg py-2 px-4 max-h-[60vh] overflow-y-auto animate-in slide-in-from-top-2">
              <div className="flex flex-col gap-1">
                {sections.map((section) => {
                  const active = currentSection === section.id;
                  const hasError = sectionsWithErrors.includes(section.id);
                  const complete =
                    isCompleteAndInteracted(section.id) && !hasError;
                  const navigable = isNavigable(section.id);
                  const isShaking = shakingSection === section.id;

                  return (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className={`flex items-center gap-3 p-3 text-left rounded-md transition-all ${
                        active
                          ? "bg-primary/10 border border-primary/20 shadow-inner"
                          : navigable
                            ? "hover:bg-muted focus:bg-muted"
                            : "opacity-60 cursor-not-allowed"
                      } ${isShaking ? "animate-subtle-shake bg-destructive/10" : ""}`}
                    >
                      <div className="flex-shrink-0 w-6 flex justify-center">
                        {active ? (
                          <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/30" />
                        ) : hasError ? (
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                        ) : complete ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : navigable ? (
                          <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <span
                        className={`text-sm flex-1 ${active ? "font-bold text-primary" : navigable ? "font-medium text-foreground" : "text-muted-foreground"}`}
                      >
                        {section.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* === Desktop View === */}
        <div className="hidden md:flex items-center justify-between py-4">
          <div className="flex w-full justify-between items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 -z-10" />

            {sections.map((section, index) => {
              const active = currentSection === section.id;
              const hasError = sectionsWithErrors.includes(section.id);
              const complete = isCompleteAndInteracted(section.id) && !hasError;
              const navigable = isNavigable(section.id);
              const isShaking = shakingSection === section.id;

              return (
                <div
                  key={section.id}
                  className="flex flex-col items-center group relative z-10 w-full"
                >
                  <button
                    onClick={() => handleSectionClick(section.id)}
                    className={`
                      relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 bg-card
                      ${isShaking ? "animate-subtle-shake border-destructive text-destructive bg-muted" : ""}
                      ${!isShaking && active ? "border-primary text-primary shadow-[0_0_12px_rgba(var(--primary),0.5)] scale-110" : ""}
                      ${!isShaking && !active && hasError ? "border-orange-500 text-orange-500 bg-orange-muted" : ""}
                      ${!isShaking && !active && !hasError && complete ? "border-green-500 text-green-500 bg-background" : ""}
                      ${!isShaking && !active && !hasError && !complete && navigable ? "border-muted-foreground text-muted-foreground hover:border-primary/50 hover:text-primary/50" : ""}
                      ${!isShaking && !active && !hasError && !complete && !navigable ? "border-muted bg-background text-muted-foreground cursor-not-allowed opacity-60" : ""}
                    `}
                  >
                    {hasError && !active ? (
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                    ) : complete && !active ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : !navigable && !active ? (
                      <Lock className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-sm font-semibold">
                        {section.id}
                      </span>
                    )}
                  </button>
                  <span
                    className={`mt-2 text-xs font-semibold max-w-[150px] text-center transition-colors h-10 flex items-start
                      ${active ? "text-primary" : hasError ? "text-orange-500" : navigable ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {section.title.split(". ")[1] || section.title}
                  </span>

                  {/* Progress Line Filler */}
                  {index < sections.length - 1 && (
                    <div
                      className={`absolute top-4 left-1/2 w-full h-[3px] -z-10 transition-colors
                        ${complete || active ? "bg-primary" : "bg-transparnt"}
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
