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
    <div className="mb-8">
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
                    flex items-center justify-center w-10 h-10 rounded-full
                    transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-primary text-primary-foreground"
                        : isCurrent
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-muted text-muted-foreground"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`
                    text-xs font-medium mt-1.5 transition-colors
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
                    w-16 sm:w-24 h-0.5 mx-3 rounded-full transition-colors duration-300
                    ${
                      (step.id === 1 && completedSteps[0]) ||
                      (step.id === 2 && completedSteps[1])
                        ? "bg-primary"
                        : "bg-border"
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
