import { forwardRef, useImperativeHandle, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Check } from "lucide-react";
import { InputField } from "@/components/form";
import { SectionContainer } from "./SectionContainer";

interface FormErrors {
  [key: string]: string;
}

interface EducationBackgroundSectionRef {
  validate: () => { isValid: boolean; errors: FormErrors };
}

export const EducationBackgroundSection = forwardRef<
  EducationBackgroundSectionRef,
  {
    education: any;
    onChange: (path: string, value: any) => void;
  }
>(function EducationBackgroundSection({ education, onChange }, ref) {
  const [indexStatus, setIndexStatus] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): { isValid: boolean; errors: FormErrors } => {
    const sectionErrors: FormErrors = {};
    const currentYear = new Date().getFullYear();

    if (!education?.natureOfSchooling) {
      sectionErrors["education.natureOfSchooling"] = "Nature of schooling is required";
    }

    if (education?.natureOfSchooling === "Interrupted") {
      const details = (education?.interruptedDetails || "").trim();
      if (!details) {
        sectionErrors["education.interruptedDetails"] = "Reason for interruption is required";
      } else if (details.length < 2) {
        sectionErrors["education.interruptedDetails"] = "Reason must be at least 2 characters";
      }
    }

    const schools: any[] = education?.schools || [];
    const requiredFields = ["schoolName", "schoolAddress", "schoolType", "yearStarted", "yearCompleted"];

    const hasAnySchool = schools.some((s) =>
      requiredFields.some((f) => s[f]?.toString().trim())
    );

    if (!hasAnySchool) {
      sectionErrors["education.schools"] = "At least one school record is required";
    } else {
      schools.forEach((school, idx) => {
        const hasPartialData = requiredFields.some((f) => school[f]?.toString().trim());
        if (hasPartialData) {
          const name = (school.schoolName || "").trim();
          if (!name) {
            sectionErrors[`education.schools.${idx}.schoolName`] = "School name is required";
          } else if (name.length < 2) {
            sectionErrors[`education.schools.${idx}.schoolName`] = "School name must be at least 2 characters";
          }

          const addr = (school.schoolAddress || "").trim();
          if (!addr) {
            sectionErrors[`education.schools.${idx}.schoolAddress`] = "School address is required";
          } else if (addr.length < 2) {
            sectionErrors[`education.schools.${idx}.schoolAddress`] = "School address must be at least 2 characters";
          }

          if (!school.schoolType?.toString().trim())
            sectionErrors[`education.schools.${idx}.schoolType`] = "School type is required";

          const yearStartedStr = school.yearStarted?.toString().trim();
          if (!yearStartedStr) {
            sectionErrors[`education.schools.${idx}.yearStarted`] = "Year started is required";
          } else {
            const ys = Number(yearStartedStr);
            if (isNaN(ys) || !Number.isInteger(ys) || ys < 1900 || ys > currentYear) {
              sectionErrors[`education.schools.${idx}.yearStarted`] = `Must be a valid year (1900–${currentYear})`;
            }
          }

          const yearCompletedStr = school.yearCompleted?.toString().trim();
          if (!yearCompletedStr) {
            sectionErrors[`education.schools.${idx}.yearCompleted`] = "Year completed is required";
          } else {
            const yc = Number(yearCompletedStr);
            if (isNaN(yc) || !Number.isInteger(yc) || yc < 1900 || yc > currentYear) {
              sectionErrors[`education.schools.${idx}.yearCompleted`] = `Must be a valid year (1900–${currentYear})`;
            } else if (school.yearStarted && !isNaN(Number(school.yearStarted)) && yc < Number(school.yearStarted)) {
              sectionErrors[`education.schools.${idx}.yearCompleted`] = "Year completed cannot be before year started";
            }
          }
        }
      });
    }

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
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const handleInputChange = (fieldPath: string, value: any) => {
    onChange(fieldPath, value);
    clearError(fieldPath);
  };

  const getCompletionLevel = (idx: number) => {
    const school = education?.schools?.[idx] || {};
    const requiredFields = [
      "schoolName",
      "schoolAddress",
      "schoolType",
      "yearStarted",
      "yearCompleted",
    ];
    const filled = requiredFields.filter((field) => !!school[field]).length;

    if (filled === 0) return { color: "bg-muted", text: "Empty" };
    if (filled < requiredFields.length)
      return { color: "bg-yellow-500", text: "Incomplete" };

    return { color: "bg-green-500", text: "Complete" };
  };

  return (
    <Card className="bg-card border border-border overflow-hidden">
      <CardContent className="p-6">
        {/* Part A: Nature of Schooling - Checkboxes */}
        <div className="mb-8 pb-8 border-b border-border">
          <label className="text-sm font-semibold text-foreground mb-4 block">
            Nature of Schooling
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                <input
                  type="radio"
                  name="natureOfSchooling"
                  value="Continuous"
                  checked={education?.natureOfSchooling === "Continuous"}
                  onChange={() =>
                    handleInputChange("education.natureOfSchooling", "Continuous")
                  }
                  className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                />
                <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <span className="text-sm text-foreground">Continuous</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                <input
                  type="radio"
                  name="natureOfSchooling"
                  value="Interrupted"
                  checked={education?.natureOfSchooling === "Interrupted"}
                  onChange={() =>
                    handleInputChange("education.natureOfSchooling", "Interrupted")
                  }
                  className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                />
                <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <span className="text-sm text-foreground">Interrupted, Why?</span>
            </label>
          </div>
          {errors["education.natureOfSchooling"] && (
            <p className="text-xs text-red-500 mt-1">{errors["education.natureOfSchooling"]}</p>
          )}

          {/* Interruption Reason Input */}
          {education?.natureOfSchooling === "Interrupted" && (
            <div className="mt-4">
              <InputField
                label="Reason for Interruption"
                isTextarea
                required
                value={
                  typeof education?.interruptedDetails === "string"
                    ? education?.interruptedDetails
                    : ""
                }
                onChange={(val) =>
                  handleInputChange("education.interruptedDetails", val)
                }
                placeholder="Explain the reason for interruption"
                error={errors["education.interruptedDetails"]}
              />
            </div>
          )}
        </div>

        {/* Part B: School Level Accordions */}
        <div className="space-y-3">
          {[
            { name: "Pre-elementary" },
            { name: "Elementary" },
            { name: "High School" },
            { name: "Vocational" },
            { name: "College" },
          ].map((level: any, idx: number) => {
            const school = education?.schools?.[idx] || {};
            return (
              <div
                key={idx}
                className="bg-muted border border-border rounded-lg overflow-hidden"
              >
                <CardHeader className="pb-4 pt-4 px-5 bg-muted">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-semibold text-foreground">{level.name}</span>
                    <div
                      className={`w-2 h-2 rounded-full ${getCompletionLevel(idx).color}`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {getCompletionLevel(idx).text}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 px-5 py-6 bg-card border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="School Name"
                      required
                      value={school.schoolName || ""}
                      onChange={(val) =>
                        handleInputChange(
                          `education.schools.${idx}.schoolName`,
                          val
                        )
                      }
                      placeholder="Name of school"
                      error={errors[`education.schools.${idx}.schoolName`]}
                    />
                    <InputField
                      label="School Address"
                      required
                      value={school.schoolAddress || ""}
                      onChange={(val) =>
                        handleInputChange(
                          `education.schools.${idx}.schoolAddress`,
                          val
                        )
                      }
                      placeholder="School location"
                      error={errors[`education.schools.${idx}.schoolAddress`]}
                    />
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        School Type
                        <span className="text-red-500"> *</span>
                      </label>
                      <div className="relative">
                        <select
                          value={school.schoolType || ""}
                          onChange={(e) =>
                            handleInputChange(
                              `education.schools.${idx}.schoolType`,
                              e.target.value
                            )
                          }
                          className={`
                            w-full px-3 py-2 border rounded-md bg-card text-sm
                            appearance-none cursor-pointer transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-offset-0
                            ${
                              school.schoolType
                                ? "border-green-500 text-foreground font-medium hover:border-green-600 focus:border-green-500 focus:ring-green-500/20"
                                : "border-red-500 text-muted-foreground dark:text-muted-foreground hover:border-red-600 focus:border-red-500 focus:ring-red-500/20"
                            }
                          `}
                        >
                          <option value="">Select type</option>
                          <option value="Public">Public</option>
                          <option value="Private">Private</option>
                          <option value="Others">Others</option>
                        </select>
                        {school.schoolType && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 pointer-events-none">
                            <Check size={18} strokeWidth={2.5} />
                          </div>
                        )}
                      </div>
                      {errors[`education.schools.${idx}.schoolType`] && (
                        <p className="text-xs text-red-500 mt-1">{errors[`education.schools.${idx}.schoolType`]}</p>
                      )}
                    </div>
                    <InputField
                      label="Year Started"
                      type="text"
                      inputMode="numeric"
                      required
                      value={school.yearStarted || ""}
                      onChange={(val) =>
                        handleInputChange(
                          `education.schools.${idx}.yearStarted`,
                          val.replace(/[^0-9]/g, "")
                        )
                      }
                      placeholder="e.g., 2012"
                      error={errors[`education.schools.${idx}.yearStarted`]}
                    />
                    <InputField
                      label="Year Completed"
                      type="text"
                      inputMode="numeric"
                      required
                      value={school.yearCompleted || ""}
                      onChange={(val) =>
                        handleInputChange(
                          `education.schools.${idx}.yearCompleted`,
                          val.replace(/[^0-9]/g, "")
                        )
                      }
                      placeholder="e.g., 2018"
                      error={errors[`education.schools.${idx}.yearCompleted`]}
                    />
                    <InputField
                      label="Awards/Honors"
                      value={school.awards || ""}
                      onChange={(val) =>
                        handleInputChange(
                          `education.schools.${idx}.awards`,
                          val
                        )
                      }
                      placeholder="e.g., Academic Excellence"
                    />
                  </div>
                </CardContent>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});
