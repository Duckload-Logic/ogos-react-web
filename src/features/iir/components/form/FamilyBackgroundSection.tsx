import { forwardRef, useImperativeHandle, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { InputField, Checkbox, RadioField } from "@/components/form";
import { Check } from "lucide-react";
import { validateObject, isFieldRequired } from "@/services/validationSchema";
import { familyValidationSchema } from "@/features/iir/config/familyValidationSchema";
import {
  useIncomeRanges,
  useNatureOfResidenceTypes,
  useParentalStatusTypes,
  useSiblingSupportTypes,
  useStudentSupportTypes,
} from "../../hooks";
import { ParentalStatus } from "../../types/IIRForm";

interface FormErrors {
  [key: string]: string;
}

interface FamilyBackgroundSectionRef {
  validate: () => { isValid: boolean; errors: FormErrors };
}

export const FamilyBackgroundSection = forwardRef<
  FamilyBackgroundSectionRef,
  {
    family: any;
    onChange: (path: string, value: any) => void;
    onFieldBlur?: (fieldPath: string) => void;
    shouldShowError?: (fieldPath: string) => boolean;
  }
>(function FamilyBackgroundSection(
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
    <Card className="bg-card border border-border">
      <CardContent className="pt-6">
        {/* I. Parental Status */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-card-foreground pb-3 mb-6">
            I. Parental Status
          </h3>
          <div className="space-y-2">
            <div className="text-sm font-medium text-card-foreground flex items-start gap-1"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parentalStatusOptions?.map((option: any) => {
                const isOther = option.name?.toLowerCase() === "other";
                const isSelected =
                  String((family?.background?.parentalStatus as any)?.id || "") ===
                  String(option.id);

                if (isOther && isSelected) {
                  return (
                    <div key={option.id} className="flex items-center gap-2">
                      <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                        <input
                          type="radio"
                          name="parentalStatus"
                          value={option.id}
                          checked={true}
                          onChange={(e) =>
                            handleInputChange(
                              "family.background.parentalStatus",
                              { id: Number(e.target.value) },
                            )
                          }
                          className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                        <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <span className="text-sm text-foreground whitespace-nowrap">
                        Other, please specify:
                      </span>
                      <input
                        type="text"
                        placeholder="specify"
                        value={family?.background?.parentalStatusOther || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "family.background.parentalStatusOther",
                            e.target.value,
                          )
                        }
                        className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:border-border focus:ring-ring/20 text-sm bg-card text-foreground"
                      />
                    </div>
                  );
                } else if (isOther) {
                  return (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                        <input
                          type="radio"
                          name="parentalStatus"
                          value={option.id}
                          checked={false}
                          onChange={(e) =>
                            handleInputChange(
                              "family.background.parentalStatus",
                              { id: Number(e.target.value) },
                            )
                          }
                          className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                        <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                        Other, please specify:
                      </span>
                    </label>
                  );
                } else {
                  return (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                        <input
                          type="radio"
                          name="parentalStatus"
                          value={option.id}
                          checked={isSelected}
                          onChange={(e) =>
                            handleInputChange(
                              "family.background.parentalStatus",
                              { id: Number(e.target.value) },
                            )
                          }
                          className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                        <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                        {option.name || option.text || option.code}
                      </span>
                    </label>
                  );
                }
              })}
            </div>
            {errors["family.background.parentalStatus"] && (
              <p className="text-xs font-semibold text-red-600 mt-1">
                {errors["family.background.parentalStatus"]}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* II. Living Situation */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-card-foreground pb-3 mb-6">
            II. Living Situation
          </h3>
          <div className="space-y-6">
            <div className="p-4 bg-background dark:bg-muted rounded-lg border border-border">
              <p className="font-medium text-foreground mb-3">
                Do you have a quiet place to study at home?
              </p>
              <RadioField
                label=""
                options={[
                  { id: "yes", name: "Yes" },
                  { id: "no", name: "No" },
                ]}
                value={
                  family?.background?.haveQuietPlaceToStudy === true
                    ? "yes"
                    : family?.background?.haveQuietPlaceToStudy === false
                      ? "no"
                      : ""
                }
                onChange={(val) =>
                  handleInputChange(
                    "family.background.haveQuietPlaceToStudy",
                    val === "yes",
                  )
                }
                columns={2}
              />
              {errors["family.background.haveQuietPlaceToStudy"] && (
                <p className="text-xs font-semibold text-red-600 mt-1">
                  {errors["family.background.haveQuietPlaceToStudy"]}
                </p>
              )}
            </div>

            <div className="p-4 bg-background dark:bg-muted rounded-lg border border-border">
              <p className="font-medium text-foreground mb-3">
                Do you share your room with anyone?
              </p>
              <RadioField
                label=""
                options={[
                  { id: "yes", name: "Yes" },
                  { id: "no", name: "No" },
                ]}
                value={
                  family?.background?.isSharingRoom === true
                    ? "yes"
                    : family?.background?.isSharingRoom === false
                      ? "no"
                      : ""
                }
                onChange={(val) =>
                  handleInputChange(
                    "family.background.isSharingRoom",
                    val === "yes",
                  )
                }
                columns={2}
              />
              {errors["family.background.isSharingRoom"] && (
                <p className="text-xs font-semibold text-red-600 mt-1">
                  {errors["family.background.isSharingRoom"]}
                </p>
              )}
              {family?.background?.isSharingRoom === true && (
                <div className="mt-4">
                  <InputField
                    label="Share room with whom?"
                    value={family?.background?.roomSharingDetails || ""}
                    onChange={(val) =>
                      handleInputChange(
                        "family.background.roomSharingDetails",
                        val,
                      )
                    }
                    placeholder="e.g., Sister, Brother"
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-background dark:bg-muted rounded-lg border border-border">
              <h4 className="font-semibold text-foreground mb-4">
                Nature of Residence
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                {natureOfResidenceOptions?.map((option: any) => {
                  const isSelected =
                    String((family?.background?.natureOfResidence as any)?.id || "") ===
                    String(option.id);

                  return (
                    <label
                      key={option.id}
                      className="flex items-center gap-3 group cursor-pointer"
                    >
                      <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                        <input
                          type="radio"
                          name="natureOfResidence"
                          value={option.id}
                          checked={isSelected}
                          onChange={(e) =>
                            handleInputChange(
                              "family.background.natureOfResidence",
                              { id: Number(e.target.value) },
                            )
                          }
                          className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                        <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                        {option.name || option.text || option.code}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors["family.background.natureOfResidence"] && (
                <p className="text-xs font-semibold text-red-600 mt-1">
                  {errors["family.background.natureOfResidence"]}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* III. Family Members Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-card-foreground pb-3 mb-6">
            III. Family Members Information
          </h3>

          <div className="p-4 bg-background dark:bg-muted rounded-lg border border-border">
            {/* Father Sub-section */}
            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-4">Father</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-2">
                  <InputField
                    label="First Name"
                    value={family?.relatedPersons?.[FATHER_IDX].firstName || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${FATHER_IDX}.firstName`,
                        val,
                      )
                    }
                    onBlur={() =>
                      handleFieldBlur(
                        `family.relatedPersons.${FATHER_IDX}.firstName`,
                      )
                    }
                    placeholder="Father's name"
                    required
                    error={getFieldError(
                      `family.relatedPersons.${FATHER_IDX}.firstName`,
                    )}
                  />
                  <InputField
                    label="Middle Name"
                    value={
                      family?.relatedPersons?.[FATHER_IDX].middleName || ""
                    }
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
                    placeholder="Father's name"
                    error={getFieldError(
                      `family.relatedPersons.${FATHER_IDX}.middleName`,
                    )}
                  />
                  <InputField
                    label="Last Name"
                    value={family?.relatedPersons?.[FATHER_IDX].lastName || ""}
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
                    placeholder="Father's name"
                    required
                    error={getFieldError(
                      `family.relatedPersons.${FATHER_IDX}.lastName`,
                    )}
                  />
                </div>
                <InputField
                  label="Date of Birth"
                  type="text"
                  inputMode="numeric"
                  value={family?.relatedPersons?.[FATHER_IDX].dateOfBirth || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${FATHER_IDX}.dateOfBirth`,
                      val.replace(/[^0-9]/g, ""),
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${FATHER_IDX}.dateOfBirth`,
                    )
                  }
                  placeholder="Date of Birth"
                  required
                  error={getFieldError(
                    `family.relatedPersons.${FATHER_IDX}.dateOfBirth`,
                  )}
                />
                <InputField
                  label="Educational Attainment"
                  value={
                    family?.relatedPersons?.[FATHER_IDX].educationalLevel || ""
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
                  placeholder="e.g., College Graduate"
                  required
                  error={getFieldError(
                    `family.relatedPersons.${FATHER_IDX}.educationalLevel`,
                  )}
                />
                <InputField
                  label="Occupation"
                  value={family?.relatedPersons?.[FATHER_IDX].occupation || ""}
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
                  placeholder="e.g., Engineer"
                  required
                  error={getFieldError(
                    `family.relatedPersons.${FATHER_IDX}.occupation`,
                  )}
                />
                <InputField
                  label="Name of Employer"
                  value={
                    family?.relatedPersons?.[FATHER_IDX].employerName || ""
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
                  required
                  error={getFieldError(
                    `family.relatedPersons.${FATHER_IDX}.employerName`,
                  )}
                />
                <InputField
                  label="Address of Employer"
                  className="col-span-2"
                  value={
                    family?.relatedPersons?.[FATHER_IDX].employerAddress || ""
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
                  error={getFieldError(
                    `family.relatedPersons.${FATHER_IDX}.employerAddress`,
                  )}
                />
              </div>
              <div className="flex gap-6">
                <label className="text-sm font-medium text-card-foreground">
                  Status:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                      <input
                        type="radio"
                        name="father-status"
                        value="living"
                        checked={
                          family?.relatedPersons?.[FATHER_IDX].isLiving === true
                        }
                        onChange={() =>
                          handleInputChange(
                            `family.relatedPersons.${FATHER_IDX}.isLiving`,
                            true,
                          )
                        }
                        className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                      <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-sm">Living</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                      <input
                        type="radio"
                        name="father-status"
                        value="deceased"
                        checked={
                          family?.relatedPersons?.[FATHER_IDX].isLiving ===
                          false
                        }
                        onChange={() =>
                          handleInputChange(
                            `family.relatedPersons.${FATHER_IDX}.isLiving`,
                            false,
                          )
                        }
                        className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                      <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-sm">Deceased</span>
                  </label>
                </div>
              </div>
              {errors[`family.relatedPersons.${FATHER_IDX}.isLiving`] && (
                <p className="text-xs font-semibold text-red-600 mt-1">
                  {errors[`family.relatedPersons.${FATHER_IDX}.isLiving`]}
                </p>
              )}
            </div>
            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-4">Mother</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 col-span-2 gap-4">
                  <InputField
                    label="First Name"
                    value={family?.relatedPersons?.[MOTHER_IDX].firstName || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${MOTHER_IDX}.firstName`,
                        val,
                      )
                    }
                    placeholder="Mother's first name"
                    required
                    error={
                      errors[`family.relatedPersons.${MOTHER_IDX}.firstName`]
                    }
                  />
                  <InputField
                    label="Middle Name"
                    value={
                      family?.relatedPersons?.[MOTHER_IDX].middleName || ""
                    }
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${MOTHER_IDX}.middleName`,
                        val,
                      )
                    }
                    placeholder="Mother's middle name"
                    required
                    error={
                      errors[`family.relatedPersons.${MOTHER_IDX}.middleName`]
                    }
                  />
                  <InputField
                    label="Last Name"
                    value={family?.relatedPersons?.[MOTHER_IDX].lastName || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${MOTHER_IDX}.lastName`,
                        val,
                      )
                    }
                    placeholder="Mother's last name"
                    required
                    error={
                      errors[`family.relatedPersons.${MOTHER_IDX}.lastName`]
                    }
                  />
                </div>
                <InputField
                  label="Date of Birth"
                  type="text"
                  inputMode="numeric"
                  value={family?.relatedPersons?.[MOTHER_IDX].dateOfBirth || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${MOTHER_IDX}.dateOfBirth`,
                      val.replace(/[^0-9]/g, ""),
                    )
                  }
                  placeholder="Date of Birth"
                  required
                  error={
                    errors[`family.relatedPersons.${MOTHER_IDX}.dateOfBirth`]
                  }
                />
                <InputField
                  label="Educational Attainment"
                  value={
                    family?.relatedPersons?.[MOTHER_IDX].educationalLevel || ""
                  }
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${MOTHER_IDX}.educationalLevel`,
                      val,
                    )
                  }
                  placeholder="e.g., College Graduate"
                  required
                  error={
                    errors[
                    `family.relatedPersons.${MOTHER_IDX}.educationalLevel`
                    ]
                  }
                />
                <InputField
                  label="Occupation"
                  value={family?.relatedPersons?.[MOTHER_IDX].occupation || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${MOTHER_IDX}.occupation`,
                      val,
                    )
                  }
                  placeholder="e.g., Engineer"
                  required
                  error={
                    errors[`family.relatedPersons.${MOTHER_IDX}.occupation`]
                  }
                />
                <InputField
                  label="Name of Employer"
                  value={
                    family?.relatedPersons?.[MOTHER_IDX].employerName || ""
                  }
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${MOTHER_IDX}.employerName`,
                      val,
                    )
                  }
                  required={isFieldRequired(familyValidationSchema, `family.relatedPersons.${MOTHER_IDX}.employerName`)}
                  placeholder="Company name"
                  error={
                    errors[`family.relatedPersons.${MOTHER_IDX}.employerName`]
                  }
                />
                <InputField
                  label="Address of Employer"
                  className="col-span-2"
                  value={
                    family?.relatedPersons?.[MOTHER_IDX].employerAddress || ""
                  }
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${MOTHER_IDX}.employerAddress`,
                      val,
                    )
                  }
                  placeholder="Company address"
                  error={
                    errors[
                    `family.relatedPersons.${MOTHER_IDX}.employerAddress`
                    ]
                  }
                />
              </div>
              <div className="flex gap-6">
                <label className="text-sm font-medium text-card-foreground">
                  Status:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                      <input
                        type="radio"
                        name="mother-status"
                        value="living"
                        checked={
                          family?.relatedPersons?.[MOTHER_IDX].isLiving === true
                        }
                        onChange={() =>
                          handleInputChange(
                            `family.relatedPersons.${MOTHER_IDX}.isLiving`,
                            true,
                          )
                        }
                        className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                      <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-sm">Living</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                      <input
                        type="radio"
                        name="mother-status"
                        value="deceased"
                        checked={
                          family?.relatedPersons?.[MOTHER_IDX].isLiving ===
                          false
                        }
                        onChange={() =>
                          handleInputChange(
                            `family.relatedPersons.${MOTHER_IDX}.isLiving`,
                            false,
                          )
                        }
                        className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                      <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-sm">Deceased</span>
                  </label>
                </div>
              </div>
              {errors[`family.relatedPersons.${MOTHER_IDX}.isLiving`] && (
                <p className="text-xs font-semibold text-red-600 mt-1">
                  {errors[`family.relatedPersons.${MOTHER_IDX}.isLiving`]}
                </p>
              )}
            </div>

            <div className="border-t border-border my-6"></div>

            {/* Guardian Sub-section */}
            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-4">Guardian</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 col-span-2 gap-4">
                  <InputField
                    label="First Name"
                    value={
                      family?.relatedPersons?.[GUARDIAN_IDX].firstName || ""
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
                    placeholder="Guardian's first name"
                    required
                    error={getFieldError(
                      `family.relatedPersons.${GUARDIAN_IDX}.firstName`,
                    )}
                  />
                  <InputField
                    label="Middle Name"
                    value={
                      family?.relatedPersons?.[GUARDIAN_IDX].middleName || ""
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
                    placeholder="Guardian's middle name"
                    error={getFieldError(
                      `family.relatedPersons.${GUARDIAN_IDX}.middleName`,
                    )}
                  />
                  <InputField
                    label="Last Name"
                    value={
                      family?.relatedPersons?.[GUARDIAN_IDX].lastName || ""
                    }
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
                    placeholder="Guardian's last name"
                    required
                    error={getFieldError(
                      `family.relatedPersons.${GUARDIAN_IDX}.lastName`,
                    )}
                  />
                </div>
                <InputField
                  label="Date of Birth"
                  type="text"
                  inputMode="numeric"
                  value={
                    family?.relatedPersons?.[GUARDIAN_IDX].dateOfBirth || ""
                  }
                  onChange={(val) =>
                    handleInputChange(
                      `family.relatedPersons.${GUARDIAN_IDX}.dateOfBirth`,
                      String(val).replace(/[^0-9]/g, ""),
                    )
                  }
                  onBlur={() =>
                    handleFieldBlur(
                      `family.relatedPersons.${GUARDIAN_IDX}.dateOfBirth`,
                    )
                  }
                  placeholder="Date of Birth"
                  required
                  error={getFieldError(
                    `family.relatedPersons.${GUARDIAN_IDX}.dateOfBirth`,
                  )}
                />
                <InputField
                  label="Educational Attainment"
                  value={
                    family?.relatedPersons?.[GUARDIAN_IDX].educationalLevel ||
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
                  placeholder="e.g., College Graduate"
                  required
                  error={getFieldError(
                    `family.relatedPersons.${GUARDIAN_IDX}.educationalLevel`,
                  )}
                />
                <InputField
                  label="Occupation"
                  value={
                    family?.relatedPersons?.[GUARDIAN_IDX].occupation || ""
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
                  placeholder="e.g., Engineer"
                  required
                  error={getFieldError(
                    `family.relatedPersons.${GUARDIAN_IDX}.occupation`,
                  )}
                />
                <InputField
                  label="Name of Employer"
                  value={
                    family?.relatedPersons?.[GUARDIAN_IDX].employerName || ""
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
                  required
                  error={getFieldError(
                    `family.relatedPersons.${GUARDIAN_IDX}.employerName`,
                  )}
                />
                <InputField
                  label="Address of Employer"
                  className="col-span-2"
                  value={
                    family?.relatedPersons?.[GUARDIAN_IDX].employerAddress || ""
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
              <div className="flex gap-6">
                <label className="text-sm font-medium text-card-foreground">
                  Status:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                      <input
                        type="radio"
                        name="guardian-status"
                        value="living"
                        checked={
                          family?.relatedPersons?.[GUARDIAN_IDX].isLiving ===
                          true
                        }
                        onChange={() =>
                          handleInputChange(
                            `family.relatedPersons.${GUARDIAN_IDX}.isLiving`,
                            true,
                          )
                        }
                        className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                      <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-sm">Living</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                      <input
                        type="radio"
                        name="guardian-status"
                        value="deceased"
                        checked={
                          family?.relatedPersons?.[GUARDIAN_IDX].isLiving ===
                          false
                        }
                        onChange={() =>
                          handleInputChange(
                            `family.relatedPersons.${GUARDIAN_IDX}.isLiving`,
                            false,
                          )
                        }
                        className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                      />
                      <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                      <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    <span className="text-sm">Deceased</span>
                  </label>
                </div>
              </div>
              {errors[`family.relatedPersons.${GUARDIAN_IDX}.isLiving`] && (
                <p className="text-xs font-semibold text-red-600 mt-1">
                  {errors[`family.relatedPersons.${GUARDIAN_IDX}.isLiving`]}
                </p>
              )}
            </div>

            <div className="border-t border-border my-6"></div>

            {/* Family Information Fields */}
            <div className="mb-6">
              <h4 className="font-semibold text-foreground mb-4">
                Sibling Information
              </h4>
              {/* 4 columns */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <InputField
                  label="Number of Brothers"
                  value={family?.background?.brothers ?? ""}
                  type="number"
                  inputMode="numeric"
                  required={isFieldRequired(familyValidationSchema, "family.background.brothers")}
                  onChange={function (val: string): void {
                    const cleanVal = val.replace(/[^0-9]/g, "");
                    handleInputChange(
                      "family.background.brothers",
                      cleanVal === "" ? null : Number(cleanVal),
                    );
                  }}
                  onBlur={() => handleFieldBlur("family.background.brothers")}
                  error={getFieldError("family.background.brothers")}
                />
                <InputField
                  label="Number of Sisters"
                  value={family?.background?.sisters ?? ""}
                  type="number"
                  inputMode="numeric"
                  required={isFieldRequired(familyValidationSchema, "family.background.sisters")}
                  onChange={function (val: string): void {
                    const cleanVal = val.replace(/[^0-9]/g, "");
                    handleInputChange(
                      "family.background.sisters",
                      cleanVal === "" ? null : Number(cleanVal),
                    );
                  }}
                  onBlur={() => handleFieldBlur("family.background.sisters")}
                  error={getFieldError("family.background.sisters")}
                />
                <InputField
                  label="Number of Employed Siblings"
                  value={family?.background?.employedSiblings ?? ""}
                  type="number"
                  inputMode="numeric"
                  required={isFieldRequired(familyValidationSchema, "family.background.employedSiblings")}
                  onChange={function (val: string): void {
                    const cleanVal = val.replace(/[^0-9]/g, "");
                    handleInputChange(
                      "family.background.employedSiblings",
                      cleanVal === "" ? null : Number(cleanVal),
                    );
                  }}
                  onBlur={() =>
                    handleFieldBlur("family.background.employedSiblings")
                  }
                  error={getFieldError("family.background.employedSiblings")}
                />
                <InputField
                  label="Ordinal Position Among Siblings"
                  value={family?.background?.ordinalPosition ?? ""}
                  type="text" // [Inference] Better for custom regex filtering
                  inputMode="numeric"
                  required={isFieldRequired(familyValidationSchema, "family.background.ordinalPosition")}
                  onChange={(val) => {
                    const cleanVal = val.replace(/[^0-9]/g, "");
                    handleInputChange(
                      "family.background.ordinalPosition",
                      cleanVal === "" ? null : Number(cleanVal),
                    );
                  }}
                  onBlur={() =>
                    handleFieldBlur("family.background.ordinalPosition")
                  }
                  error={getFieldError("family.background.ordinalPosition")}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border my-6"></div>

          {/* Sibling Support Section */}
          <div className="mb-4">
            <h4 className="text-foreground mb-3">
              Is your brother/sister who is gainfully employed providing support
              to your:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {siblingSupportTypesOptions?.map((option: any) => {
                const isChecked = family?.background?.siblingSupportTypes?.some(
                  (item: any) => String(item.id) === String(option.id)
                );

                return (
                  <Checkbox
                    key={option.id}
                    square
                    id={`sibling-support-${option.id}`}
                    label={option.name || option.text || option.code}
                    name={`sibling-support-${option.id}`}
                    checked={isChecked || false}
                    onCheckedChange={(checked) => {
                      const currentTypes = family?.background?.siblingSupportTypes || [];
                      let newTypes;
                      if (checked) {
                        newTypes = [...currentTypes, { id: Number(option.id) }];
                      } else {
                        newTypes = currentTypes.filter(
                          (item: any) => String(item.id) !== String(option.id)
                        );
                      }
                      handleInputChange("family.background.siblingSupportTypes", newTypes);
                    }}
                  />
                );
              })}
            </div>
            {errors["family.background.siblingSupportTypes"] && (
              <p className="text-xs font-semibold text-red-600 mt-1">
                {errors["family.background.siblingSupportTypes"]}
              </p>
            )}
          </div>

          <div className="border-t border-border my-6"></div>

          {/* Who Finances Your Schooling Section */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-4">
              Who finances your schooling?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studentSupportTypesOptions?.map((option: any) => {
                const isChecked = family?.finance?.financialSupportTypes?.some(
                  (item: any) => String(item.id) === String(option.id)
                );

                return (
                  <Checkbox
                    key={option.id}
                    square
                    id={`finance-${option.id}`}
                    label={option.name || option.text || option.code}
                    name={`finance-${option.id}`}
                    checked={isChecked || false}
                    onCheckedChange={(checked) => {
                      const currentTypes = family?.finance?.financialSupportTypes || [];
                      let newTypes;
                      if (checked) {
                        newTypes = [...currentTypes, { id: Number(option.id) }];
                      } else {
                        newTypes = currentTypes.filter(
                          (item: any) => String(item.id) !== String(option.id)
                        );
                      }
                      handleInputChange("family.finance.financialSupportTypes", newTypes);
                    }}
                  />
                );
              })}
            </div>
            {errors["family.finance.financialSupportTypes"] && (
              <p className="text-xs font-semibold text-red-600 mt-1">
                {errors["family.finance.financialSupportTypes"]}
              </p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* IV. Financial Information */}
        <div>
          <h3 className="text-lg font-semibold text-card-foreground pb-3 mb-6">
            IV. Financial Information
          </h3>

          <div className="mb-8">
            <h4 className="font-semibold text-foreground mb-4">
              Parents' Combined Total Monthly Income
            </h4>
            <div className="relative">
              <select
                value={family?.finance?.monthlyFamilyIncomeRange?.id || ""}
                onChange={(e) => {
                  const val = e.target.value;
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
                    // focus the input when Others is selected
                    setTimeout(() => otherInputRef.current?.focus(), 0);
                  }
                }}
                className={`
                  w-full px-3 py-2 border rounded-md bg-card text-sm
                  appearance-none cursor-pointer transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-0 text-foreground
                  ${(family?.finance?.monthlyFamilyIncomeRange?.id !== undefined &&
                    family?.finance?.monthlyFamilyIncomeRange?.id !== null &&
                    family?.finance?.monthlyFamilyIncomeRange?.id !== "")
                    ? "border-green-500 font-medium hover:border-green-600 focus:border-green-500 focus:ring-green-500/20"
                    : "border-red-500 hover:border-red-600 focus:border-red-500 focus:ring-red-500/20"
                  }
                `}
              >
                <option value="">Select range</option>
                {monthlyFamilyIncomeRanges?.map((opt: any) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name || opt.text || opt.code}
                  </option>
                ))}
                <option value="others">Others</option>
              </select>
              {(family?.finance?.monthlyFamilyIncomeRange?.id !== undefined &&
                family?.finance?.monthlyFamilyIncomeRange?.id !== null &&
                family?.finance?.monthlyFamilyIncomeRange?.id !== "") && (
                  <Check
                    size={18}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                    strokeWidth={2.5}
                  />
                )}
            </div>
            {errors["family.finance.monthlyFamilyIncomeRange"] && (
              <p className="text-xs font-semibold text-red-600 mt-1">
                {errors["family.finance.monthlyFamilyIncomeRange"]}
              </p>
            )}

            {family?.finance?.monthlyFamilyIncomeRange?.id === "others" && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Selected "Others" — please specify income range below.
                </p>
                <input
                  ref={otherInputRef}
                  type="text"
                  placeholder="Enter income range"
                  value={
                    family?.finance?.monthlyFamilyIncomeRange
                      ?.otherSpecification || ""
                  }
                  onChange={(e) =>
                    handleInputChange(
                      "family.finance.monthlyFamilyIncomeRange.otherSpecification",
                      e.target.value,
                    )
                  }
                  onBlur={() => setOtherTouched(true)}
                  className={`flex-1 ml-0 mt-2 px-3 py-2 border rounded-md text-sm bg-card focus:outline-none ${otherTouched &&
                    !(
                      family?.finance?.monthlyFamilyIncomeRange
                        ?.otherSpecification || ""
                    )
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-border"
                    }`}
                />
                {(otherTouched &&
                  !(
                    family?.finance?.monthlyFamilyIncomeRange
                      ?.otherSpecification || ""
                  )) ||
                  errors[
                  "family.finance.monthlyFamilyIncomeRange.otherSpecification"
                  ] ? (
                  <p className="text-xs font-semibold text-red-600 mt-1">
                    {errors[
                      "family.finance.monthlyFamilyIncomeRange.otherSpecification"
                    ] || "Please provide an income range."}
                  </p>
                ) : null}
              </div>
            )}
          </div>

          <div className="mb-8">
            <InputField
              label="Weekly Allowance (PHP)"
              type="text"
              inputMode="decimal"
              placeholder="Enter amount"
              value={family?.finance?.weeklyAllowance ?? ""}
              onChange={(val: any) =>
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
              error={getFieldError("family.finance.weeklyAllowance")}
              required={isFieldRequired(familyValidationSchema, "family.finance.weeklyAllowance")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
