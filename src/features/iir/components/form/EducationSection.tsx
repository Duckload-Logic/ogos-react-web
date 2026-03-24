import { forwardRef, useImperativeHandle, useState } from "react";
import {
  GraduationCap,
  School,
  MapPin,
  Award,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { FormInput, Dropdown } from "@/components/form";
import { SectionContainer } from "./SectionContainer";
import { validateObject, isFieldRequired } from "@/services/validationSchema";
import { educationValidationSchema } from "@/features/iir/config/educationValidationSchema";

interface FormErrors {
  [key: string]: string;
}

interface EducationSectionRef {
  validate: () => { isValid: boolean; errors: FormErrors };
}

export const EducationSection = forwardRef<
  EducationSectionRef,
  {
    education: any;
    onChange: (path: string, value: any) => void;
    onFieldBlur?: (path: string) => void;
    shouldShowError?: boolean;
  }
>(function EducationSection(
  { education, onChange, onFieldBlur, shouldShowError = false },
  ref,
) {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): { isValid: boolean; errors: FormErrors } => {
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
    validate,
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
    clearError(fieldPath);
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
    const filled = requiredFields.filter((field) => !!school[field]).length;

    if (filled === 0) return { color: "bg-muted", text: "Empty", icon: null };
    if (filled < requiredFields.length)
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
        <div className="bg-glass-bg backdrop-blur-glass rounded-[24px] p-5 sm:p-8 border border-glass-border/40 shadow-sm transition-all duration-300">
          <label className="text-sm font-bold text-foreground/80 mb-6 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Nature of Schooling
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() =>
                handleInputChange("education.natureOfSchooling", "Continuous")
              }
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                education?.natureOfSchooling === "Continuous"
                  ? "bg-primary/5 border-primary shadow-sm"
                  : "bg-glass-bg/60 border-glass-border/20 hover:bg-glass-bg/80 hover:border-primary/20"
              }`}
            >
              <span
                className={`text-sm font-bold ${education?.natureOfSchooling === "Continuous" ? "text-primary" : "text-foreground/70"}`}
              >
                Continuous
              </span>
              {education?.natureOfSchooling === "Continuous" && (
                <CheckCircle2 className="w-5 h-5 text-primary stroke-[2.5]" />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                handleInputChange("education.natureOfSchooling", "Interrupted")
              }
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                education?.natureOfSchooling === "Interrupted"
                  ? "bg-primary/5 border-primary shadow-sm"
                  : "bg-glass-bg/60 border-glass-border/20 hover:bg-glass-bg/80 hover:border-primary/20"
              }`}
            >
              <span
                className={`text-sm font-bold ${education?.natureOfSchooling === "Interrupted" ? "text-primary" : "text-foreground/70"}`}
              >
                Interrupted
              </span>
              {education?.natureOfSchooling === "Interrupted" && (
                <CheckCircle2 className="w-5 h-5 text-primary stroke-[2.5]" />
              )}
            </button>
          </div>

          {errors["education.natureOfSchooling"] && (
            <p className="text-xs font-medium text-destructive mt-2 ml-1">
              {errors["education.natureOfSchooling"]}
            </p>
          )}

          {education?.natureOfSchooling === "Interrupted" && (
            <div className="mt-6 animate-fade-in">
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
                placeholder="Please describe why your schooling was interrupted..."
                error={errors["education.interruptedDetails"]}
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
            { name: "College" },
          ].map((level: any, idx: number) => {
            const school = education?.schools?.[idx] || {};
            const status = getCompletionStatus(idx);
            const StatusIcon = status.icon;

            return (
              <div
                key={idx}
                className="group bg-glass-bg/60 backdrop-blur-glass rounded-[24px] border border-glass-border/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="px-5 sm:px-8 py-4 sm:py-5 bg-glass-bg/40 border-b border-glass-border/20 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-sm text-primary">
                      <School className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {level.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${status.color}`}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          {status.text}
                        </span>
                      </div>
                    </div>
                  </div>
                  {StatusIcon && (
                    <StatusIcon
                      className={`w-5 h-5 ${status.color.replace("bg-", "text-")}`}
                    />
                  )}
                </div>

                <div className="p-5 sm:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
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
                        placeholder="e.g. Philippine Science High School"
                        error={errors[`education.schools.${idx}.schoolName`]}
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
                        placeholder="Street, City, Province"
                        error={errors[`education.schools.${idx}.schoolAddress`]}
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
                      error={errors[`education.schools.${idx}.schoolType`]}
                      required={isFieldRequired(
                        educationValidationSchema,
                        `education.schools.${idx}.schoolType`,
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        error={errors[`education.schools.${idx}.yearStarted`]}
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
                        error={errors[`education.schools.${idx}.yearCompleted`]}
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
