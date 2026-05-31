import { forwardRef, useImperativeHandle, useState } from "react";
import { GraduationCap, School, CheckCircle2, AlertCircle } from "lucide-react";
import { FormInput, Dropdown } from "@/components/form";
import { SectionContainer } from "./SectionContainer";
import {
  validateObject,
  isFieldRequired,
  validateField,
} from "@/services/validationSchema";
import { educationValidationSchema } from "@/features/iir/config/educationValidationSchema";
import { cn } from "@/lib/utils";

interface FormErrors {
  [key: string]: string;
}

interface EducationSectionRef {
  validate: (step?: number) => { isValid: boolean; errors: FormErrors };
}

export const EducationSection = forwardRef<
  EducationSectionRef,
  {
    education: any;
    onChange: (path: string, value: any) => void;
    onFieldBlur?: (path: string) => void;
    shouldShowError?: (fieldPath: string) => boolean;
  }
>(function EducationSection(
  { education, onChange, onFieldBlur, shouldShowError },
  ref,
) {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (
    step?: number,
  ): { isValid: boolean; errors: FormErrors } => {
    const sectionErrors = validateObject(
      { education },
      educationValidationSchema,
    );
    setErrors(sectionErrors);
    return {
      isValid: Object.keys(sectionErrors).length === 0,
      errors: sectionErrors,
    };
  };

  useImperativeHandle(ref, () => ({
    validate: (step?: number) => validate(step),
  }));

  const clearError = (field: string) => {
    setErrors((prev: FormErrors) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const handleInputChange = (fieldPath: string, value: any) => {
    onChange(fieldPath, value);

    // Instant validation
    const fieldRules = educationValidationSchema[fieldPath];
    if (fieldRules) {
      const error = validateField(value, fieldRules, { education });
      setErrors((prev: FormErrors) => {
        const updated = { ...prev };
        if (error) updated[fieldPath] = error;
        else delete updated[fieldPath];
        return updated;
      });
    }

    if (onFieldBlur) {
      onFieldBlur(fieldPath);
    }
  };

  const getFieldError = (fieldPath: string): string | undefined => {
    const hasError = errors[fieldPath];
    const showError = shouldShowError ? shouldShowError(fieldPath) : true;
    return hasError && showError ? errors[fieldPath] : undefined;
  };

  const getCompletionStatus = (idx: number) => {
    const school = education?.schools?.[idx] || {};
    const requiredFields = [
      "schoolName",
      "schoolAddress",
      "schoolType",
      "yearStarted",
      "yearCompleted",
    ];

    const filledCount = requiredFields.filter(
      (field) => !!school[field]?.toString().trim(),
    ).length;

    // Check if any field in this school slot has a validation error
    const hasError = Object.keys(errors).some((path) =>
      path.startsWith(`education.schools.${idx}.`),
    );

    if (filledCount === 0)
      return { color: "bg-muted", text: "Empty", icon: null };

    // Incomplete if not all fields filled OR there's a validation error anywhere in the slot
    if (filledCount < requiredFields.length || hasError)
      return { color: "bg-amber-500", text: "Incomplete", icon: AlertCircle };

    return { color: "bg-emerald-500", text: "Complete", icon: CheckCircle2 };
  };

  const schoolTypes = [
    { id: "Public", name: "Public" },
    { id: "Private", name: "Private" },
    { id: "Others", name: "Others" },
  ];

  return (
    <SectionContainer
      title="Educational Background"
      description="Your academic journey from primary to recent schooling"
      icon={GraduationCap}
    >
      <div className="space-y-12">
        {/* Nature of Schooling */}
        <div
          className={cn(
            "border-glass-border/40 rounded-xl border bg-glass-bg p-5",
            "shadow-sm backdrop-blur-glass transition-all duration-300",
            "sm:p-8",
          )}
        >
          <label
            className={`mb-6 flex items-center gap-2 text-sm font-bold transition-colors duration-300 ${getFieldError("education.natureOfSchooling") ? "text-destructive" : "text-foreground/80"}`}
          >
            {getFieldError("education.natureOfSchooling") ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            )}
            Nature of Schooling
            <span className="text-primary">*</span>
          </label>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
            <button
              type="button"
              onClick={() =>
                handleInputChange("education.natureOfSchooling", "Continuous")
              }
              className={cn(
                "flex items-center justify-between rounded-xl border p-4",
                "transition-all duration-300",
                education?.natureOfSchooling === "Continuous"
                  ? "border-primary bg-primary/5 shadow-sm"
                  : getFieldError("education.natureOfSchooling")
                    ? cn(
                        "border-destructive/50 bg-destructive/5",
                        "shadow-[0_0_10px_rgba(var(--destructive),0.05)]",
                      )
                    : cn(
                        "bg-glass-bg/60 border-glass-border/20",
                        "hover:bg-glass-bg/80 hover:border-primary/20",
                      ),
              )}
            >
              <span
                className={cn(
                  "text-sm font-bold",
                  education?.natureOfSchooling === "Continuous"
                    ? "text-primary"
                    : getFieldError("education.natureOfSchooling")
                      ? "text-destructive/80"
                      : "text-foreground/70",
                )}
              >
                Continuous
              </span>
              {education?.natureOfSchooling === "Continuous" && (
                <CheckCircle2 className="h-5 w-5 stroke-[2.5] text-primary" />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                handleInputChange("education.natureOfSchooling", "Interrupted")
              }
              className={cn(
                "flex items-center justify-between rounded-xl border p-4",
                "transition-all duration-300",
                education?.natureOfSchooling === "Interrupted"
                  ? "border-primary bg-primary/5 shadow-sm"
                  : getFieldError("education.natureOfSchooling")
                    ? cn(
                        "border-destructive/50 bg-destructive/5",
                        "shadow-[0_0_10px_rgba(var(--destructive),0.05)]",
                      )
                    : cn(
                        "bg-glass-bg/60 border-glass-border/20",
                        "hover:bg-glass-bg/80 hover:border-primary/20",
                      ),
              )}
            >
              <span
                className={cn(
                  "text-sm font-bold",
                  education?.natureOfSchooling === "Interrupted"
                    ? "text-primary"
                    : getFieldError("education.natureOfSchooling")
                      ? "text-destructive/80"
                      : "text-foreground/70",
                )}
              >
                Interrupted
              </span>
              {education?.natureOfSchooling === "Interrupted" && (
                <CheckCircle2 className="h-5 w-5 stroke-[2.5] text-primary" />
              )}
            </button>
          </div>

          {getFieldError("education.natureOfSchooling") && (
            <p className="ml-1 mt-2 text-xs font-medium text-destructive">
              {getFieldError("education.natureOfSchooling")}
            </p>
          )}

          {education?.natureOfSchooling === "Interrupted" && (
            <div className="animate-fade-in mt-6">
              <FormInput
                name="education.interruptedDetails"
                label="Reason for Interruption"
                isTextarea
                required={isFieldRequired(
                  educationValidationSchema,
                  "education.interruptedDetails",
                )}
                value={
                  typeof education?.interruptedDetails === "string"
                    ? education?.interruptedDetails
                    : ""
                }
                onChange={(val) =>
                  handleInputChange("education.interruptedDetails", val)
                }
                noSpecialCharacters={true}
                placeholder={cn(
                  "Please describe why your",
                  "schooling was interrupted...",
                )}
                error={getFieldError("education.interruptedDetails")}
              />
            </div>
          )}
        </div>

        {/* School Levels */}
        <div className="space-y-8">
          {[
            { name: "Pre-elementary" },
            { name: "Elementary" },
            { name: "High School" },
            { name: "Vocational" },
            // { name: "College" },
          ].map((level: any, idx: number) => {
            const school = education?.schools?.[idx] || {};
            const status = getCompletionStatus(idx);
            const StatusIcon = status.icon;

            return (
              <div
                key={idx}
                className={cn(
                  "bg-glass-bg/60 border-glass-border/40 group overflow-hidden",
                  "rounded-xl border shadow-sm backdrop-blur-glass",
                  "transition-all duration-300 hover:shadow-md",
                )}
              >
                <div
                  className={cn(
                    "bg-glass-bg/40 border-glass-border/20 flex flex-wrap",
                    "items-center justify-between gap-3 border-b px-5 py-4 sm:px-8",
                    "sm:py-5",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        "bg-primary/10 text-primary shadow-sm",
                      )}
                    >
                      <School className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {level.name}
                      </h3>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${status.color}`}
                        />
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase",
                            "text-muted-foreground",
                          )}
                        >
                          {status.text}
                        </span>
                      </div>
                    </div>
                  </div>
                  {StatusIcon && (
                    <StatusIcon
                      className={cn(
                        "h-5 w-5",
                        status.color.replace("bg-", "text-"),
                      )}
                    />
                  )}
                </div>

                <div className="p-5 sm:p-8">
                  <div className="grid grid-cols-1 gap-5 sm:gap-8 md:grid-cols-2">
                    <div className="md:col-span-2">
                      <FormInput
                        name={`education.schools.${idx}.schoolName`}
                        label="School Name"
                        required={isFieldRequired(
                          educationValidationSchema,
                          `education.schools.${idx}.schoolName`,
                        )}
                        value={school.schoolName || ""}
                        onChange={(val) =>
                          handleInputChange(
                            `education.schools.${idx}.schoolName`,
                            val,
                          )
                        }
                        noSpecialCharacters={true}
                        placeholder="e.g. Philippine Science High School"
                        error={getFieldError(
                          `education.schools.${idx}.schoolName`,
                        )}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <FormInput
                        name={`education.schools.${idx}.schoolAddress`}
                        label="School Address"
                        required={isFieldRequired(
                          educationValidationSchema,
                          `education.schools.${idx}.schoolAddress`,
                        )}
                        value={school.schoolAddress || ""}
                        onChange={(val) =>
                          handleInputChange(
                            `education.schools.${idx}.schoolAddress`,
                            val,
                          )
                        }
                        noSpecialCharacters={true}
                        placeholder="Street, City, Province"
                        error={getFieldError(
                          `education.schools.${idx}.schoolAddress`,
                        )}
                      />
                    </div>

                    <Dropdown
                      formStyle
                      label="School Type"
                      options={schoolTypes}
                      value={school.schoolType || ""}
                      onChange={(val: any) =>
                        handleInputChange(
                          `education.schools.${idx}.schoolType`,
                          val,
                        )
                      }
                      error={getFieldError(
                        `education.schools.${idx}.schoolType`,
                      )}
                      required={isFieldRequired(
                        educationValidationSchema,
                        `education.schools.${idx}.schoolType`,
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormInput
                        name={`education.schools.${idx}.yearStarted`}
                        label="Year Started"
                        inputMode="numeric"
                        required={isFieldRequired(
                          educationValidationSchema,
                          `education.schools.${idx}.yearStarted`,
                        )}
                        value={school.yearStarted || ""}
                        onChange={(val) =>
                          handleInputChange(
                            `education.schools.${idx}.yearStarted`,
                            val.replace(/[^0-9]/g, ""),
                          )
                        }
                        placeholder="YYYY"
                        error={getFieldError(
                          `education.schools.${idx}.yearStarted`,
                        )}
                      />
                      <FormInput
                        name={`education.schools.${idx}.yearCompleted`}
                        label="Year Graduated"
                        inputMode="numeric"
                        required={isFieldRequired(
                          educationValidationSchema,
                          `education.schools.${idx}.yearCompleted`,
                        )}
                        value={school.yearCompleted || ""}
                        onChange={(val) =>
                          handleInputChange(
                            `education.schools.${idx}.yearCompleted`,
                            val.replace(/[^0-9]/g, ""),
                          )
                        }
                        placeholder="YYYY"
                        error={getFieldError(
                          `education.schools.${idx}.yearCompleted`,
                        )}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <FormInput
                        name={`education.schools.${idx}.awards`}
                        label="Awards/Honors"
                        value={school.awards || ""}
                        onChange={(val) =>
                          handleInputChange(
                            `education.schools.${idx}.awards`,
                            val,
                          )
                        }
                        noSpecialCharacters={true}
                        placeholder="e.g. With Honors, Academic Excellence..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionContainer>
  );
});
