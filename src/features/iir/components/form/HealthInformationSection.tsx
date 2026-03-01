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

  // Array of physical health items for A. Physical
  const physicalItems = [
    {
      label: "Your Vision",
      yesKey: "health.healthRecord.visionHasProblem",
      detailsKey: "health.healthRecord.visionDetails",
      yesValue: health?.healthRecord?.visionHasProblem === true,
      detailsValue: health?.healthRecord?.visionDetails || "",
    },
    {
      label: "Your Hearing",
      yesKey: "health.healthRecord.hearingHasProblem",
      detailsKey: "health.healthRecord.hearingDetails",
      yesValue: health?.healthRecord?.hearingHasProblem === true,
      detailsValue: health?.healthRecord?.hearingDetails || "",
    },
    {
      label: "Your Speech",
      yesKey: "health.healthRecord.speechHasProblem",
      detailsKey: "health.healthRecord.speechDetails",
      yesValue: health?.healthRecord?.speechHasProblem === true,
      detailsValue: health?.healthRecord?.speechDetails || "",
    },
    {
      label: "Your General Health",
      yesKey: "health.healthRecord.generalHealthHasProblem",
      detailsKey: "health.healthRecord.generalHealthDetails",
      yesValue: health?.healthRecord?.generalHealthHasProblem === true,
      detailsValue: health?.healthRecord?.generalHealthDetails || "",
    },
  ];

  // Array of psychological consultation types
  const consultationTypes = [
    {
      label: "Psychiatrist",
      yesKey: "health.consultations.psychiatrist.consulted",
      whenKey: "health.consultations.psychiatrist.when",
      forWhatKey: "health.consultations.psychiatrist.forWhat",
      consulted: health?.consultations?.psychiatrist?.consulted,
      when: health?.consultations?.psychiatrist?.when || "",
      forWhat: health?.consultations?.psychiatrist?.forWhat || "",
    },
    {
      label: "Psychologist",
      yesKey: "health.consultations.psychologist.consulted",
      whenKey: "health.consultations.psychologist.when",
      forWhatKey: "health.consultations.psychologist.forWhat",
      consulted: health?.consultations?.psychologist?.consulted,
      when: health?.consultations?.psychologist?.when || "",
      forWhat: health?.consultations?.psychologist?.forWhat || "",
    },
    {
      label: "Counselor",
      yesKey: "health.consultations.counselor.consulted",
      whenKey: "health.consultations.counselor.when",
      forWhatKey: "health.consultations.counselor.forWhat",
      consulted: health?.consultations?.counselor?.consulted,
      when: health?.consultations?.counselor?.when || "",
      forWhat: health?.consultations?.counselor?.forWhat || "",
    },
  ];

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
                      <input
                        type="radio"
                        name={`physical-${idx}`}
                        value="yes"
                        checked={item.yesValue === true}
                        onChange={() => handleInputChange(item.yesKey, true)}
                        className="w-4 h-4 cursor-pointer accent-red-600"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="radio"
                        name={`physical-${idx}`}
                        value="no"
                        checked={item.yesValue === false}
                        onChange={() => handleInputChange(item.yesKey, false)}
                        className="w-4 h-4 cursor-pointer accent-red-600"
                      />
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
                            ? "border-border bg-white dark:!bg-neutral-800 focus:border-border focus:ring-ring/20"
                            : "border-border bg-white dark:!bg-neutral-800 opacity-50 text-foreground cursor-not-allowed"
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
                      <input
                        type="radio"
                        name={`consultation-${idx}`}
                        value="yes"
                        checked={type.consulted === true}
                        onChange={() => handleInputChange(type.yesKey, true)}
                        className="w-4 h-4 cursor-pointer accent-red-600"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <input
                        type="radio"
                        name={`consultation-${idx}`}
                        value="no"
                        checked={type.consulted === false}
                        onChange={() => handleInputChange(type.yesKey, false)}
                        className="w-4 h-4 cursor-pointer accent-red-600"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        placeholder="Date/When"
                        disabled={type.consulted !== true}
                        value={type.when}
                        onChange={(e) =>
                          handleInputChange(type.whenKey, e.target.value)
                        }
                        className={`w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 text-sm transition-colors ${
                          type.consulted === true
                            ? "border-border bg-white dark:!bg-neutral-800 focus:border-border focus:ring-ring/20"
                            : "border-border bg-white dark:!bg-neutral-800 opacity-50 text-foreground cursor-not-allowed"
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
                          handleInputChange(type.forWhatKey, e.target.value)
                        }
                        className={`w-full px-3 py-1 border rounded-md focus:outline-none focus:ring-2 text-sm transition-colors ${
                          type.consulted === true
                            ? "border-border bg-white dark:!bg-neutral-800 focus:border-border focus:ring-ring/20"
                            : "border-border bg-white dark:!bg-neutral-800 opacity-50 text-foreground cursor-not-allowed"
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
