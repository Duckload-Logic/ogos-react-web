import { forwardRef, useImperativeHandle, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

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

  const handleConsultationChange = (
    professionalType: string,
    field: "consulted" | "whenDate" | "forWhat",
    value: any
  ) => {
    const consultations = Array.isArray(health?.consultations)
      ? [...health.consultations]
      : [];

    const existingIndex = consultations.findIndex(
      (c: any) => c.professionalType === professionalType
    );

    if (existingIndex >= 0) {
      // Update existing consultation
      consultations[existingIndex] = {
        ...consultations[existingIndex],
        [field === "consulted" ? "hasConsulted" : field]: value,
      };
    } else if (field === "consulted" || (value !== "" && value !== null)) {
      // Create a new record for any consulted click (yes or no) or non-empty text fields
      consultations.push({
        professionalType,
        hasConsulted: field === "consulted" ? value : false,
        whenDate: field === "whenDate" ? value : null,
        forWhat: field === "forWhat" ? value : null,
      });
    }

    onChange("health.consultations", consultations);
  };

  // Array of physical health items for A. Physical
  const physicalItems = [
    {
      label: "Your Vision",
      yesKey: "health.healthRecord.visionHasProblem",
      detailsKey: "health.healthRecord.visionDetails",
      yesValue: health?.healthRecord?.visionHasProblem,
      detailsValue: health?.healthRecord?.visionDetails || "",
    },
    {
      label: "Your Hearing",
      yesKey: "health.healthRecord.hearingHasProblem",
      detailsKey: "health.healthRecord.hearingDetails",
      yesValue: health?.healthRecord?.hearingHasProblem,
      detailsValue: health?.healthRecord?.hearingDetails || "",
    },
    {
      label: "Your Speech",
      yesKey: "health.healthRecord.speechHasProblem",
      detailsKey: "health.healthRecord.speechDetails",
      yesValue: health?.healthRecord?.speechHasProblem,
      detailsValue: health?.healthRecord?.speechDetails || "",
    },
    {
      label: "Your General Health",
      yesKey: "health.healthRecord.generalHealthHasProblem",
      detailsKey: "health.healthRecord.generalHealthDetails",
      yesValue: health?.healthRecord?.generalHealthHasProblem,
      detailsValue: health?.healthRecord?.generalHealthDetails || "",
    },
  ];

  // Array of psychological consultation types
  const professionalTypes = ["Psychiatrist", "Psychologist", "Counselor"];
  
  const consultationTypes = professionalTypes.map((type) => {
    const consultation = Array.isArray(health?.consultations)
      ? health.consultations.find((c: any) => c.professionalType === type)
      : null;
    
    return {
      label: type,
      type: type,
      consulted: consultation?.hasConsulted,
      when: consultation?.whenDate || "",
      forWhat: consultation?.forWhat || "",
    };
  });

  return (
    <Card className="bg-card border border-border">
      <CardContent className="pt-6">
        {/* A. Physical */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            A. Physical
          </h3>
          <p className="text-sm text-foreground mb-6">
            Do you have problems with: (Please Check)
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left text-sm font-medium text-card-foreground py-2 px-3 min-w-24">Item</th>
                  <th className="text-center text-sm font-medium text-card-foreground py-2 px-3 w-16">YES</th>
                  <th className="text-center text-sm font-medium text-card-foreground py-2 px-3 w-16">NO</th>
                  <th className="text-left text-sm font-medium text-card-foreground py-2 px-3">If Yes, please specify</th>
                </tr>
              </thead>
              <tbody>
                  {physicalItems.map((item, idx) => (
                  <tr key={idx} className="border-b border-border">
                    <td className="py-2 px-3 text-sm text-foreground">{item.label}</td>
                    <td className="py-2 px-3 text-center">
                      <div className="relative flex items-center justify-center h-4 w-4 mx-auto">
                        <input
                          type="radio"
                          name={`physical-${idx}`}
                          value="yes"
                          checked={item.yesValue === true}
                          onChange={() => handleInputChange(item.yesKey, true)}
                          className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                        <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="relative flex items-center justify-center h-4 w-4 mx-auto">
                        <input
                          type="radio"
                          name={`physical-${idx}`}
                          value="no"
                          checked={item.yesValue === false}
                          onChange={() => handleInputChange(item.yesKey, false)}
                          className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                        <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        placeholder="Specify"
                        disabled={item.yesValue !== true}
                        value={item.yesValue === true ? item.detailsValue : ""}
                        onChange={(e) =>
                          handleInputChange(item.detailsKey, e.target.value)
                        }
                        className={`w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 text-sm transition-colors ${
                          item.yesValue === true
                            ? "border-border bg-card focus:border-border focus:ring-ring/20"
                            : "border-border bg-card opacity-50 text-foreground cursor-not-allowed"
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* B. Psychological */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            B. Psychological
          </h3>
          <p className="text-sm text-foreground mb-6">
            Previous Consultations
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-border">
                  <th className="text-left text-sm font-medium text-card-foreground py-2 px-3">Consulted</th>
                  <th className="text-center text-sm font-medium text-card-foreground py-2 px-3 w-16">YES</th>
                  <th className="text-center text-sm font-medium text-card-foreground py-2 px-3 w-16">NO</th>
                  <th className="text-left text-sm font-medium text-card-foreground py-2 px-3">When</th>
                  <th className="text-left text-sm font-medium text-card-foreground py-2 px-3">If Yes, please specify</th>
                </tr>
              </thead>
              <tbody>
                {consultationTypes.map((type, idx) => (
                  <tr key={idx} className="border-b border-border">
                    <td className="py-2 px-3 text-sm text-foreground">{type.label}</td>
                    <td className="py-2 px-3 text-center">
                      <div className="relative flex items-center justify-center h-4 w-4 mx-auto">
                        <input
                          type="radio"
                          name={`consultation-${idx}`}
                          value="yes"
                          checked={type.consulted === true}
                          onChange={() =>
                            handleConsultationChange(type.type, "consulted", true)
                          }
                          className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                        <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <div className="relative flex items-center justify-center h-4 w-4 mx-auto">
                        <input
                          type="radio"
                          name={`consultation-${idx}`}
                          value="no"
                          checked={type.consulted === false}
                          onChange={() =>
                            handleConsultationChange(type.type, "consulted", false)
                          }
                          className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                        <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        placeholder="Date/When"
                        disabled={type.consulted !== true}
                        value={type.when}
                        onChange={(e) =>
                          handleConsultationChange(
                            type.type,
                            "whenDate",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 text-sm transition-colors ${
                          type.consulted === true
                            ? "border-border bg-card focus:border-border focus:ring-ring/20"
                            : "border-border bg-card opacity-50 text-foreground cursor-not-allowed"
                        }`}
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        placeholder="Specify"
                        disabled={type.consulted !== true}
                        value={type.consulted === true ? type.forWhat : ""}
                        onChange={(e) =>
                          handleConsultationChange(
                            type.type,
                            "forWhat",
                            e.target.value
                          )
                        }
                        className={`w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 text-sm transition-colors ${
                          type.consulted === true
                            ? "border-border bg-card focus:border-border focus:ring-ring/20"
                            : "border-border bg-card opacity-50 text-foreground cursor-not-allowed"
                        }`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
