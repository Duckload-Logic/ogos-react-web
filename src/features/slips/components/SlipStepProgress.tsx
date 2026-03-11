import { CheckCircle2, LucideIcon } from "lucide-react";

export interface Step {
  id: number;
  label: string;
  icon: LucideIcon;
}

export interface SlipStepProgressProps {
  steps: Step[];
  currentStep: number;
  completedSteps: boolean[];
}

export function SlipStepProgress({
  steps,
  currentStep,
  completedSteps,
}: SlipStepProgressProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-center gap-0">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = completedSteps[index];
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-9 h-9 rounded-full
                    transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-foreground"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`
                    text-xs font-medium mt-1 transition-colors
                    ${
                      isCurrent || isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-14 sm:w-20 h-0.5 mx-2 rounded-full transition-colors duration-300
                    ${
                      (step.id === 1 && completedSteps[0]) ||
                      (step.id === 2 && completedSteps[1])
                        ? "bg-primary"
                        : "bg-border/60"
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
