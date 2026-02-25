import { forwardRef, useImperativeHandle, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Plus } from "lucide-react";
import { DropdownField, InputField } from "@/components/form";
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [indexStatus, setIndexStatus] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): { isValid: boolean; errors: FormErrors } => {
    const sectionErrors: FormErrors = {};

    if (!education?.schools || education.schools.length === 0) {
      sectionErrors["education.schools"] =
        "At least one school record is required";
    } else {
      education.schools.forEach((school: any, idx: number) => {
        if (!school.schoolName?.trim()) {
          sectionErrors[`education.schools.${idx}.schoolName`] =
            "School name is required";
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

    if (filled === 0) return { color: "bg-gray-300", text: "Empty" };
    if (filled < requiredFields.length)
      return { color: "bg-yellow-500", text: "Incomplete" };

    return { color: "bg-green-500", text: "Complete" };
  };

  return (
    <div className="space-y-6">
      <SectionContainer title="A. Nature of Schooling">
        <DropdownField
          label="Nature of Schooling"
          options={[
            { id: "Continuous", name: "Continuous" },
            { id: "Interrupted", name: "Interrupted" },
          ]}
          value={education?.natureOfSchooling || ""}
          onChange={(val) =>
            handleInputChange("education.natureOfSchooling", val)
          }
          required
        />

        {education?.natureOfSchooling === "Interrupted" && (
          <div className="mt-4">
            <InputField
              label="Details of Interruption"
              isTextarea
              value={
                typeof education?.interruptedDetails === "string"
                  ? education?.interruptedDetails
                  : ""
              }
              onChange={(val) =>
                handleInputChange("education.interruptedDetails", val)
              }
              placeholder="Explain the reason for interruption"
            />
          </div>
        )}
      </SectionContainer>

      <SectionContainer title="B. Educational Background">
        <div className="grid grid-cols-1 gap-4">
          {[
            {
              name: "Pre-elementary",
              color: "bg-violet-600",
            },
            {
              name: "Elementary",
              color: "bg-blue-600",
            },
            {
              name: "High School",
              color: "bg-cyan-600",
            },
            {
              name: "Vocational",
              color: "bg-emerald-600",
            },
            {
              name: "College",
              color: "bg-amber-600",
            },
          ].map((level: any, idx: number) => {
            const school = education?.schools?.[idx] || {};
            return (
              <Card
                key={idx}
                className="bg-gradient-to-br bg-card border border-border overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <div className={`h-1 ${level.color}`} />
                <CardHeader className="pb-4 pt-5">
                  <Button
                    className="text-base font-semibold text-card-foreground bg-transparent hover:bg-transparent h-auto px-0 flex items-center justify-between gap-2 w-full"
                    id={`school-${idx}`}
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  >
                    <div className="flex items-center gap-2 text-foreground">
                      {level.name}
                      <div
                        className={`w-2 h-2 rounded-full ${getCompletionLevel(idx).color}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {getCompletionLevel(idx).text}
                      </span>
                    </div>
                    <ChevronDownIcon
                      className={`ml-2 h-4 w-4 transition-transform duration-300 flex-shrink-0 ${openIndex === idx ? "rotate-180" : "rotate-0"}`}
                    />
                  </Button>
                </CardHeader>
                {openIndex === idx && (
                  <CardContent className="space-y-5 border-t border-border pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        label="School Name"
                        value={school.schoolName || ""}
                        onChange={(val) =>
                          handleInputChange(
                            `education.schools.${idx}.schoolName`,
                            val,
                          )
                        }
                        placeholder="Name of school"
                        error={errors[`education.schools.${idx}.schoolName`]}
                      />
                      <InputField
                        label="School Address"
                        value={school.schoolAddress || ""}
                        onChange={(val) =>
                          handleInputChange(
                            `education.schools.${idx}.schoolAddress`,
                            val,
                          )
                        }
                        placeholder="School location"
                      />
                      <DropdownField
                        label="School Type"
                        value={school.schoolType || ""}
                        onChange={(val) =>
                          handleInputChange(
                            `education.schools.${idx}.schoolType`,
                            val,
                          )
                        }
                        options={[
                          { id: "Public", name: "Public" },
                          { id: "Private", name: "Private" },
                          { id: "Others", name: "Others" },
                        ]}
                      />
                      <InputField
                        label="Year Started"
                        type="number"
                        value={school.yearStarted || ""}
                        onChange={(val) =>
                          handleInputChange(
                            `education.schools.${idx}.yearStarted`,
                            val,
                          )
                        }
                        placeholder="e.g., 2012"
                      />
                      <InputField
                        label="Year Completed"
                        type="number"
                        value={school.yearCompleted || ""}
                        onChange={(val) =>
                          handleInputChange(
                            `education.schools.${idx}.yearCompleted`,
                            val,
                          )
                        }
                        placeholder="e.g., 2018"
                      />
                      <InputField
                        label="Awards/Honors"
                        value={school.awards || ""}
                        onChange={(val) =>
                          handleInputChange(
                            `education.schools.${idx}.awards`,
                            val,
                          )
                        }
                        placeholder="e.g., Academic Excellence"
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </SectionContainer>
    </div>
  );
});
