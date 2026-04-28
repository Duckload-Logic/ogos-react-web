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
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  validateObject,
  isFieldRequired,
  validateField,
} from "@/services/validationSchema";
import { healthValidationSchema } from "@/features/iir/config/healthValidationSchema";
import { FormInput } from "@/components/form";
import { SectionContainer } from "./SectionContainer";

interface FormErrors {
  [key: string]: string;
}

interface HealthSectionRef {
  validate: (step?: number) => { isValid: boolean; errors: FormErrors };
}

export const HealthSection = forwardRef<
  HealthSectionRef,
  {
    health: any;
    onChange: (path: string, value: any) => void;
    onFieldBlur?: (fieldPath: string) => void;
    shouldShowError?: (fieldPath: string) => boolean;
  }
>(function HealthSection(
  { health, onChange, onFieldBlur, shouldShowError },
  ref,
) {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (step?: number): { isValid: boolean; errors: FormErrors } => {
    // Helper to map consultations by type for easy access in rules
    const _consultations = (health?.consultations || []).reduce(
      (acc: any, c: any) => {
        acc[c.professionalType] = c;
        return acc;
      },
      {},
    );

    const sectionErrors = validateObject(
      { health, _consultations },
      healthValidationSchema,
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
      const _consultations = (health?.consultations || []).reduce(
        (acc: any, c: any) => {
          acc[c.professionalType] = c;
          return acc;
        },
        {},
      );

      const error = validateField(value, fieldRules, {
        health,
        _consultations,
      });
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
    value: any,
  ) => {
    const consultations = Array.isArray(health?.consultations)
      ? [...health.consultations]
      : [];

    const existingIndex = consultations.findIndex(
      (c: any) => c.professionalType === professionalType,
    );

    if (existingIndex >= 0) {
      // Update existing consultation
      consultations[existingIndex] = {
        ...consultations[existingIndex],
        [field === "consulted" ? "hasConsulted" : field]: value,
      };
    } else if (field === "consulted" || (value !== "" && value !== null)) {
      // Create a new record for any consulted click (yes or no)
      // or non-empty text fields
      consultations.push({
        professionalType,
        hasConsulted: field === "consulted" ? value : false,
        whenDate: field === "whenDate" ? value : null,
        forWhat: field === "forWhat" ? value : null,
      });
    }

    onChange("health.consultations", consultations);

    // Instant validation for the specific field
    const isConsulted = field === "consulted";
    const fieldName = isConsulted ? "hasConsulted" : field;
    const errorField = `_consultations.${professionalType}.${fieldName}`;
    const fieldRules = healthValidationSchema[errorField];
    if (fieldRules) {
      // Re-map consultations for current context
      const _consultationsMap = consultations.reduce((acc: any, c: any) => {
        acc[c.professionalType] = c;
        return acc;
      }, {});

      // val is already correct
      const val = value;
      const error = validateField(value, fieldRules, {
        health,
        _consultations: _consultationsMap,
      });

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
      icon:
        type === "Psychiatrist"
          ? Brain
          : type === "Psychologist"
            ? User
            : Users,
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
          <div className="mb-6 flex items-center gap-3">
            <div className="h-8 w-1.5 rounded-full bg-primary" />
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              A. Physical Health
            </h3>
          </div>
          <p className="mb-6 text-sm font-medium text-neutral-500">
            Do you have any existing or previous problems with:
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {physicalItems.map((item, idx) => (
              <div
                key={idx}
                className={cn(
                  "bg-glass-bg/60 relative overflow-hidden rounded-[24px]",
                  "border p-5 backdrop-blur-glass transition-all",
                  "duration-300 sm:p-8",
                  item.yesValue === true
                    ? "border-primary/30 shadow-sm ring-1 ring-primary/10"
                    : "border-glass-border/40 hover:bg-glass-bg/80 hover:border-primary/20",
                )}
              >
                <div className="mb-6 flex items-center gap-4">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl",
                      "transition-colors duration-300",
                      item.yesValue === true
                        ? "bg-primary text-white"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    <item.icon
                      className="h-6 w-6"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 dark:text-white">
                      {item.label}
                    </h4>
                    {isFieldRequired(healthValidationSchema, item.yesKey) && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        Required
                      </span>
                    )}
                  </div>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3">
                  {[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleInputChange(item.yesKey, opt.value)}
                      className={cn(
                        "relative flex h-12 items-center justify-center",
                        "rounded-xl border text-sm font-bold transition-all",
                        "duration-300",
                        item.yesValue === opt.value
                          ? "border-primary bg-primary text-white shadow-sm"
                          : "bg-glass-bg/40 border-glass-border/20 text-muted-foreground hover:border-primary/30",
                      )}
                    >
                      {item.yesValue === opt.value && (
                        <Check
                          size={16}
                          className="animate-in zoom-in absolute left-4 duration-300"
                          strokeWidth={3}
                        />
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
                      onChange={(val: string) =>
                        handleInputChange(item.detailsKey, val)
                      }
                      noSpecialCharacters={true}
                      error={getFieldError(item.detailsKey)}
                      required={isFieldRequired(
                        healthValidationSchema,
                        item.detailsKey,
                      )}
                    />
                  </div>
                )}
                {getFieldError(item.yesKey) && (
                  <p className="mt-2 flex items-center gap-1 text-[11px] font-bold text-primary">
                    <span className="h-1 w-1 rounded-full bg-primary" />
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
          <div className="mb-6 flex items-center gap-3">
            <div className="h-8 w-1.5 rounded-full bg-primary" />
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              B. Psychological Consultations
            </h3>
          </div>
          <p className="mb-6 text-sm font-medium text-neutral-500">
            Have you ever consulted a:
          </p>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {consultationTypes.map((type, idx) => (
              <div
                key={idx}
                className={cn(
                  "bg-glass-bg/60 relative overflow-hidden rounded-[24px]",
                  "border p-5 backdrop-blur-glass transition-all",
                  "duration-300 sm:p-8",
                  type.consulted === true
                    ? "border-primary/30 shadow-sm ring-1 ring-primary/10"
                    : "border-glass-border/40 hover:bg-glass-bg/80 hover:border-primary/20",
                )}
              >
                <div className="mb-6 flex flex-col items-center text-center">
                  <div
                    className={cn(
                      "mb-4 flex h-16 w-16 items-center justify-center",
                      "rounded-[1.25rem] transition-all duration-300",
                      type.consulted === true
                        ? "scale-110 bg-primary text-white"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    <type.icon
                      className="h-8 w-8"
                      strokeWidth={2.5}
                    />
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {type.label}
                  </h4>
                  {isFieldRequired(
                    healthValidationSchema,
                    `_consultations.${type.type}.hasConsulted`,
                  ) && (
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                      Required
                    </span>
                  )}
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3">
                  {[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() =>
                        handleConsultationChange(
                          type.type,
                          "consulted",
                          opt.value,
                        )
                      }
                      className={cn(
                        "relative flex h-11 items-center justify-center",
                        "rounded-xl border text-xs font-bold transition-all",
                        "duration-300",
                        type.consulted === opt.value
                          ? "border-primary bg-primary text-white shadow-sm"
                          : "bg-glass-bg/40 border-glass-border/20 text-muted-foreground hover:border-primary/30",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {type.consulted === true && (
                  <div className="animate-in fade-in slide-in-from-top-2 space-y-4 duration-300">
                    <FormInput
                      label="When"
                      type="date"
                      value={type.when}
                      onChange={(val: string) =>
                        handleConsultationChange(type.type, "whenDate", val)
                      }
                      error={getFieldError(
                        `_consultations.${type.type}.whenDate`,
                      )}
                      required={isFieldRequired(
                        healthValidationSchema,
                        `_consultations.${type.type}.whenDate`,
                      )}
                    />
                    <FormInput
                      label="For What"
                      placeholder="Specify reason..."
                      value={type.forWhat}
                      onChange={(val: string) =>
                        handleConsultationChange(type.type, "forWhat", val)
                      }
                      noSpecialCharacters={true}
                      error={getFieldError(
                        `_consultations.${type.type}.forWhat`,
                      )}
                      required={isFieldRequired(
                        healthValidationSchema,
                        `_consultations.${type.type}.forWhat`,
                      )}
                    />
                  </div>
                )}
                {getFieldError(`_consultations.${type.type}.hasConsulted`) && (
                  <p
                    className={cn(
                      "mt-2 flex items-center justify-center gap-1",
                      "text-[11px] font-bold text-primary",
                    )}
                  >
                    <span className="h-1 w-1 rounded-full bg-primary" />
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
