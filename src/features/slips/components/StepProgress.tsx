import { CheckCircle2, LucideIcon } from "lucide-react";

export interface Step {
  id: number;
  label: string;
  icon: LucideIcon;
}

export interface StepProgressProps {
  steps: Step[];
  currentStep: number;
  completedSteps: boolean[];
}

export function StepProgress({
  steps,
  currentStep,
  completedSteps,
}: StepProgressProps) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-center gap-0">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = completedSteps[index];
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className="flex items-center"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : isCurrent
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-foreground"
                  } `}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <StepIcon className="h-4 w-4" />
                  )}
                </div>
                <span
                  className={`mt-1 text-xs font-medium transition-colors ${
                    isCurrent || isCompleted
                      ? "text-foreground"
                      : "text-muted-foreground"
                  } `}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 w-14 rounded-full transition-colors duration-300 sm:w-20 ${
                    (step.id === 1 && completedSteps[0]) ||
                    (step.id === 2 && completedSteps[1])
                      ? "bg-primary"
                      : "bg-border/60"
                  } `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
