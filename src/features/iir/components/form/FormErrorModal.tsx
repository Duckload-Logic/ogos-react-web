import React, { useEffect, useState } from 'react';
import { X, AlertCircle, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface FormErrorItem {
  fieldPath: string;
  message: string;
}

export type GroupedErrors = Record<string, FormErrorItem[]>;

export const groupErrorsBySection = (errors: Record<string, string>): GroupedErrors => {
  const groups: GroupedErrors = {
    "Personal Info": [],
    "Education Background": [],
    "Family Background": [],
    "Health Info": [],
    "Interests": []
  };

  Object.entries(errors).forEach(([path, message]) => {
    if (path.startsWith("student.")) groups["Personal Info"].push({ fieldPath: path, message });
    else if (path.startsWith("education.")) groups["Education Background"].push({ fieldPath: path, message });
    else if (path.startsWith("family.")) groups["Family Background"].push({ fieldPath: path, message });
    else if (path.startsWith("health.")) groups["Health Info"].push({ fieldPath: path, message });
    else if (path.startsWith("interests.")) groups["Interests"].push({ fieldPath: path, message });
    else groups["Personal Info"].push({ fieldPath: path, message });
  });

  return Object.fromEntries(Object.entries(groups).filter(([_, items]) => items.length > 0));
};

interface FormErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupedErrors: GroupedErrors;
  totalErrors: number;
  onNavigateToSection: (sectionId: number) => void;
}

export function FormErrorModal({ 
  isOpen, 
  onClose, 
  groupedErrors, 
  totalErrors,
  onNavigateToSection
}: FormErrorModalProps) {
  const [isRendered, setIsRendered] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setIsRendered(true);
  }, [isOpen]);

  const handleAnimationEnd = () => {
    if (!isOpen) setIsRendered(false);
  };

  if (!isRendered && !isOpen) return null;

  const handleDeepLinkClick = (fieldPath: string, sectionTitle: string) => {
    onClose();
    
    const sectionMap: Record<string, number> = {
      "Personal Info": 1,
      "Education Background": 2,
      "Family Background": 3,
      "Health Info": 4,
      "Interests": 5
    };
    onNavigateToSection(sectionMap[sectionTitle]);

    setTimeout(() => {
      const element = document.querySelector(`[name="${fieldPath}"], [id="${fieldPath}"]`);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
        
        // Visual Cue: pulse effect
        const targetElement = element as HTMLElement;
        const originalTransition = targetElement.style.transition;
        const originalBoxShadow = targetElement.style.boxShadow;
        
        targetElement.style.transition = 'all 0.3s ease-in-out';
        targetElement.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.4)'; // tailwind destructive red
        targetElement.focus();
        
        setTimeout(() => {
          targetElement.style.boxShadow = originalBoxShadow;
          setTimeout(() => {
            targetElement.style.transition = originalTransition;
          }, 300);
        }, 1500);
      }
    }, 150);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onTransitionEnd={handleAnimationEnd}
    >
      <div 
        className={`bg-background w-full sm:max-w-md md:max-w-lg rounded-t-2xl sm:rounded-xl shadow-2xl p-6 transform transition-transform duration-300 flex flex-col max-h-[90vh] ${isOpen ? 'translate-y-0' : 'translate-y-full sm:translate-y-8 sm:scale-95'}`}
      >
        <div className="flex items-start justify-between mb-2 shrink-0">
          <div className="flex gap-3 items-center text-destructive">
            <AlertCircle className="w-6 h-6" />
            <h2 className="text-xl font-bold">Action Required</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <p className="text-muted-foreground text-sm mb-6 shrink-0">
          We found <span className="font-bold text-foreground">{totalErrors} items</span> that need your attention before you can submit the form.
        </p>

        <div className="overflow-y-auto pr-2 space-y-6 flex-1 custom-scrollbar">
          {Object.entries(groupedErrors).map(([sectionTitle, errors]) => (
            <div key={sectionTitle} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b pb-1">
                {sectionTitle}
              </h3>
              <div className="space-y-2">
                {errors.map((error, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDeepLinkClick(error.fieldPath, sectionTitle)}
                    className="w-full text-left group flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:border-destructive hover:bg-destructive/5 transition-colors focus:outline-none focus:ring-2 focus:ring-destructive/20"
                  >
                    <div className="mt-0.5 min-w-[4px] h-4 bg-destructive rounded-full" />
                    <span className="text-sm text-foreground flex-1 pr-2 leading-tight">
                      {error.message}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-destructive group-hover:translate-x-1 transition-all mt-0.5" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-border shrink-0">
          <Button onClick={onClose} className="w-full bg-destructive text-white hover:bg-destructive/90">
            Got it, I'll fix them
          </Button>
        </div>
      </div>
    </div>
  );
}
