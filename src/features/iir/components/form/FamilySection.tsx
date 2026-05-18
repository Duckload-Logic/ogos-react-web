import { forwardRef, useImperativeHandle, useState, useRef, memo } from "react";
import {
  Users,
  CircleDollarSign,
  Check,
  Home,
  Heart,
  User,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { FormInput, Dropdown, DatePicker } from "@/components/form";
import { SectionContainer } from "./SectionContainer";
import {
  validateObject,
  isFieldRequired,
  validateField,
} from "@/services/validationSchema";
import { familyValidationSchema } from "@/features/iir/config/familyValidationSchema";
import {
  useIncomeRanges,
  useNatureOfResidenceTypes,
  useParentalStatusTypes,
  useSiblingSupportTypes,
  useStudentSupportTypes,
  useStudentRelationshipTypes,
  useEducationalAttainments,
} from "../../hooks";
import { cn } from "@/lib/utils";
import { FAMILY_SUBSTEP_FIELDS } from "@/features/iir/config/subStepFields";

interface FormErrors {
  [key: string]: string;
}

interface FamilySectionRef {
  validate: (step?: number) => { isValid: boolean; errors: FormErrors };
}

const FATHER_IDX = 0;
const MOTHER_IDX = 1;
const GUARDIAN_IDX = 2;

interface ParentInformationCardProps {
  title: string;
  idx: number;
  family: any;
  handleInputChange: (path: string, value: any) => void;
  handleFieldBlur: (path: string) => void;
  getFieldError: (path: string) => string | undefined;
  attainmentOptions: any[];
  isEditMode?: boolean;
}

const ParentInformationCard = memo(
  ({
    title,
    idx,
    family,
    handleInputChange,
    handleFieldBlur,
    getFieldError,
    attainmentOptions,
    isEditMode = false,
  }: ParentInformationCardProps) => {
    const person = family?.relatedPersons?.[idx] || {};

    const calculateAge = (dobString: string) => {
      if (!dobString) return "";
      const dob = new Date(dobString);
      if (isNaN(dob.getTime())) return "";
      const diffMs = Date.now() - dob.getTime();
      const ageDate = new Date(diffMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };
    const calculatedAge = calculateAge(person.dateOfBirth);

    return (
      <SectionContainer
        title={title}
        description={`Detailed information about your ${title.toLowerCase().replace("'s information", "")}`}
        icon={User}
      >
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-end gap-3">
            {["Living", "Deceased"].map((status) => {
              const isLiving = status === "Living";
              const isSelected = person.isLiving === isLiving;
              return (
                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    handleInputChange(
                      `family.relatedPersons.${idx}.isLiving`,
                      isLiving,
                    )
                  }
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-[10px]",
                    "font-bold uppercase tracking-wider transition-all duration-300",
                    isSelected
                      ? isLiving
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600"
                        : "border-rose-500/50 bg-rose-500/10 text-rose-600"
                      : "border-glass-border/20 bg-glass-bg/40 text-muted-foreground",
                  )}
                >
                  {status}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:gap-8 md:grid-cols-3">
            <FormInput
              name={`family.relatedPersons.${idx}.firstName`}
              label="First Name"
              required={isFieldRequired(
                familyValidationSchema,
                `family.relatedPersons.${idx}.firstName`,
                { family },
              )}
              value={person.firstName || ""}
              onChange={(val) =>
                handleInputChange(`family.relatedPersons.${idx}.firstName`, val)
              }
              onBlur={() =>
                handleFieldBlur(`family.relatedPersons.${idx}.firstName`)
              }
              placeholder="First name"
              error={getFieldError(`family.relatedPersons.${idx}.firstName`)}
            />
            <FormInput
              name={`family.relatedPersons.${idx}.middleName`}
              label="Middle Name"
              value={person.middleName || ""}
              onChange={(val) =>
                handleInputChange(
                  `family.relatedPersons.${idx}.middleName`,
                  val,
                )
              }
              onBlur={() =>
                handleFieldBlur(`family.relatedPersons.${idx}.middleName`)
              }
              placeholder="Middle name"
              error={getFieldError(`family.relatedPersons.${idx}.middleName`)}
            />
            <FormInput
              name={`family.relatedPersons.${idx}.lastName`}
              label="Last Name"
              required={isFieldRequired(
                familyValidationSchema,
                `family.relatedPersons.${idx}.lastName`,
                { family },
              )}
              value={person.lastName || ""}
              onChange={(val) =>
                handleInputChange(`family.relatedPersons.${idx}.lastName`, val)
              }
              onBlur={() =>
                handleFieldBlur(`family.relatedPersons.${idx}.lastName`)
              }
              placeholder="Last name"
              error={getFieldError(`family.relatedPersons.${idx}.lastName`)}
            />
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <DatePicker
                  label="Date of Birth"
                  required={isFieldRequired(
                    familyValidationSchema,
                    `family.relatedPersons.${idx}.dateOfBirth`,
                    { family },
                  )}
                  value={person.dateOfBirth || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${idx}.dateOfBirth`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(`family.relatedPersons.${idx}.dateOfBirth`)
                  }
                  error={getFieldError(
                    `family.relatedPersons.${idx}.dateOfBirth`,
                  )}
                  disabled={isEditMode}
                />
              </div>
              <FormInput
                label="Age"
                value={calculatedAge !== "" ? String(calculatedAge) : ""}
                onChange={() => {}}
                placeholder="Age"
                disabled
              />
            </div>
            {!isEditMode && (
              <Dropdown
                name={`family.relatedPersons.${idx}.educationalAttainment`}
                label="Educational Attainment"
                required={isFieldRequired(
                  familyValidationSchema,
                  `family.relatedPersons.${idx}.educationalAttainment`,
                  { family },
                )}
                value={person.educationalAttainment?.id || ""}
                onChange={(val) =>
                  handleInputChange(
                    `family.relatedPersons.${idx}.educationalAttainment`,
                    { id: Number(val) },
                  )
                }
                onBlur={() =>
                  handleFieldBlur(
                    `family.relatedPersons.${idx}.educationalAttainment`,
                  )
                }
                options={attainmentOptions}
                error={getFieldError(
                  `family.relatedPersons.${idx}.educationalAttainment`,
                )}
              />
            )}
            <FormInput
              name={`family.relatedPersons.${idx}.occupation`}
              label="Occupation"
              required={isFieldRequired(
                familyValidationSchema,
                `family.relatedPersons.${idx}.occupation`,
                { family },
              )}
              value={person.occupation || ""}
              onChange={(val) =>
                handleInputChange(
                  `family.relatedPersons.${idx}.occupation`,
                  val,
                )
              }
              onBlur={() =>
                handleFieldBlur(`family.relatedPersons.${idx}.occupation`)
              }
              placeholder="e.g. Engineer"
              error={getFieldError(`family.relatedPersons.${idx}.occupation`)}
            />
            {!isEditMode && (
              <>
                <FormInput
                  name={`family.relatedPersons.${idx}.employerName`}
                  label="Name of Employer"
                  required={isFieldRequired(
                    familyValidationSchema,
                    `family.relatedPersons.${idx}.employerName`,
                    { family },
                  )}
                  value={person.employerName || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${idx}.employerName`,
                      val,
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(`family.relatedPersons.${idx}.employerName`)
                  }
                  placeholder="Company name"
                  error={getFieldError(
                    `family.relatedPersons.${idx}.employerName`,
                  )}
                />
                <div className="md:col-span-2">
                  <FormInput
                    name={`family.relatedPersons.${idx}.employerAddress`}
                    label="Address of Employer"
                    value={person.employerAddress || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${idx}.employerAddress`,
                        val,
                      )
                    }
                    onBlur={() =>
                      handleFieldBlur(
                        `family.relatedPersons.${idx}.employerAddress`,
                      )
                    }
                    placeholder="Company address"
                    error={getFieldError(
                      `family.relatedPersons.${idx}.employerAddress`,
                    )}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </SectionContainer>
    );
  },
);

export const FamilySection = forwardRef<
  FamilySectionRef,
  {
    family: any;
    onChange: (path: string, value: any) => void;
    onFieldBlur?: (fieldPath: string) => void;
    shouldShowError?: (fieldPath: string) => boolean;
    subStep?: number;
    isEditMode?: boolean;
  }
>(function FamilySection(
  {
    family,
    onChange,
    onFieldBlur,
    shouldShowError,
    subStep = 1,
    isEditMode = false,
  },
  ref,
) {
  const { data: parentalStatusOptions } = useParentalStatusTypes();
  const { data: natureOfResidenceOptions } = useNatureOfResidenceTypes();
  const { data: monthlyFamilyIncomeRanges } = useIncomeRanges();
  const { data: siblingSupportTypesOptions } = useSiblingSupportTypes();
  const { data: studentSupportTypesOptions } = useStudentSupportTypes();
  const { data: relationshipOptions } = useStudentRelationshipTypes();
  const { data: attainmentOptions } = useEducationalAttainments();

  const [errors, setErrors] = useState<FormErrors>({});
  const [otherTouched, setOtherTouched] = useState(false);
  const otherInputRef = useRef<HTMLInputElement | null>(null);

  const validate = (
    step?: number,
  ): { isValid: boolean; errors: FormErrors } => {
    const activeStep = step ?? subStep;

    // Filter schema to only include fields for the specified sub-step
    const filteredSchema: any = {};
    const targetFields = FAMILY_SUBSTEP_FIELDS[activeStep] || [];

    targetFields.forEach((field) => {
      if (familyValidationSchema[field]) {
        filteredSchema[field] = familyValidationSchema[field];
      }
    });

    const sectionErrors = validateObject({ family }, filteredSchema);
    setErrors((prev) => ({ ...prev, ...sectionErrors }));
    return {
      isValid: Object.keys(sectionErrors).length === 0,
      errors: sectionErrors,
    };
  };

  useImperativeHandle(ref, () => ({
    validate: (step?: number) => validate(step),
  }));

  const handleInputChange = (fieldPath: string, value: any) => {
    onChange(fieldPath, value);

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

  const getFieldError = (fieldPath: string): string | undefined => {
    const hasError = errors[fieldPath];
    const showError = shouldShowError ? shouldShowError(fieldPath) : true;
    return hasError && showError ? errors[fieldPath] : undefined;
  };

  const handleFieldBlur = (fieldPath: string) => {
    if (onFieldBlur) {
      onFieldBlur(fieldPath);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Parental Status & Living Situation (subStep 1) */}
      {subStep === 1 && (
        <>
          <SectionContainer
            title="Parental Status"
            description="Marital and legal status of your parents"
            icon={Heart}
          >
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
              {parentalStatusOptions?.map((option: any) => {
                const isOther =
                  option.name?.toLowerCase() === "other" ||
                  option.text?.toLowerCase() === "other";
                const isSelected =
                  String(
                    (family?.background?.parentalStatus as any)?.id || "",
                  ) === String(option.id);

                return (
                  <div
                    key={option.id}
                    className="group relative"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        handleInputChange("family.background.parentalStatus", {
                          id: Number(option.id),
                        })
                      }
                      className={cn(
                        "flex w-full items-center justify-between rounded-xl border p-4 transition-all duration-300",
                        isSelected
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-glass-border/20 bg-glass-bg/40 hover:bg-glass-bg/60 hover:border-primary/20",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-2.5 w-2.5 rounded-full transition-all duration-300",
                            isSelected
                              ? "scale-110 bg-primary shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                              : "bg-muted",
                          )}
                        />
                        <span
                          className={cn(
                            "text-left text-sm font-bold transition-colors duration-300",
                            isSelected
                              ? "text-primary"
                              : "text-foreground/70 group-hover:text-foreground",
                          )}
                        >
                          {option.name || option.text || option.code}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 stroke-[2.5] text-primary" />
                      )}
                    </button>
                    {isOther && isSelected && (
                      <div className="animate-fade-in mt-4 px-1">
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
                          error={
                            errors["family.background.parentalStatusOther"]
                          }
                          required
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {errors["family.background.parentalStatus"] && (
              <p className="ml-1 mt-4 flex animate-bounce items-center gap-1.5 text-xs font-bold text-destructive">
                <AlertCircle className="h-3.5 w-3.5" />
                {errors["family.background.parentalStatus"]}
              </p>
            )}
          </SectionContainer>

          <SectionContainer
            title="Living Situation"
            description="Environment and nature of your current residence"
            icon={Home}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <div className="bg-glass-bg/40 border-glass-border/20 hover:bg-glass-bg/60 rounded-[20px] border p-5 backdrop-blur-sm transition-all duration-300 sm:p-6">
                  <p className="mb-4 block flex items-center gap-2 text-sm font-bold text-foreground/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
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
                          className={cn(
                            "rounded-xl border px-4 py-2.5 text-sm font-bold transition-all duration-300",
                            isSelected
                              ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 shadow-sm"
                              : "border-glass-border/20 bg-white/20 text-muted-foreground hover:bg-white/40",
                          )}
                        >
                          {val.charAt(0).toUpperCase() + val.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-glass-bg/40 border-glass-border/20 hover:bg-glass-bg/60 rounded-[20px] border p-5 backdrop-blur-sm transition-all duration-300 sm:p-6">
                  <p className="mb-4 block flex items-center gap-2 text-sm font-bold text-foreground/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
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
                          className={cn(
                            "rounded-xl border px-4 py-2.5 text-sm font-bold transition-all duration-300",
                            isSelected
                              ? "border-indigo-500 bg-indigo-500/10 text-indigo-600 shadow-sm"
                              : "border-glass-border/20 bg-white/20 text-muted-foreground hover:bg-white/40",
                          )}
                        >
                          {val.charAt(0).toUpperCase() + val.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                  {family?.background?.isSharingRoom && (
                    <div className="animate-fade-in mt-4">
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
                        placeholder="e.g. siblings, parents..."
                        error={getFieldError(
                          "family.background.roomSharingDetails",
                        )}
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-glass-bg/40 border-glass-border/20 hover:bg-glass-bg/60 rounded-[24px] border p-5 backdrop-blur-sm transition-all duration-300 sm:p-6">
                <label className="mb-6 block flex items-center gap-2 text-sm font-bold text-foreground/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Nature of Residence
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {natureOfResidenceOptions?.map((option: any) => {
                    const isSelected =
                      String(
                        (family?.background?.natureOfResidence as any)?.id ||
                          "",
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
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-3.5 transition-all duration-300",
                          isSelected
                            ? "border-indigo-500 bg-indigo-500/10 shadow-sm"
                            : "border-glass-border/20 bg-white/20 hover:bg-white/40",
                        )}
                      >
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full transition-all duration-300",
                            isSelected ? "scale-110 bg-indigo-500" : "bg-muted",
                          )}
                        />
                        <span
                          className={cn(
                            "text-left text-xs font-bold",
                            isSelected
                              ? "text-indigo-600"
                              : "text-foreground/70",
                          )}
                        >
                          {option.name || option.text || option.code}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </SectionContainer>
        </>
      )}

      {subStep === 2 && (
        <ParentInformationCard
          title="Father's Information"
          idx={FATHER_IDX}
          family={family}
          handleInputChange={handleInputChange}
          handleFieldBlur={handleFieldBlur}
          getFieldError={getFieldError}
          attainmentOptions={attainmentOptions || []}
          isEditMode={isEditMode}
        />
      )}
      {subStep === 3 && (
        <ParentInformationCard
          title="Mother's Information"
          idx={MOTHER_IDX}
          family={family}
          handleInputChange={handleInputChange}
          handleFieldBlur={handleFieldBlur}
          getFieldError={getFieldError}
          attainmentOptions={attainmentOptions || []}
          isEditMode={isEditMode}
        />
      )}

      {subStep === 4 && (
        <div className="flex flex-col gap-10">
          <SectionContainer
            title="Guardian's Information"
            description="Person who assumes responsibility if parents are unavailable"
            icon={User}
          >
            <div className="flex flex-col gap-8">
              <div className="max-w-xs">
                <Dropdown
                  name={`family.relatedPersons.${GUARDIAN_IDX}.relationship`}
                  label="Relationship to Student"
                  options={relationshipOptions || []}
                  required
                  value={
                    family?.relatedPersons?.[GUARDIAN_IDX]?.relationship?.id ||
                    ""
                  }
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${GUARDIAN_IDX}.relationship`,
                      { id: Number(val) },
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${GUARDIAN_IDX}.relationship`,
                    )
                  }
                  error={getFieldError(
                    `family.relatedPersons.${GUARDIAN_IDX}.relationship`,
                  )}
                />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:gap-8 md:grid-cols-3">
                <FormInput
                  name={`family.relatedPersons.${GUARDIAN_IDX}.firstName`}
                  label="First Name"
                  required={isFieldRequired(
                    familyValidationSchema,
                    `family.relatedPersons.${GUARDIAN_IDX}.firstName`,
                    { family },
                  )}
                  value={
                    family?.relatedPersons?.[GUARDIAN_IDX]?.firstName || ""
                  }
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
                  required={isFieldRequired(
                    familyValidationSchema,
                    `family.relatedPersons.${GUARDIAN_IDX}.lastName`,
                    { family },
                  )}
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

              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="md:col-span-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <DatePicker
                      label="Date of Birth"
                      required={isFieldRequired(
                        familyValidationSchema,
                        `family.relatedPersons.${GUARDIAN_IDX}.dateOfBirth`,
                        { family },
                      )}
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
                      disabled={isEditMode}
                    />
                  </div>
                  <FormInput
                    label="Age"
                    value={
                      (() => {
                        const dob = family?.relatedPersons?.[GUARDIAN_IDX]?.dateOfBirth;
                        if (!dob) return "";
                        const d = new Date(dob);
                        if (isNaN(d.getTime())) return "";
                        const diff = Date.now() - d.getTime();
                        const ageDate = new Date(diff);
                        return String(Math.abs(ageDate.getUTCFullYear() - 1970));
                      })()
                    }
                    onChange={() => {}}
                    placeholder="Age"
                    disabled
                  />
                </div>
                <Dropdown
                  name={`family.relatedPersons.${GUARDIAN_IDX}.educationalAttainment`}
                  label="Educational Attainment"
                  required={isFieldRequired(
                    familyValidationSchema,
                    `family.relatedPersons.${GUARDIAN_IDX}.educationalAttainment`,
                    { family },
                  )}
                  value={
                    family?.relatedPersons?.[GUARDIAN_IDX]
                      ?.educationalAttainment?.id || ""
                  }
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${GUARDIAN_IDX}.educationalAttainment`,
                      { id: Number(val) },
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${GUARDIAN_IDX}.educationalAttainment`,
                    )
                  }
                  options={attainmentOptions || []}
                  error={getFieldError(
                    `family.relatedPersons.${GUARDIAN_IDX}.educationalAttainment`,
                  )}
                />
                <FormInput
                  name={`family.relatedPersons.${GUARDIAN_IDX}.occupation`}
                  label="Occupation"
                  required={isFieldRequired(
                    familyValidationSchema,
                    `family.relatedPersons.${GUARDIAN_IDX}.occupation`,
                    { family },
                  )}
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
                  required={isFieldRequired(
                    familyValidationSchema,
                    `family.relatedPersons.${GUARDIAN_IDX}.employerName`,
                    { family },
                  )}
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
          </SectionContainer>

          <SectionContainer
            title="Sibling Information"
            description="Family composition and support structure"
            icon={Users}
          >
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
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
                placeholder="e.g. 1"
                error={getFieldError("family.background.ordinalPosition")}
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-bold text-foreground">
                Is your brother/sister who is gainfully employed providing
                support to your:
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {siblingSupportTypesOptions?.map((option: any) => {
                  const isChecked =
                    family?.background?.siblingSupportTypes?.some(
                      (item: any) => String(item.id) === String(option.id),
                    );
                  return (
                    <div
                      key={option.id}
                      onClick={() => {
                        const currentTypes =
                          family?.background?.siblingSupportTypes || [];
                        const newTypes = !isChecked
                          ? [...currentTypes, { id: Number(option.id) }]
                          : currentTypes.filter(
                              (item: any) =>
                                String(item.id) !== String(option.id),
                            );
                        handleInputChange(
                          "family.background.siblingSupportTypes",
                          newTypes,
                        );
                      }}
                      className={cn(
                        "group/opt flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all duration-300",
                        isChecked
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "bg-glass-bg/20 border-glass-border/20 hover:border-primary/20",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-lg border-2 transition-all duration-300",
                          isChecked
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30 bg-white",
                        )}
                      >
                        {isChecked && (
                          <Check
                            className="h-3.5 w-3.5 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isChecked
                            ? "italic text-primary"
                            : "text-muted-foreground",
                        )}
                      >
                        {option.name || option.text || option.code}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 border-t border-white/40 pt-8">
              <label className="mb-4 flex items-center gap-2 text-sm font-bold text-foreground">
                Who finances your schooling?
                <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {studentSupportTypesOptions?.map((option: any) => {
                  const isChecked =
                    family?.finance?.financialSupportTypes?.some(
                      (item: any) => String(item.id) === String(option.id),
                    );
                  return (
                    <div
                      key={option.id}
                      onClick={() => {
                        const currentTypes =
                          family?.finance?.financialSupportTypes || [];
                        const newTypes = !isChecked
                          ? [...currentTypes, { id: Number(option.id) }]
                          : currentTypes.filter(
                              (item: any) =>
                                String(item.id) !== String(option.id),
                            );
                        handleInputChange(
                          "family.finance.financialSupportTypes",
                          newTypes,
                        );
                      }}
                      className={cn(
                        "group/opt flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all duration-300",
                        isChecked
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "bg-glass-bg/20 border-glass-border/20 hover:border-primary/20",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-lg border-2 transition-all duration-300",
                          isChecked
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/30 bg-white",
                        )}
                      >
                        {isChecked && (
                          <Check
                            className="h-3.5 w-3.5 text-white"
                            strokeWidth={3}
                          />
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium transition-colors",
                          isChecked
                            ? "italic text-primary"
                            : "text-muted-foreground",
                        )}
                      >
                        {option.name || option.text || option.code}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionContainer>

          <SectionContainer
            title="Financial Information"
            description="Monthly household income and allowance"
            icon={CircleDollarSign}
          >
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <Dropdown
                  label="Parents' Combined Monthly Income"
                  name="family.finance.monthlyFamilyIncomeRange"
                  value={family?.finance?.monthlyFamilyIncomeRange?.id || ""}
                  onChange={(val) => {
                    handleInputChange(
                      "family.finance.monthlyFamilyIncomeRange",
                      { id: val },
                    );
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
                  <div className="animate-in fade-in slide-in-from-top-2 pt-2 duration-300">
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
                  if (wa !== undefined && wa !== null && wa !== "")
                    handleInputChange(
                      "family.finance.weeklyAllowance",
                      Number(wa),
                    );
                  else if (wa === "")
                    handleInputChange("family.finance.weeklyAllowance", null);
                  handleFieldBlur("family.finance.weeklyAllowance");
                }}
                placeholder="0.00"
                error={getFieldError("family.finance.weeklyAllowance")}
              />
            </div>
          </SectionContainer>
        </div>
      )}
    </div>
  );
});
