import React, { useEffect, useState } from "react";
import { X, AlertCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FormErrorItem {
  fieldPath: string;
  message: string;
}

export type GroupedErrors = Record<string, FormErrorItem[]>;

export const groupErrorsBySection = (
  errors: Record<string, string>,
): GroupedErrors => {
  const groups: GroupedErrors = {
    "Personal Info": [],
    "Education Background": [],
    "Family Background": [],
    "Health Info": [],
    Interests: [],
  };

  Object.entries(errors).forEach(([path, message]) => {
    if (path.startsWith("student."))
      groups["Personal Info"].push({ fieldPath: path, message });
    else if (path.startsWith("education."))
      groups["Education Background"].push({ fieldPath: path, message });
    else if (path.startsWith("family."))
      groups["Family Background"].push({ fieldPath: path, message });
    else if (path.startsWith("health."))
      groups["Health Info"].push({ fieldPath: path, message });
    else if (path.startsWith("interests."))
      groups["Interests"].push({ fieldPath: path, message });
    else groups["Personal Info"].push({ fieldPath: path, message });
  });

  return Object.fromEntries(
    Object.entries(groups).filter(([_, items]) => items.length > 0),
  );
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
  onNavigateToSection,
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
      Interests: 5,
    };
    onNavigateToSection(sectionMap[sectionTitle]);

    setTimeout(() => {
      const element = document.querySelector(
        `[name="${fieldPath}"], [id="${fieldPath}"]`,
      );
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: "smooth" });

        // Visual Cue: pulse effect
        const targetElement = element as HTMLElement;
        const originalTransition = targetElement.style.transition;
        const originalBoxShadow = targetElement.style.boxShadow;

        targetElement.style.transition = "all 0.3s ease-in-out";
        targetElement.style.boxShadow = "0 0 0 4px rgba(220, 38, 38, 0.4)"; // tailwind destructive red
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
      className={cn(
        "fixed inset-0 z-50 flex items-end justify-center p-0",
        "bg-black/50 backdrop-blur-sm transition-opacity duration-300",
        "sm:items-center sm:p-4",
        isOpen ? "opacity-100" : "opacity-0",
      )}
      onTransitionEnd={handleAnimationEnd}
    >
      <div
        className={cn(
          "flex max-h-[90vh] w-full transform flex-col rounded-t-2xl",
          "bg-background p-6 shadow-2xl transition-transform",
          "duration-300 sm:max-w-md sm:rounded-xl md:max-w-lg",
          isOpen
            ? "translate-y-0"
            : "translate-y-full sm:translate-y-8 sm:scale-95",
        )}
      >
        <div className="mb-2 flex shrink-0 items-start justify-between">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="h-6 w-6" />
            <h2 className="text-xl font-bold">Action Required</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 transition-colors hover:bg-muted"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <p className="mb-6 shrink-0 text-sm text-muted-foreground">
          We found{" "}
          <span className="font-bold text-foreground">{totalErrors} items</span>{" "}
          that need your attention before you can submit the form.
        </p>

        <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto pr-2">
          {Object.entries(groupedErrors).map(([sectionTitle, errors]) => (
            <div
              key={sectionTitle}
              className="space-y-3"
            >
              <h3
                className={cn(
                  "border-b pb-1 text-sm font-semibold uppercase",
                  "text-muted-foreground",
                )}
              >
                {sectionTitle}
              </h3>
              <div className="space-y-2">
                {errors.map((error, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      handleDeepLinkClick(error.fieldPath, sectionTitle)
                    }
                    className={cn(
                      "group flex w-full items-start gap-3 rounded-lg border",
                      "border-border bg-card p-3 text-left transition-colors",
                      "hover:border-destructive hover:bg-destructive/5",
                      "focus:outline-none focus:ring-2 focus:ring-destructive/20",
                    )}
                  >
                    <div className="mt-0.5 h-4 min-w-[4px] rounded-full bg-destructive" />
                    <span className="flex-1 pr-2 text-sm leading-tight text-foreground">
                      {error.message}
                    </span>
                    <ChevronRight
                      className={cn(
                        "mt-0.5 h-4 w-4 text-muted-foreground transition-all",
                        "group-hover:translate-x-1 group-hover:text-destructive",
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 shrink-0 border-t border-border pt-4">
          <Button
            onClick={onClose}
            className="w-full bg-destructive text-white hover:bg-destructive/90"
          >
            Got it, I'll fix them
          </Button>
        </div>
      </div>
    </div>
  );
}
