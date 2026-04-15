import { forwardRef, useImperativeHandle, useState, useRef } from "react";
import {
  Users,
  CircleDollarSign,
  ChevronDown,
  Check,
  Home,
  Heart,
  TrendingUp,
  User,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  MapPin,
  Calendar,
  GraduationCap,
} from "lucide-react";
import {
  FormInput,
  Checkbox,
  Radio,
  Dropdown,
} from "@/components/form";
import { SectionContainer } from "./SectionContainer";
import { validateObject, isFieldRequired, validateField } from "@/services/validationSchema";
import { familyValidationSchema } from "@/features/iir/config/familyValidationSchema";
import {
  useIncomeRanges,
  useNatureOfResidenceTypes,
  useParentalStatusTypes,
  useSiblingSupportTypes,
  useStudentSupportTypes,
} from "../../hooks";
import { ParentalStatus } from "../../types";

interface FormErrors {
  [key: string]: string;
}

interface FamilySectionRef {
  validate: () => { isValid: boolean; errors: FormErrors };
}

export const FamilySection = forwardRef<
  FamilySectionRef,
  {
    family: any;
    onChange: (path: string, value: any) => void;
    onFieldBlur?: (fieldPath: string) => void;
    shouldShowError?: (fieldPath: string) => boolean;
  }
>(function FamilySection(
  { family, onChange, onFieldBlur, shouldShowError },
  ref,
) {
  const { data: parentalStatusOptions } = useParentalStatusTypes();
  const { data: natureOfResidenceOptions } = useNatureOfResidenceTypes();
  const { data: monthlyFamilyIncomeRanges } = useIncomeRanges();
  const { data: siblingSupportTypesOptions } = useSiblingSupportTypes();
  const { data: studentSupportTypesOptions } = useStudentSupportTypes();

  const [errors, setErrors] = useState<FormErrors>({});
  const [otherTouched, setOtherTouched] = useState(false);
  const otherInputRef = useRef<HTMLInputElement | null>(null);

  const FATHER_IDX = 0;
  const MOTHER_IDX = 1;
  const GUARDIAN_IDX = 2;

  const validate = (): { isValid: boolean; errors: FormErrors } => {
    const sectionErrors = validateObject({ family }, familyValidationSchema);
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

    // Instant validation
    const fieldRules = familyValidationSchema[fieldPath];
    if (fieldRules) {
      const error = validateField(value, fieldRules, { family });
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

  /**
   * Helper to determine if error should be displayed for a field
   * Only show error if field is touched (or form submitted) AND has an error
   */
  const getFieldError = (fieldPath: string): string | undefined => {
    const hasError = errors[fieldPath];
    const showError = shouldShowError ? shouldShowError(fieldPath) : true;
    return hasError && showError ? errors[fieldPath] : undefined;
  };

  /**
   * Handle blur event for a field
   */
  const handleFieldBlur = (fieldPath: string) => {
    if (onFieldBlur) {
      onFieldBlur(fieldPath);
    }
  };

  return (
    <SectionContainer
      title="Family Background"
      description="Details about your family structure, parental status, and living arrangements"
      icon={Users}
    >
      <div className="space-y-12">
        {/* I. Parental Status */}
        <div className="bg-glass-bg/60 backdrop-blur-glass rounded-[24px] p-5 sm:p-8 border border-glass-border/40 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Parental Status
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Please indicate the current marital/legal status of your parents
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {parentalStatusOptions?.map((option: any) => {
              const isOther =
                option.name?.toLowerCase() === "other" ||
                option.text?.toLowerCase() === "other";
              const isSelected =
                String(
                  (family?.background?.parentalStatus as any)?.id || "",
                ) === String(option.id);

              return (
                <div key={option.id} className="relative group">
                  <button
                    type="button"
                    onClick={() =>
                      handleInputChange("family.background.parentalStatus", {
                        id: Number(option.id),
                      })
                    }
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${isSelected
                      ? "bg-primary/5 border-primary shadow-sm"
                      : "bg-glass-bg/40 border-glass-border/20 hover:bg-glass-bg/60 hover:border-primary/20"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${isSelected ? "bg-primary scale-110 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-muted"}`}
                      />
                      <span
                        className={`text-sm font-bold transition-colors duration-300 text-left ${isSelected ? "text-primary" : "text-foreground/70 group-hover:text-foreground"}`}
                      >
                        {option.name || option.text || option.code}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-primary stroke-[2.5]" />
                    )}
                  </button>

                  {isOther && isSelected && (
                    <div className="mt-4 px-1 animate-fade-in">
                      <FormInput
                        name="family.background.parentalStatusOther"
                        label="Please Specify"
                        value={family?.background?.parentalStatusOther || ""}
                        onChange={(val) =>
                          handleInputChange(
                            "family.background.parentalStatusOther",
                            val,
                          )
                        }
                        placeholder="Please specify..."
                        error={errors["family.background.parentalStatusOther"]}
                        required
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {errors["family.background.parentalStatus"] && (
            <p className="text-xs font-bold text-destructive mt-4 ml-1 flex items-center gap-1.5 animate-bounce">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors["family.background.parentalStatus"]}
            </p>
          )}
        </div>

        {/* II. Living Situation */}
        <div className="bg-glass-bg/60 backdrop-blur-glass rounded-[24px] p-5 sm:p-8 border border-glass-border/40 shadow-sm transition-all duration-300 hover:shadow-md">
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 shadow-sm">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Living Situation
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Environment and nature of your current residence
              </p>
            </div>
          </div>

          <div className="space-y-6 sm:y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-glass-bg/40 backdrop-blur-sm rounded-[20px] p-5 sm:p-6 border border-glass-border/20 transition-all duration-300 hover:bg-glass-bg/60">
                <p className="text-sm font-bold text-foreground/80 mb-4 block flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Do you have a quiet place to study?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {["yes", "no"].map((val) => {
                    const isSelected =
                      family?.background?.haveQuietPlaceToStudy ===
                      (val === "yes");
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() =>
                          handleInputChange(
                            "family.background.haveQuietPlaceToStudy",
                            val === "yes",
                          )
                        }
                        className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all duration-300 ${isSelected
                          ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 shadow-sm"
                          : "bg-white/20 border-glass-border/20 text-muted-foreground hover:bg-white/40"
                          }`}
                      >
                        {val.charAt(0).toUpperCase() + val.slice(1)}
                      </button>
                    );
                  })}
                </div>
                {errors["family.background.haveQuietPlaceToStudy"] && (
                  <p className="text-[10px] font-bold text-destructive mt-2 ml-1">
                    {errors["family.background.haveQuietPlaceToStudy"]}
                  </p>
                )}
              </div>

              <div className="bg-glass-bg/40 backdrop-blur-sm rounded-[20px] p-5 sm:p-6 border border-glass-border/20 transition-all duration-300 hover:bg-glass-bg/60">
                <p className="text-sm font-bold text-foreground/80 mb-4 block flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Do you share your room with anyone?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {["yes", "no"].map((val) => {
                    const isSelected =
                      family?.background?.isSharingRoom === (val === "yes");
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() =>
                          handleInputChange(
                            "family.background.isSharingRoom",
                            val === "yes",
                          )
                        }
                        className={`py-2.5 px-4 rounded-xl border text-sm font-bold transition-all duration-300 ${isSelected
                          ? "bg-indigo-500/10 border-indigo-500 text-indigo-600 shadow-sm"
                          : "bg-white/20 border-glass-border/20 text-muted-foreground hover:bg-white/40"
                          }`}
                      >
                        {val.charAt(0).toUpperCase() + val.slice(1)}
                      </button>
                    );
                  })}
                </div>
                {errors["family.background.isSharingRoom"] && (
                  <p className="text-[10px] font-bold text-destructive mt-2 ml-1">
                    {errors["family.background.isSharingRoom"]}
                  </p>
                )}

                {family?.background?.isSharingRoom === true && (
                  <div className="mt-4 animate-fade-in">
                    <FormInput
                      name="family.background.roomSharingDetails"
                      label="Share room with whom?"
                      value={family?.background?.roomSharingDetails || ""}
                      onChange={(val) =>
                        handleInputChange(
                          "family.background.roomSharingDetails",
                          val,
                        )
                      }
                      onBlur={() =>
                        handleFieldBlur("family.background.roomSharingDetails")
                      }
                      error={getFieldError(
                        "family.background.roomSharingDetails",
                      )}
                      placeholder="e.g. siblings, parents..."
                      required
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="bg-glass-bg/40 backdrop-blur-sm rounded-[24px] p-5 sm:p-6 border border-glass-border/20 transition-all duration-300 hover:bg-glass-bg/60">
              <label className="text-sm font-bold text-foreground/80 mb-6 block flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Nature of Residence
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {natureOfResidenceOptions?.map((option: any) => {
                  const isSelected =
                    String(
                      (family?.background?.natureOfResidence as any)?.id || "",
                    ) === String(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() =>
                        handleInputChange(
                          "family.background.natureOfResidence",
                          { id: Number(option.id) },
                        )
                      }
                      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 ${isSelected
                        ? "bg-indigo-500/10 border-indigo-500 shadow-sm"
                        : "bg-white/20 border-glass-border/20 hover:bg-white/40"
                        }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${isSelected ? "bg-indigo-500 scale-110" : "bg-muted"}`}
                      />
                      <span
                        className={`text-xs font-bold text-left ${isSelected ? "text-indigo-600" : "text-foreground/70"}`}
                      >
                        {option.name || option.text || option.code}
                      </span>
                    </button>
                  );
                })}
              </div>
              {errors["family.background.natureOfResidence"] && (
                <p className="text-[10px] font-bold text-destructive mt-4 ml-1">
                  {errors["family.background.natureOfResidence"]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* III. Family Members Information */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.1)]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Family Members Information
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Detailed information about your parents and guardian
              </p>
            </div>
          </div>

          {/* Father Card */}
          <div className="group bg-glass-bg/60 backdrop-blur-glass rounded-[24px] border border-glass-border/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="px-5 sm:px-8 py-4 sm:py-5 bg-glass-bg/40 border-b border-glass-border/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-sm text-primary">
                  <User className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-foreground">
                  Father's Information
                </h4>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {["Living", "Deceased"].map((status) => {
                  const isLiving = status === "Living";
                  const currentPerson = family?.relatedPersons?.[FATHER_IDX] || {};
                  const isSelected = (currentPerson.isLiving ?? true) === isLiving;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        handleInputChange(
                          `family.relatedPersons.${FATHER_IDX}.isLiving`,
                          isLiving,
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border ${isSelected
                        ? isLiving
                          ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-600"
                          : "bg-rose-500/10 border-rose-500/50 text-rose-600"
                        : "bg-glass-bg/40 border-glass-border/20 text-muted-foreground"
                        }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 mb-6 sm:mb-8">
                <FormInput
                  name={`family.relatedPersons.${FATHER_IDX}.firstName`}
                  label="First Name"
                  required
                  value={family?.relatedPersons?.[FATHER_IDX]?.firstName || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${FATHER_IDX}.firstName`,
                      val,
                    )
                  }
                  noSpecialCharacters={true}
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${FATHER_IDX}.firstName`,
                    )
                  }
                  placeholder="First name"
                  error={getFieldError(
                    `family.relatedPersons.${FATHER_IDX}.firstName`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${FATHER_IDX}.middleName`}
                  label="Middle Name"
                  value={family?.relatedPersons?.[FATHER_IDX]?.middleName || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${FATHER_IDX}.middleName`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${FATHER_IDX}.middleName`,
                    )
                  }
                  placeholder="Middle name"
                  error={getFieldError(
                    `family.relatedPersons.${FATHER_IDX}.middleName`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${FATHER_IDX}.lastName`}
                  label="Last Name"
                  required
                  value={family?.relatedPersons?.[FATHER_IDX]?.lastName || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${FATHER_IDX}.lastName`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${FATHER_IDX}.lastName`,
                    )
                  }
                  placeholder="Last name"
                  error={getFieldError(
                    `family.relatedPersons.${FATHER_IDX}.lastName`,
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormInput
                  name={`family.relatedPersons.${FATHER_IDX}.dateOfBirth`}
                  label="Date of Birth"
                  type="date"
                  required
                  value={family?.relatedPersons?.[FATHER_IDX]?.dateOfBirth || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${FATHER_IDX}.dateOfBirth`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${FATHER_IDX}.dateOfBirth`,
                    )
                  }
                  error={getFieldError(
                    `family.relatedPersons.${FATHER_IDX}.dateOfBirth`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${FATHER_IDX}.educationalLevel`}
                  label="Educational Attainment"
                  required
                  value={
                    family?.relatedPersons?.[FATHER_IDX]?.educationalLevel || ""
                  }
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${FATHER_IDX}.educationalLevel`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${FATHER_IDX}.educationalLevel`,
                    )
                  }
                  placeholder="e.g. College Graduate"
                  error={getFieldError(
                    `family.relatedPersons.${FATHER_IDX}.educationalLevel`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${FATHER_IDX}.occupation`}
                  label="Occupation"
                  required
                  value={family?.relatedPersons?.[FATHER_IDX]?.occupation || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${FATHER_IDX}.occupation`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${FATHER_IDX}.occupation`,
                    )
                  }
                  placeholder="e.g. Engineer"
                  error={getFieldError(
                    `family.relatedPersons.${FATHER_IDX}.occupation`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${FATHER_IDX}.employerName`}
                  label="Name of Employer"
                  required
                  value={
                    family?.relatedPersons?.[FATHER_IDX]?.employerName || ""
                  }
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${FATHER_IDX}.employerName`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${FATHER_IDX}.employerName`,
                    )
                  }
                  placeholder="Company name"
                  error={getFieldError(
                    `family.relatedPersons.${FATHER_IDX}.employerName`,
                  )}
                />
                <div className="md:col-span-2">
                  <FormInput
                    name={`family.relatedPersons.${FATHER_IDX}.employerAddress`}
                    label="Address of Employer"
                    value={
                      family?.relatedPersons?.[FATHER_IDX]?.employerAddress || ""
                    }
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${FATHER_IDX}.employerAddress`,
                        val,
                      )
                    }
                    onBlur={() =>
                      handleFieldBlur(
                        `family.relatedPersons.${FATHER_IDX}.employerAddress`,
                      )
                    }
                    placeholder="Company address"
                    noSpecialCharacters={true}
                    error={getFieldError(
                      `family.relatedPersons.${FATHER_IDX}.employerAddress`,
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mother Card */}
          <div className="group bg-glass-bg/60 backdrop-blur-glass rounded-[24px] border border-glass-border/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="px-5 sm:px-8 py-4 sm:py-5 bg-glass-bg/40 border-b border-glass-border/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-sm text-primary">
                  <User className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-foreground">
                  Mother's Information
                </h4>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {["Living", "Deceased"].map((status) => {
                  const isLiving = status === "Living";
                  const currentPerson = family?.relatedPersons?.[MOTHER_IDX] || {};
                  const isSelected = (currentPerson.isLiving ?? true) === isLiving;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        handleInputChange(
                          `family.relatedPersons.${MOTHER_IDX}.isLiving`,
                          isLiving,
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border ${isSelected
                        ? isLiving
                          ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-600"
                          : "bg-rose-500/10 border-rose-500/50 text-rose-600"
                        : "bg-glass-bg/40 border-glass-border/20 text-muted-foreground"
                        }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 mb-6 sm:mb-8">
                <FormInput
                  name={`family.relatedPersons.${MOTHER_IDX}.firstName`}
                  label="First Name"
                  required
                  value={family?.relatedPersons?.[MOTHER_IDX]?.firstName || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${MOTHER_IDX}.firstName`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${MOTHER_IDX}.firstName`,
                    )
                  }
                  placeholder="First name"
                  error={getFieldError(
                    `family.relatedPersons.${MOTHER_IDX}.firstName`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${MOTHER_IDX}.middleName`}
                  label="Middle Name"
                  required
                  value={family?.relatedPersons?.[MOTHER_IDX]?.middleName || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${MOTHER_IDX}.middleName`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${MOTHER_IDX}.middleName`,
                    )
                  }
                  placeholder="Middle name"
                  error={getFieldError(
                    `family.relatedPersons.${MOTHER_IDX}.middleName`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${MOTHER_IDX}.lastName`}
                  label="Last Name"
                  required
                  value={family?.relatedPersons?.[MOTHER_IDX]?.lastName || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${MOTHER_IDX}.lastName`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${MOTHER_IDX}.lastName`,
                    )
                  }
                  placeholder="Last name"
                  error={getFieldError(
                    `family.relatedPersons.${MOTHER_IDX}.lastName`,
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormInput
                  name={`family.relatedPersons.${MOTHER_IDX}.dateOfBirth`}
                  label="Date of Birth"
                  type="date"
                  required
                  value={family?.relatedPersons?.[MOTHER_IDX]?.dateOfBirth || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${MOTHER_IDX}.dateOfBirth`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${MOTHER_IDX}.dateOfBirth`,
                    )
                  }
                  error={getFieldError(
                    `family.relatedPersons.${MOTHER_IDX}.dateOfBirth`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${MOTHER_IDX}.educationalLevel`}
                  label="Educational Attainment"
                  required
                  value={
                    family?.relatedPersons?.[MOTHER_IDX]?.educationalLevel || ""
                  }
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${MOTHER_IDX}.educationalLevel`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${MOTHER_IDX}.educationalLevel`,
                    )
                  }
                  placeholder="e.g. College Graduate"
                  error={getFieldError(
                    `family.relatedPersons.${MOTHER_IDX}.educationalLevel`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${MOTHER_IDX}.occupation`}
                  label="Occupation"
                  required
                  value={family?.relatedPersons?.[MOTHER_IDX]?.occupation || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${MOTHER_IDX}.occupation`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${MOTHER_IDX}.occupation`,
                    )
                  }
                  placeholder="e.g. Engineer"
                  error={getFieldError(
                    `family.relatedPersons.${MOTHER_IDX}.occupation`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${MOTHER_IDX}.employerName`}
                  label="Name of Employer"
                  required={isFieldRequired(
                    familyValidationSchema,
                    `family.relatedPersons.${MOTHER_IDX}.employerName`,
                  )}
                  value={
                    family?.relatedPersons?.[MOTHER_IDX]?.employerName || ""
                  }
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${MOTHER_IDX}.employerName`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${MOTHER_IDX}.employerName`,
                    )
                  }
                  placeholder="Company name"
                  error={getFieldError(
                    `family.relatedPersons.${MOTHER_IDX}.employerName`,
                  )}
                />
                <div className="md:col-span-2">
                  <FormInput
                    name={`family.relatedPersons.${MOTHER_IDX}.employerAddress`}
                    label="Address of Employer"
                    value={
                      family?.relatedPersons?.[MOTHER_IDX]?.employerAddress || ""
                    }
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${MOTHER_IDX}.employerAddress`,
                        val,
                      )
                    }
                    onBlur={() =>
                      handleFieldBlur(
                        `family.relatedPersons.${MOTHER_IDX}.employerAddress`,
                      )
                    }
                    placeholder="Company address"
                    error={getFieldError(
                      `family.relatedPersons.${MOTHER_IDX}.employerAddress`,
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border my-6"></div>

          {/* Guardian Card */}
          <div className="group bg-glass-bg/60 backdrop-blur-glass rounded-[24px] border border-glass-border/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            <div className="px-5 sm:px-8 py-4 sm:py-5 bg-glass-bg/40 border-b border-glass-border/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-sm text-primary">
                  <User className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-foreground">
                  Guardian's Information
                </h4>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {["Living", "Deceased"].map((status) => {
                  const isLiving = status === "Living";
                  const isSelected =
                    family?.relatedPersons?.[GUARDIAN_IDX]?.isLiving ===
                    isLiving;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        handleInputChange(
                          `family.relatedPersons.${GUARDIAN_IDX}.isLiving`,
                          isLiving,
                        )
                      }
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 border ${isSelected
                        ? isLiving
                          ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-600"
                          : "bg-rose-500/10 border-rose-500/50 text-rose-600"
                        : "bg-glass-bg/40 border-glass-border/20 text-muted-foreground"
                        }`}
                    >
                      {status}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-5 sm:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 mb-6 sm:mb-8">
                <FormInput
                  name={`family.relatedPersons.${GUARDIAN_IDX}.firstName`}
                  label="First Name"
                  required
                  value={family?.relatedPersons?.[GUARDIAN_IDX]?.firstName || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${GUARDIAN_IDX}.firstName`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${GUARDIAN_IDX}.firstName`,
                    )
                  }
                  placeholder="First name"
                  error={getFieldError(
                    `family.relatedPersons.${GUARDIAN_IDX}.firstName`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${GUARDIAN_IDX}.middleName`}
                  label="Middle Name"
                  value={
                    family?.relatedPersons?.[GUARDIAN_IDX]?.middleName || ""
                  }
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${GUARDIAN_IDX}.middleName`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${GUARDIAN_IDX}.middleName`,
                    )
                  }
                  placeholder="Middle name"
                  error={getFieldError(
                    `family.relatedPersons.${GUARDIAN_IDX}.middleName`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${GUARDIAN_IDX}.lastName`}
                  label="Last Name"
                  required
                  value={family?.relatedPersons?.[GUARDIAN_IDX]?.lastName || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${GUARDIAN_IDX}.lastName`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${GUARDIAN_IDX}.lastName`,
                    )
                  }
                  placeholder="Last name"
                  error={getFieldError(
                    `family.relatedPersons.${GUARDIAN_IDX}.lastName`,
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormInput
                  name={`family.relatedPersons.${GUARDIAN_IDX}.dateOfBirth`}
                  label="Date of Birth"
                  type="date"
                  required
                  value={
                    family?.relatedPersons?.[GUARDIAN_IDX]?.dateOfBirth || ""
                  }
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${GUARDIAN_IDX}.dateOfBirth`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${GUARDIAN_IDX}.dateOfBirth`,
                    )
                  }
                  error={getFieldError(
                    `family.relatedPersons.${GUARDIAN_IDX}.dateOfBirth`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${GUARDIAN_IDX}.educationalLevel`}
                  label="Educational Attainment"
                  required
                  value={
                    family?.relatedPersons?.[GUARDIAN_IDX]?.educationalLevel ||
                    ""
                  }
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${GUARDIAN_IDX}.educationalLevel`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${GUARDIAN_IDX}.educationalLevel`,
                    )
                  }
                  placeholder="e.g. College Graduate"
                  error={getFieldError(
                    `family.relatedPersons.${GUARDIAN_IDX}.educationalLevel`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${GUARDIAN_IDX}.occupation`}
                  label="Occupation"
                  required
                  value={
                    family?.relatedPersons?.[GUARDIAN_IDX]?.occupation || ""
                  }
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${GUARDIAN_IDX}.occupation`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${GUARDIAN_IDX}.occupation`,
                    )
                  }
                  placeholder="e.g. Engineer"
                  error={getFieldError(
                    `family.relatedPersons.${GUARDIAN_IDX}.occupation`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${GUARDIAN_IDX}.employerName`}
                  label="Name of Employer"
                  required
                  value={
                    family?.relatedPersons?.[GUARDIAN_IDX]?.employerName || ""
                  }
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${GUARDIAN_IDX}.employerName`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${GUARDIAN_IDX}.employerName`,
                    )
                  }
                  placeholder="Company name"
                  error={getFieldError(
                    `family.relatedPersons.${GUARDIAN_IDX}.employerName`,
                  )}
                />
                <div className="md:col-span-2">
                  <FormInput
                    name={`family.relatedPersons.${GUARDIAN_IDX}.employerAddress`}
                    label="Address of Employer"
                    value={
                      family?.relatedPersons?.[GUARDIAN_IDX]?.employerAddress ||
                      ""
                    }
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${GUARDIAN_IDX}.employerAddress`,
                        val,
                      )
                    }
                    onBlur={() =>
                      handleFieldBlur(
                        `family.relatedPersons.${GUARDIAN_IDX}.employerAddress`,
                      )
                    }
                    placeholder="Company address"
                    error={getFieldError(
                      `family.relatedPersons.${GUARDIAN_IDX}.employerAddress`,
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border my-6"></div>

          {/* Sibling Information Card */}
          <div className="group bg-glass-bg/60 backdrop-blur-glass rounded-[24px] border border-glass-border/40 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden p-5 sm:p-8">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shadow-sm text-primary">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-foreground">
                Sibling Information
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <FormInput
                name="family.background.brothers"
                label="Brothers"
                type="number"
                required
                value={family?.background?.brothers ?? ""}
                onChange={(val) =>
                  handleInputChange(
                    "family.background.brothers",
                    val === "" ? "" : Number(val),
                  )
                }
                onBlur={() => handleFieldBlur("family.background.brothers")}
                placeholder="0"
                error={getFieldError("family.background.brothers")}
              />
              <FormInput
                name="family.background.sisters"
                label="Sisters"
                type="number"
                required
                value={family?.background?.sisters ?? ""}
                onChange={(val) =>
                  handleInputChange(
                    "family.background.sisters",
                    val === "" ? "" : Number(val),
                  )
                }
                onBlur={() => handleFieldBlur("family.background.sisters")}
                placeholder="0"
                error={getFieldError("family.background.sisters")}
              />
              <FormInput
                name="family.background.employedSiblings"
                label="Employed Siblings"
                type="number"
                required
                value={family?.background?.employedSiblings ?? ""}
                onChange={(val) =>
                  handleInputChange(
                    "family.background.employedSiblings",
                    val === "" ? "" : Number(val),
                  )
                }
                onBlur={() => handleFieldBlur("family.background.employedSiblings")}
                placeholder="0"
                error={getFieldError("family.background.employedSiblings")}
              />
              <FormInput
                name="family.background.ordinalPosition"
                label="Your Birth Order"
                type="number"
                required
                value={family?.background?.ordinalPosition ?? ""}
                onChange={(val) =>
                  handleInputChange(
                    "family.background.ordinalPosition",
                    val === "" ? "" : Number(val),
                  )
                }
                onBlur={() => handleFieldBlur("family.background.ordinalPosition")}
                placeholder="e.g. 1"
                error={getFieldError("family.background.ordinalPosition")}
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">

                Is your brother/sister who is gainfully employed providing support
                to your:
                <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {siblingSupportTypesOptions?.map((option: any) => {
                  const isChecked = family?.background?.siblingSupportTypes?.some(
                    (item: any) => String(item.id) === String(option.id),
                  );
                  return (
                    <div
                      key={option.id}
                      onClick={() => {
                        const currentTypes =
                          family?.background?.siblingSupportTypes || [];
                        let newTypes;
                        if (!isChecked) {
                          newTypes = [...currentTypes, { id: Number(option.id) }];
                        } else {
                          newTypes = currentTypes.filter(
                            (item: any) => String(item.id) !== String(option.id),
                          );
                        }
                        handleInputChange(
                          "family.background.siblingSupportTypes",
                          newTypes,
                        );
                      }}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 cursor-pointer group/opt ${isChecked
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-glass-bg/20 border-glass-border/20 hover:border-primary/20"
                        }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${isChecked
                          ? "bg-primary border-primary"
                          : "bg-white border-muted-foreground/30"
                          }`}
                      >
                        {isChecked && (
                          <Check
                            className="w-3.5 h-3.5 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium transition-colors ${isChecked ? "text-primary italic" : "text-muted-foreground"}`}
                      >
                        {option.name || option.text || option.code}
                      </span>
                    </div>
                  );
                })}
              </div>
              {errors["family.background.siblingSupportTypes"] && (
                <p className="text-xs font-bold text-rose-500 mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-rose-500" />
                  {errors["family.background.siblingSupportTypes"]}
                </p>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-white/40">
              <label className="text-sm font-bold text-foreground flex items-center gap-2 mb-4">
                Who finances your schooling?
                <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {studentSupportTypesOptions?.map((option: any) => {
                  const isChecked = family?.finance?.financialSupportTypes?.some(
                    (item: any) => String(item.id) === String(option.id),
                  );
                  return (
                    <div
                      key={option.id}
                      onClick={() => {
                        const currentTypes =
                          family?.finance?.financialSupportTypes || [];
                        let newTypes;
                        if (!isChecked) {
                          newTypes = [...currentTypes, { id: Number(option.id) }];
                        } else {
                          newTypes = currentTypes.filter(
                            (item: any) => String(item.id) !== String(option.id),
                          );
                        }
                        handleInputChange(
                          "family.finance.financialSupportTypes",
                          newTypes,
                        );
                      }}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-300 cursor-pointer group/opt ${isChecked
                        ? "bg-primary/5 border-primary shadow-sm"
                        : "bg-glass-bg/20 border-glass-border/20 hover:border-primary/20"
                        }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${isChecked
                          ? "bg-primary border-primary"
                          : "bg-white border-muted-foreground/30"
                          }`}
                      >
                        {isChecked && (
                          <Check
                            className="w-3.5 h-3.5 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium transition-colors ${isChecked ? "text-primary italic" : "text-muted-foreground"}`}
                      >
                        {option.name || option.text || option.code}
                      </span>
                    </div>
                  );
                })}
              </div>
              {errors["family.finance.financialSupportTypes"] && (
                <p className="text-xs font-bold text-rose-500 mt-2 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-rose-500" />
                  {errors["family.finance.financialSupportTypes"]}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-border my-8"></div>

        {/* IV. Financial Information */}
        <div className="space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
              <CircleDollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Financial Information
              </h3>
              <p className="text-xs text-muted-foreground font-medium">
                Monthly household income and allowance
              </p>
            </div>
          </div>

          <div className="group bg-glass-bg/20 backdrop-blur-sm rounded-3xl border border-glass-border/20 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Dropdown
                  label="Parents' Combined Monthly Income"
                  name="family.finance.monthlyFamilyIncomeRange"
                  value={family?.finance?.monthlyFamilyIncomeRange?.id || ""}
                  onChange={(val) => {
                    handleInputChange("family.finance.monthlyFamilyIncomeRange", {
                      id: val,
                    });
                    if (val !== "others") {
                      handleInputChange(
                        "family.finance.monthlyFamilyIncomeRange.otherSpecification",
                        "",
                      );
                      setOtherTouched(false);
                    } else {
                      setTimeout(() => otherInputRef.current?.focus(), 0);
                    }
                  }}
                  options={monthlyFamilyIncomeRanges}
                  required
                />

                {family?.finance?.monthlyFamilyIncomeRange?.id === "others" && (
                  <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <FormInput
                      ref={otherInputRef}
                      name="family.finance.monthlyFamilyIncomeRange.otherSpecification"
                      label="Specify Income Range"
                      required
                      value={
                        family?.finance?.monthlyFamilyIncomeRange
                          ?.otherSpecification || ""
                      }
                      onChange={(val) =>
                        handleInputChange(
                          "family.finance.monthlyFamilyIncomeRange.otherSpecification",
                          val,
                        )
                      }
                      onBlur={() => setOtherTouched(true)}
                      placeholder="Enter income range..."
                      error={
                        otherTouched &&
                          !family?.finance?.monthlyFamilyIncomeRange
                            ?.otherSpecification
                          ? "Please specify"
                          : errors[
                          "family.finance.monthlyFamilyIncomeRange.otherSpecification"
                          ]
                      }
                    />
                  </div>
                )}
              </div>

              <FormInput
                name="family.finance.weeklyAllowance"
                label="Weekly Allowance (PHP)"
                type="text"
                inputMode="decimal"
                required={isFieldRequired(
                  familyValidationSchema,
                  "family.finance.weeklyAllowance",
                )}
                value={family?.finance?.weeklyAllowance ?? ""}
                onChange={(val) =>
                  handleInputChange(
                    "family.finance.weeklyAllowance",
                    String(val).replace(/[^0-9.]/g, ""),
                  )
                }
                onBlur={() => {
                  const wa = family?.finance?.weeklyAllowance;
                  if (wa !== undefined && wa !== null && wa !== "") {
                    handleInputChange(
                      "family.finance.weeklyAllowance",
                      Number(wa),
                    );
                  } else if (wa === "") {
                    handleInputChange("family.finance.weeklyAllowance", null);
                  }
                  handleFieldBlur("family.finance.weeklyAllowance");
                }}
                placeholder="0.00"
                error={getFieldError("family.finance.weeklyAllowance")}
              />
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
});
