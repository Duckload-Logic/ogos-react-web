import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Activity,
  Eye,
  Ear,
  MessageSquare,
  HeartPulse,
  Brain,
  User,
  Users,
  Calendar,
  ChevronDown,
  Check
} from "lucide-react";
import { validateObject, isFieldRequired, validateField } from "@/services/validationSchema";
import { healthValidationSchema } from "@/features/iir/config/healthValidationSchema";
import { FormInput } from "@/components/form";
import { SectionContainer } from "./SectionContainer";

interface FormErrors {
  [key: string]: string;
}

interface HealthSectionRef {
  validate: () => { isValid: boolean; errors: FormErrors };
}

export const HealthSection = forwardRef<
  HealthSectionRef,
  {
    health: any;
    onChange: (path: string, value: any) => void;
    onFieldBlur?: (fieldPath: string) => void;
    shouldShowError?: (fieldPath: string) => boolean;
  }
>(function HealthSection({ health, onChange, onFieldBlur, shouldShowError }, ref) {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): { isValid: boolean; errors: FormErrors } => {
    // Helper to map consultations by type for easy access in rules
    const _consultations = (health?.consultations || []).reduce((acc: any, c: any) => {
      acc[c.professionalType] = c;
      return acc;
    }, {});

    const sectionErrors = validateObject({ health, _consultations }, healthValidationSchema);
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

    // Instant validation
    const fieldRules = healthValidationSchema[fieldPath];
    if (fieldRules) {
      const _consultations = (health?.consultations || []).reduce((acc: any, c: any) => {
        acc[c.professionalType] = c;
        return acc;
      }, {});

      const error = validateField(value, fieldRules, { health, _consultations });
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

    // Instant validation for the specific field
    const errorField = `_consultations.${professionalType}.${field === "consulted" ? "hasConsulted" : field}`;
    const fieldRules = healthValidationSchema[errorField];
    if (fieldRules) {
      // Re-map consultations for current context
      const _consultationsMap = consultations.reduce((acc: any, c: any) => {
        acc[c.professionalType] = c;
        return acc;
      }, {});

      const val = field === "consulted" ? value : value; // Simplified, value is already correct
      const error = validateField(value, fieldRules, { health, _consultations: _consultationsMap });

      setErrors((prev: FormErrors) => {
        const updated = { ...prev };
        if (error) updated[errorField] = error;
        else delete updated[errorField];
        return updated;
      });
    }

    if (onFieldBlur) {
      onFieldBlur(errorField);
    }
  };

  // Array of physical health items for A. Physical
  const physicalItems = [
    {
      label: "Your Vision",
      icon: Eye,
      yesKey: "health.healthRecord.visionHasProblem",
      detailsKey: "health.healthRecord.visionDetails",
      yesValue: health?.healthRecord?.visionHasProblem,
      detailsValue: health?.healthRecord?.visionDetails || "",
    },
    {
      label: "Your Hearing",
      icon: Ear,
      yesKey: "health.healthRecord.hearingHasProblem",
      detailsKey: "health.healthRecord.hearingDetails",
      yesValue: health?.healthRecord?.hearingHasProblem,
      detailsValue: health?.healthRecord?.hearingDetails || "",
    },
    {
      label: "Your Speech",
      icon: MessageSquare,
      yesKey: "health.healthRecord.speechHasProblem",
      detailsKey: "health.healthRecord.speechDetails",
      yesValue: health?.healthRecord?.speechHasProblem,
      detailsValue: health?.healthRecord?.speechDetails || "",
    },
    {
      label: "Your General Health",
      icon: HeartPulse,
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
      icon: type === "Psychiatrist" ? Brain : type === "Psychologist" ? User : Users,
      consulted: consultation?.hasConsulted,
      when: consultation?.whenDate || "",
      forWhat: consultation?.forWhat || "",
    };
  });

  const getFieldError = (fieldPath: string): string | undefined => {
    const hasError = errors[fieldPath];
    const showError = shouldShowError ? shouldShowError(fieldPath) : true;
    return hasError && showError ? errors[fieldPath] : undefined;
  };

  return (
    <SectionContainer
      title="Health Information"
      description="Physical and Psychological Well-being"
      icon={Activity}
    >
      <div className="space-y-12">
        {/* A. Physical Health */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1.5 bg-primary rounded-full" />
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">A. Physical Health</h3>
          </div>
          <p className="text-sm text-neutral-500 font-medium mb-6">Do you have any existing or previous problems with:</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {physicalItems.map((item, idx) => (
              <div
                key={idx}
                className={`
                  relative overflow-hidden bg-glass-bg/60 backdrop-blur-glass border rounded-[24px] p-5 sm:p-8 transition-all duration-300
                  ${item.yesValue === true
                    ? "border-primary/30 shadow-sm ring-1 ring-primary/10"
                    : "border-glass-border/40 hover:border-primary/20 hover:bg-glass-bg/80"
                  }
                `}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`
                    h-12 w-12 rounded-2xl flex items-center justify-center transition-colors duration-300
                    ${item.yesValue === true ? "bg-primary text-white" : "bg-primary/10 text-primary"}
                  `}>
                    <item.icon className="h-6 w-6" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white">{item.label}</h4>
                    {isFieldRequired(healthValidationSchema, item.yesKey) && (
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Required</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: "Yes", value: true },
                    { label: "No", value: false }
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleInputChange(item.yesKey, opt.value)}
                      className={`
                        relative h-12 flex items-center justify-center rounded-xl border transition-all duration-300 font-bold text-sm
                        ${item.yesValue === opt.value
                          ? "bg-primary border-primary text-white shadow-sm"
                          : "bg-glass-bg/40 border-glass-border/20 text-muted-foreground hover:border-primary/30"
                        }
                      `}
                    >
                      {item.yesValue === opt.value && (
                        <Check size={16} className="absolute left-4 animate-in zoom-in duration-300" strokeWidth={3} />
                      )}
                      {opt.label}
                    </button>
                  ))}
                </div>

                {item.yesValue === true && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <FormInput
                      label="Please specify details"
                      placeholder="Type details here..."
                      value={item.detailsValue}
                      onChange={(val: string) => handleInputChange(item.detailsKey, val)}
                      noSpecialCharacters={true}
                      error={getFieldError(item.detailsKey)}
                      required={isFieldRequired(healthValidationSchema, item.detailsKey)}
                    />
                  </div>
                )}
                {getFieldError(item.yesKey) && (
                  <p className="text-[11px] font-bold text-primary mt-2 flex items-center gap-1">
                    <span className="h-1 w-1 bg-primary rounded-full" />
                    {getFieldError(item.yesKey)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* B. Psychological */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1.5 bg-primary rounded-full" />
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">B. Psychological Consultations</h3>
          </div>
          <p className="text-sm text-neutral-500 font-medium mb-6">Have you ever consulted a:</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {consultationTypes.map((type, idx) => (
              <div
                key={idx}
                className={`
                  relative overflow-hidden bg-glass-bg/60 backdrop-blur-glass border rounded-[24px] p-5 sm:p-8 transition-all duration-300
                  ${type.consulted === true
                    ? "border-primary/30 shadow-sm ring-1 ring-primary/10"
                    : "border-glass-border/40 hover:border-primary/20 hover:bg-glass-bg/80"
                  }
                `}
              >
                <div className="flex flex-col items-center text-center mb-6">
                  <div className={`
                    h-16 w-16 rounded-[1.25rem] flex items-center justify-center mb-4 transition-all duration-300
                    ${type.consulted === true ? "bg-primary text-white scale-110" : "bg-primary/10 text-primary"}
                  `}>
                    <type.icon className="h-8 w-8" strokeWidth={2.5} />
                  </div>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-lg">{type.label}</h4>
                  {isFieldRequired(healthValidationSchema, `_consultations.${type.type}.hasConsulted`) && (
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider mt-1">Required</span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: "Yes", value: true },
                    { label: "No", value: false }
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleConsultationChange(type.type, "consulted", opt.value)}
                      className={`
                        relative h-11 flex items-center justify-center rounded-xl border transition-all duration-300 font-bold text-xs
                        ${type.consulted === opt.value
                          ? "bg-primary border-primary text-white shadow-sm"
                          : "bg-glass-bg/40 border-glass-border/20 text-muted-foreground hover:border-primary/30"
                        }
                      `}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {type.consulted === true && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <FormInput
                      label="When"
                      type="date"
                      value={type.when}
                      onChange={(val: string) => handleConsultationChange(type.type, "whenDate", val)}
                      error={getFieldError(`_consultations.${type.type}.whenDate`)}
                      required={isFieldRequired(healthValidationSchema, `_consultations.${type.type}.whenDate`)}
                    />
                    <FormInput
                      label="For What"
                      placeholder="Specify reason..."
                      value={type.forWhat}
                      onChange={(val: string) => handleConsultationChange(type.type, "forWhat", val)}
                      noSpecialCharacters={true}
                      error={getFieldError(`_consultations.${type.type}.forWhat`)}
                      required={isFieldRequired(healthValidationSchema, `_consultations.${type.type}.forWhat`)}
                    />
                  </div>
                )}
                {getFieldError(`_consultations.${type.type}.hasConsulted`) && (
                  <p className="text-[11px] font-bold text-primary mt-2 flex items-center gap-1 justify-center">
                    <span className="h-1 w-1 bg-primary rounded-full" />
                    {getFieldError(`_consultations.${type.type}.hasConsulted`)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </SectionContainer>
  );
});

