import { useState, useEffect } from "react";
import { Check, AlertCircle, ChevronDown, Lock } from "lucide-react";
import { useToast } from "@/context";

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
        <div className="md:hidden py-2 relative">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm"
          >
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-0.5">
                Section {currentSection} of {sections.length}
              </span>
              <span className="text-sm font-bold text-foreground truncate max-w-[200px]">
                {currentSectionItem.title.split(". ")[1] || currentSectionItem.title}
              </span>
            </div>
            <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isMobileMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2">
              {sections.map((section) => {
                const active = currentSection === section.id;
                const finished = isSectionFinished(section.id);
                const navigable = isNavigable(section.id);
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={`
                      w-full flex items-center justify-between p-4 text-left transition-colors
                      ${active ? "bg-primary/5 text-primary font-bold" : "text-muted-foreground hover:bg-neutral-50 dark:hover:bg-white/5"}
                      ${!navigable && !active ? "opacity-30 cursor-not-allowed" : ""}
                    `}
                  >
                    <span className="text-sm">
                      {section.id}. {section.title.split(". ")[1] || section.title}
                    </span>
                    {finished ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : !navigable && !active ? (
                      <Lock className="w-3.5 h-3.5 opacity-40" />
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* === Desktop Professional Segmented Bar === */}
        <div className="hidden md:block">
           <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-3">
                 <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Form Progress</h2>
                 {lastSaved && <span className="text-[10px] text-muted-foreground/40 italic">Draft saved {lastSaved}</span>}
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> Active</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /> Complete</div>
              </div>
           </div>

           <div className="flex w-full bg-neutral-100/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
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
                    className={`
                      flex-1 relative flex items-center justify-center gap-2.5 px-4 py-4.5 transition-all
                      border-r last:border-r-0 border-neutral-200 dark:border-neutral-800
                      ${active ? "bg-white dark:bg-neutral-800 text-foreground" : "text-muted-foreground hover:bg-white/50 dark:hover:bg-neutral-800/50"}
                      ${!navigable && !active ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                      ${isShaking ? "animate-subtle-shake bg-destructive/5" : ""}
                    `}
                  >
                    <div className={`
                        flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-bold border
                        ${active ? "bg-primary border-primary text-white" : 
                          finished ? "bg-green-500/10 border-green-500/20 text-green-600" :
                          "bg-neutral-200/50 dark:border-neutral-700 text-muted-foreground"}
                    `}>
                        {finished ? <Check className="w-3.5 h-3.5" strokeWidth={4} /> : section.id}
                    </div>
                    
                    <span className={`text-[11px] font-bold tracking-tight uppercase ${active ? "opacity-100" : "opacity-60"}`}>
                        {section.title.split(". ")[1] || section.title}
                    </span>

                    {!navigable && !active && <Lock className="w-3 h-3 ml-1 opacity-40" />}
                    {hasError && <AlertCircle className="w-3 h-3 ml-1 text-orange-500" />}

                    {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                  </button>
                );
              })}
           </div>
        </div>
      </div>
    </div>
  );
}
