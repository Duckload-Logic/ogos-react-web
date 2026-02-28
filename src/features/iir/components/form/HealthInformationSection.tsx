import { forwardRef, useImperativeHandle, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { InputField, Checkbox } from "@/components/form";
import { SectionContainer } from "./SectionContainer";
import { HealthAreaSection } from "./HealthAreaSection";

interface FormErrors {
  [key: string]: string;
}

interface HealthInformationSectionRef {
  validate: () => { isValid: boolean; errors: FormErrors };
}

export const HealthInformationSection = forwardRef<
  HealthInformationSectionRef,
  {
    health: any;
    onChange: (path: string, value: any) => void;
  }
>(function HealthInformationSection({ health, onChange }, ref) {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): { isValid: boolean; errors: FormErrors } => {
    const sectionErrors: FormErrors = {};

    if (!health?.healthRecord) {
      sectionErrors["health.healthRecord"] = "Health record is required";
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
  return (
    <div className="space-y-6">
      <SectionContainer title="A. Health Status">
        <div className="space-y-6">
          <HealthAreaSection
            title="Vision"
            fieldPrefix="health.healthRecord.vision"
            hasData={health?.healthRecord?.visionHasProblem || false}
            details={health?.healthRecord?.visionDetails || ""}
            onChange={handleInputChange}
          />
          <HealthAreaSection
            title="Hearing"
            fieldPrefix="health.healthRecord.hearing"
            hasData={health?.healthRecord?.hearingHasProblem || false}
            details={health?.healthRecord?.hearingDetails || ""}
            onChange={handleInputChange}
          />
          <HealthAreaSection
            title="Speech"
            fieldPrefix="health.healthRecord.speech"
            hasData={health?.healthRecord?.speechHasProblem || false}
            details={health?.healthRecord?.speechDetails || ""}
            onChange={handleInputChange}
          />
          <HealthAreaSection
            title="General Health"
            fieldPrefix="health.healthRecord.generalHealth"
            hasData={health?.healthRecord?.generalHealthHasProblem || false}
            details={health?.healthRecord?.generalHealthDetails || ""}
            onChange={handleInputChange}
          />
        </div>
      </SectionContainer>

      <SectionContainer title="B. Professional Consultations">
        <div className="space-y-3">
          {health?.consultations?.map((consultation: any, idx: number) => (
            <Card
              key={idx}
              className="border-l-4 border-l-primary hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Professional Type Dropdown */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={`prof-type-${idx}`}
                      className="text-sm font-medium"
                    >
                      Professional Type <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id={`prof-type-${idx}`}
                      value={consultation.professionalType || ""}
                      onChange={(e) =>
                        handleInputChange(
                          `health.consultations.${idx}.professionalType`,
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Professional Type</option>
                      <option value="Counselor">Counselor</option>
                      <option value="Psychologist">Psychologist</option>
                      <option value="Psychiatrist">Psychiatrist</option>
                    </select>
                  </div>

                  {/* Date Field */}
                  <InputField
                    label="Date of Consultation"
                    type="date"
                    value={consultation.whenDate || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `health.consultations.${idx}.whenDate`,
                        val,
                      )
                    }
                  />

                  {/* Consulted Checkbox */}
                  <div className="flex items-end">
                    <div className="flex items-center gap-2 h-10">
                      <Checkbox
                        id={`consulted-${idx}`}
                        label="Has Consulted"
                        name="hasConsulted"
                        checked={consultation.hasConsulted || false}
                        onCheckedChange={(checked: boolean | "indeterminate") =>
                          handleInputChange(
                            `health.consultations.${idx}.hasConsulted`,
                            checked === true,
                          )
                        }
                      />
                      <Label
                        htmlFor={`consulted-${idx}`}
                        className="text-sm cursor-pointer"
                      >
                        Consulted
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Reason Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor={`reason-${idx}`}
                    className="text-sm font-medium"
                  >
                    Reason for Consultation
                  </Label>
                  <Textarea
                    id={`reason-${idx}`}
                    value={consultation.forWhat || ""}
                    onChange={(e) =>
                      handleInputChange(
                        `health.consultations.${idx}.forWhat`,
                        e.target.value,
                      )
                    }
                    placeholder="Describe the reason for consultation..."
                    className="min-h-20 text-sm"
                  />
                </div>

                {/* Remove Button */}
                <div className="flex justify-end pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={() => {
                      const updated = health.consultations.filter(
                        (_: any, i: number) => i !== idx,
                      );
                      handleInputChange("health.consultations", updated);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Consultation Button */}
          <div>
            <Button
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              onClick={() =>
                handleInputChange("health.consultations", [
                  ...(health?.consultations || []),
                  {
                    professionalType: "",
                    hasConsulted: false,
                    whenDate: "",
                    forWhat: "",
                  },
                ])
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Consultation Record
            </Button>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
});
