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

  // Add CSS keyframes for shake to document head if not exists
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

    // Rule: must have no errors, be 100% complete, AND have been visited/confirmed by the user
    return !hasError && completionPercent === 100 && wasVisited;
  };

  const isNavigable = (id: number) => {
    if (id === currentSection) return true;
    if (id < currentSection && visitedSections.includes(id)) return true;

    // Moving forward: must have all previous sections finished (visited and 100%)
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
    <div className="mb-10 select-none">
      <div className="w-full">
        {/* === Mobile View === */}
        <div className="md:hidden pt-2 pb-6 relative">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full h-24 flex items-center justify-between px-8 rounded-[32px] bg-white/60 backdrop-blur-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:bg-neutral-900/60 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center gap-6">
               <span className="text-4xl font-black text-primary/10 tracking-tighter">
                    0{currentSection}
               </span>
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-primary font-black uppercase tracking-widest opacity-60 mb-0.5">
                  Current Step
                </span>
                <h4 className="text-base font-black text-foreground truncate max-w-[180px] tracking-tight">
                  {currentSectionItem.title.split(". ")[1] || currentSectionItem.title}
                </h4>
              </div>
            </div>
            <div className="p-2.5 rounded-2xl bg-neutral-100 dark:bg-white/5 transition-transform duration-300">
              <ChevronDown className={`w-6 h-6 text-muted-foreground ${isMobileMenuOpen ? "rotate-180" : ""}`} />
            </div>
          </button>

          {/* Mobile Card List Dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 z-50 mt-4 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                {sections.map((section) => {
                  const active = currentSection === section.id;
                  const finished = isSectionFinished(section.id);
                  const navigable = isNavigable(section.id);

                  return (
                    <button
                      key={section.id}
                      onClick={() => handleSectionClick(section.id)}
                      className={`
                        flex items-center gap-6 p-6 rounded-[32px] border transition-all text-left
                        ${active ? "bg-white dark:bg-neutral-900 border-primary shadow-2xl" : "bg-white/80 dark:bg-neutral-900/80 border-transparent shadow-md"}
                        ${!navigable && !active ? "opacity-30 grayscale pointer-events-none" : "hover:shadow-lg active:scale-95"}
                      `}
                    >
                      <span className={`text-3xl font-black italic tracking-tighter ${active ? "text-primary" : "text-neutral-200 dark:text-neutral-800"}`}>
                        0{section.id}
                      </span>
                      <div className="flex flex-col flex-1 truncate">
                        <span className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${active ? "text-primary" : "text-muted-foreground"}`}>
                            Step 0{section.id}
                        </span>
                        <span className={`text-sm font-black uppercase tracking-tight ${active ? "text-foreground" : "text-muted-foreground"}`}>
                            {section.title.split(". ")[1] || section.title}
                        </span>
                      </div>
                      {finished && <Check className="w-6 h-6 text-green-500" strokeWidth={5} />}
                      {!navigable && !active && <Lock className="w-5 h-5 text-muted-foreground/30" />}
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        {/* === Desktop Elegant Card Grid === */}
        <div className="hidden md:block py-6">
           <div className="grid grid-cols-5 gap-5">
                {sections.map((section) => {
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
                                group relative overflow-hidden h-44
                                flex flex-col items-start p-8 rounded-[40px] border transition-all duration-700 text-left
                                ${isShaking ? "animate-subtle-shake border-destructive ring-12 ring-destructive/5" : ""}
                                ${active ? "bg-white dark:bg-neutral-900 border-primary shadow-[0_30px_80px_rgba(0,0,0,0.12)] scale-[1.04] z-20" : "border-neutral-100/60 dark:border-white/5"}
                                ${!navigable && !active ? "opacity-25 grayscale cursor-not-allowed" : "cursor-pointer"}
                                ${!active && !isShaking ? "bg-white/30 dark:bg-white/[0.02] backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:border-primary/40 hover:bg-white/50" : ""}
                            `}
                        >
                            {/* Formal Number Branding */}
                            <span className={`
                                text-6xl font-black italic tracking-[-0.1em] mb-auto transition-colors duration-700 leading-none
                                ${active ? "text-primary/100" : "text-neutral-200/50 dark:text-neutral-800/50 group-hover:text-primary/20"}
                            `}>
                                0{section.id}
                            </span>

                            <div className="flex flex-col gap-1 relative z-10 w-full mt-auto">
                                <span className={`
                                    text-[10px] font-black uppercase tracking-[0.3em] transition-colors
                                    ${active ? "text-primary" : "text-muted-foreground/5 group-hover:text-primary/60"}
                                `}>
                                    Step 0{section.id}
                                </span>
                                <h3 className={`
                                    text-[14px] font-black leading-tight transition-all duration-300 tracking-tight flex items-center justify-between gap-2
                                    ${active ? "text-foreground" : "text-muted-foreground/70 group-hover:text-foreground"}
                                `}>
                                    <span className="truncate pr-4">
                                        {section.title.split(". ")[1] || section.title}
                                    </span>
                                </h3>
                            </div>

                            {/* Minimalist Status Indicators */}
                            <div className="absolute top-8 right-8">
                                {finished ? (
                                    <div className="flex items-center gap-1.5 text-green-500 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20 shadow-sm animate-in zoom-in-50 duration-500">
                                        <Check className="w-3.5 h-3.5" strokeWidth={5} />
                                        <span className="text-[9px] font-black uppercase tracking-wider">Verified</span>
                                    </div>
                                ) : hasError ? (
                                    <div className="flex items-center gap-1.5 text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/20 shadow-sm animate-pulse">
                                        <AlertCircle className="w-3.5 h-3.5" strokeWidth={3} />
                                        <span className="text-[9px] font-black uppercase tracking-wider">Fix Me</span>
                                    </div>
                                ) : !navigable && !active ? (
                                    <div className="p-2.5 rounded-2xl bg-neutral-50 dark:bg-white/5 opacity-40">
                                        <Lock className="w-4 h-4 text-muted-foreground" strokeWidth={3} />
                                    </div>
                                ) : null}
                            </div>

                            {/* Sophisticated Base Indicator */}
                            {active && (
                                <div className="absolute bottom-0 left-0 right-0 h-2 bg-primary animate-in slide-in-from-left duration-1000 ease-out fill-mode-both" />
                            )}
                        </button>
                    );
                })}
           </div>

           {/* Elegant Status Summary Footer */}
           <div className="mt-12 flex justify-between items-center px-8 border-t border-neutral-100 dark:border-white/5 pt-8 opacity-60 scale-95 origin-center">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">Current Stage</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground">Completed & Verified</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground/50 grayscale group-hover:grayscale-0 transition-all">
                        <Lock className="w-4 h-4 opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em]">Pending Access</span>
                    </div>
                </div>
                {lastSaved && (
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest opacity-40 mb-1">Backup Synchronization</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary italic bg-primary/5 px-3 py-1 rounded-full">
                            Last Synced: {lastSaved}
                        </span>
                    </div>
                )}
           </div>
        </div>
      </div>
    </div>
  );
}
