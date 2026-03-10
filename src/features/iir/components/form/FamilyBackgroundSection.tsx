import { forwardRef, useImperativeHandle, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { InputField, Checkbox, RadioField } from "@/components/form";
import { Check } from "lucide-react";
import {
  useIncomeRanges,
  useNatureOfResidenceTypes,
  useParentalStatusTypes,
} from "../../hooks";

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
  }
>(function FamilyBackgroundSection({ family, onChange }, ref) {
  const { data: parentalStatusOptions } = useParentalStatusTypes();
  const { data: natureOfResidenceOptions } = useNatureOfResidenceTypes();
  const { data: monthlyFamilyIncomeRanges } = useIncomeRanges();

  const [errors, setErrors] = useState<FormErrors>({});
  const [otherTouched, setOtherTouched] = useState(false);
  const otherInputRef = useRef<HTMLInputElement | null>(null);

  const validate = (): { isValid: boolean; errors: FormErrors } => {
    const sectionErrors: FormErrors = {};

    // Parental status
    if (!family?.background?.parentalStatus) {
      sectionErrors["family.background.parentalStatus"] = "Parental status is required";
    }

    // Family members
    const persons = [
      { key: "father", label: "Father" },
      { key: "mother", label: "Mother" },
      { key: "guardian", label: "Guardian" },
    ] as const;

    persons.forEach(({ key, label }) => {
      const person = family?.relatedPersons?.[key] || {};

      const name = (person?.name || "").trim();
      if (!name) {
        sectionErrors[`family.relatedPersons.${key}.name`] = `${label} name is required`;
      } else if (name.length < 2) {
        sectionErrors[`family.relatedPersons.${key}.name`] = `${label} name must be at least 2 characters`;
      }

      const age = person?.age;
      if (age === undefined || age === null || age === "" || Number(age) === 0) {
        sectionErrors[`family.relatedPersons.${key}.age`] = `${label} age is required`;
      } else {
        const ageNum = Number(age);
        if (isNaN(ageNum) || !Number.isInteger(ageNum) || ageNum <= 0) {
          sectionErrors[`family.relatedPersons.${key}.age`] = `${label} age must be a positive whole number`;
        }
      }

      const educ = (person?.educationalAttainment || "").trim();
      if (!educ) {
        sectionErrors[`family.relatedPersons.${key}.educationalAttainment`] = `${label} educational attainment is required`;
      } else if (educ.length < 2) {
        sectionErrors[`family.relatedPersons.${key}.educationalAttainment`] = `${label} educational attainment must be at least 2 characters`;
      }

      const occ = (person?.occupation || "").trim();
      if (!occ) {
        sectionErrors[`family.relatedPersons.${key}.occupation`] = `${label} occupation is required`;
      } else if (occ.length < 2) {
        sectionErrors[`family.relatedPersons.${key}.occupation`] = `${label} occupation must be at least 2 characters`;
      }

      if (!(person?.employerName || "").trim()) {
        sectionErrors[`family.relatedPersons.${key}.employerName`] = `${label} employer name is required`;
      }

      if (!(person?.employerAddress || "").trim()) {
        sectionErrors[`family.relatedPersons.${key}.employerAddress`] = `${label} employer address is required`;
      }

      if (person?.isLiving === undefined || person?.isLiving === null) {
        sectionErrors[`family.relatedPersons.${key}.isLiving`] = `${label} status (Living/Deceased) is required`;
      }
    });

    // Finance
    if (!family?.finance?.monthlyFamilyIncomeRange?.id) {
      sectionErrors["family.finance.monthlyFamilyIncomeRange"] = "Monthly family income range is required";
    }
    if (family?.finance?.monthlyFamilyIncomeRange?.id === "others") {
      if (!(family?.finance?.monthlyFamilyIncomeRange?.otherSpecification || "").trim()) {
        sectionErrors["family.finance.monthlyFamilyIncomeRange.otherSpecification"] = "Please specify the income range";
      }
    }

    const wa = family?.finance?.weeklyAllowance;
    if (wa === undefined || wa === null || wa === "" || Number(wa) === 0) {
      sectionErrors["family.finance.weeklyAllowance"] = "Weekly allowance is required";
    } else if (isNaN(Number(wa)) || Number(wa) <= 0) {
      sectionErrors["family.finance.weeklyAllowance"] = "Weekly allowance must be a positive number";
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
    <Card className="bg-card border border-border">
      <CardContent className="pt-6">
        {/* I. Parental Status */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-card-foreground pb-3 mb-6">
            I. Parental Status
          </h3>
          <div className="space-y-2">
            <div className="text-sm font-medium text-card-foreground flex items-start gap-1">
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parentalStatusOptions?.map((option: any) => {
                const isOther = option.name?.toLowerCase() === "other";
                const isSelected = String(family?.background?.parentalStatus) === String(option.id);

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
                            handleInputChange("family.background.parentalStatus", e.target.value)
                          }
                          className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                        <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <span className="text-sm text-foreground whitespace-nowrap">Other, please specify:</span>
                      <input
                        type="text"
                        placeholder="specify"
                        value={family?.background?.parentalStatusOther || ""}
                        onChange={(e) =>
                          handleInputChange("family.background.parentalStatusOther", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:border-border focus:ring-ring/20 text-sm bg-card text-foreground"
                      />
                    </div>
                  );
                } else if (isOther) {
                  return (
                    <label key={option.id} className="flex items-center gap-3 group cursor-pointer">
                      <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                        <input
                          type="radio"
                          name="parentalStatus"
                          value={option.id}
                          checked={false}
                          onChange={(e) =>
                            handleInputChange("family.background.parentalStatus", e.target.value)
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
                    <label key={option.id} className="flex items-center gap-3 group cursor-pointer">
                      <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                        <input
                          type="radio"
                          name="parentalStatus"
                          value={option.id}
                          checked={isSelected}
                          onChange={(e) =>
                            handleInputChange("family.background.parentalStatus", e.target.value)
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
              <p className="text-xs text-red-500 mt-2">{errors["family.background.parentalStatus"]}</p>
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
                value={family?.background?.quietPlaceToStudy || ""}
                onChange={(val) =>
                  handleInputChange("family.background.quietPlaceToStudy", val)
                }
                columns={2}
              />
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
                value={family?.background?.sharesRoom || ""}
                onChange={(val) =>
                  handleInputChange("family.background.sharesRoom", val)
                }
                columns={2}
              />
              {family?.background?.sharesRoom === "yes" && (
                <div className="mt-4">
                  <InputField
                    label="Share room with whom?"
                    value={family?.background?.roomSharingDetails || ""}
                    onChange={(val) =>
                      handleInputChange("family.background.roomSharingDetails", val)
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Checkbox square
                  id="residence-family"
                  label="Family Home"
                  name="residence-family"
                  checked={
                    family?.background?.natureOfResidence?.familyHome || false
                  }
                  onCheckedChange={(checked) =>
                    handleInputChange(
                      "family.background.natureOfResidence.familyHome",
                      checked === true
                    )
                  }
                />
                <Checkbox square
                  id="residence-bed"
                  label="Bed Spacer"
                  name="residence-bed"
                  checked={
                    family?.background?.natureOfResidence?.bedSpacer || false
                  }
                  onCheckedChange={(checked) =>
                    handleInputChange(
                      "family.background.natureOfResidence.bedSpacer",
                      checked === true
                    )
                  }
                />
                <Checkbox square
                  id="residence-relative"
                  label="Relative's House"
                  name="residence-relative"
                  checked={
                    family?.background?.natureOfResidence?.relativesHouse ||
                    false
                  }
                  onCheckedChange={(checked) =>
                    handleInputChange(
                      "family.background.natureOfResidence.relativesHouse",
                      checked === true
                    )
                  }
                />
                <Checkbox square
                  id="residence-rented"
                  label="Rented Apartment"
                  name="residence-rented"
                  checked={
                    family?.background?.natureOfResidence?.rentedApartment ||
                    false
                  }
                  onCheckedChange={(checked) =>
                    handleInputChange(
                      "family.background.natureOfResidence.rentedApartment",
                      checked === true
                    )
                  }
                />
                <Checkbox square
                  id="residence-dorm"
                  label="Dormitory"
                  name="residence-dorm"
                  checked={
                    family?.background?.natureOfResidence?.dorm || false
                  }
                  onCheckedChange={(checked) =>
                    handleInputChange(
                      "family.background.natureOfResidence.dorm",
                      checked === true
                    )
                  }
                />
                <Checkbox square
                  id="residence-married"
                  label="House of Married Brother/Sister"
                  name="residence-married"
                  checked={
                    family?.background?.natureOfResidence
                      ?.housOfMarriedSibling || false
                  }
                  onCheckedChange={(checked) =>
                    handleInputChange(
                      "family.background.natureOfResidence.housOfMarriedSibling",
                      checked === true
                    )
                  }
                />
                <Checkbox square
                  id="residence-shared"
                  label="Shares Apartment with Friends"
                  name="residence-shared"
                  checked={
                    family?.background?.natureOfResidence?.sharesWithFriends ||
                    false
                  }
                  onCheckedChange={(checked) =>
                    handleInputChange(
                      "family.background.natureOfResidence.sharesWithFriends",
                      checked === true
                    )
                  }
                />
              </div>
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
              <InputField
                label="Name"
                value={family?.relatedPersons?.father?.name || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.father.name", val)
                }
                placeholder="Father's name"
                required
                error={errors["family.relatedPersons.father.name"]}
              />
              <InputField
                label="Age"
                type="text"
                inputMode="numeric"
                value={family?.relatedPersons?.father?.age || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.father.age", val.replace(/[^0-9]/g, ""))
                }
                placeholder="Age"
                required
                error={errors["family.relatedPersons.father.age"]}
              />
              <InputField
                label="Educational Attainment"
                value={family?.relatedPersons?.father?.educationalAttainment || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.father.educationalAttainment", val)
                }
                placeholder="e.g., College Graduate"
                required
                error={errors["family.relatedPersons.father.educationalAttainment"]}
              />
              <InputField
                label="Occupation"
                value={family?.relatedPersons?.father?.occupation || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.father.occupation", val)
                }
                placeholder="e.g., Engineer"
                required
                error={errors["family.relatedPersons.father.occupation"]}
              />
              <InputField
                label="Name of Employer"
                value={family?.relatedPersons?.father?.employerName || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.father.employerName", val)
                }
                placeholder="Company name"
                required
                error={errors["family.relatedPersons.father.employerName"]}
              />
              <InputField
                label="Address of Employer"
                value={family?.relatedPersons?.father?.employerAddress || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.father.employerAddress", val)
                }
                placeholder="Company address"
                required
                error={errors["family.relatedPersons.father.employerAddress"]}
              />
            </div>
            <div className="flex gap-6">
              <label className="text-sm font-medium text-card-foreground">Status:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                    <input
                      type="radio"
                      name="father-status"
                      value="living"
                      checked={family?.relatedPersons?.father?.isLiving === true}
                      onChange={() =>
                        handleInputChange("family.relatedPersons.father.isLiving", true)
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
                      checked={family?.relatedPersons?.father?.isLiving === false}
                      onChange={() =>
                        handleInputChange("family.relatedPersons.father.isLiving", false)
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
            {errors["family.relatedPersons.father.isLiving"] && (
              <p className="text-xs text-red-500 mt-2">{errors["family.relatedPersons.father.isLiving"]}</p>
            )}
            </div>
            <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-4">Mother</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputField
                label="Name"
                value={family?.relatedPersons?.mother?.name || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.mother.name", val)
                }
                placeholder="Mother's name"
                required
                error={errors["family.relatedPersons.mother.name"]}
              />
              <InputField
                label="Age"
                type="text"
                inputMode="numeric"
                value={family?.relatedPersons?.mother?.age || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.mother.age", val.replace(/[^0-9]/g, ""))
                }
                placeholder="Age"
                required
                error={errors["family.relatedPersons.mother.age"]}
              />
              <InputField
                label="Educational Attainment"
                value={family?.relatedPersons?.mother?.educationalAttainment || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.mother.educationalAttainment", val)
                }
                placeholder="e.g., College Graduate"
                required
                error={errors["family.relatedPersons.mother.educationalAttainment"]}
              />
              <InputField
                label="Occupation"
                value={family?.relatedPersons?.mother?.occupation || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.mother.occupation", val)
                }
                placeholder="e.g., Engineer"
                required
                error={errors["family.relatedPersons.mother.occupation"]}
              />
              <InputField
                label="Name of Employer"
                value={family?.relatedPersons?.mother?.employerName || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.mother.employerName", val)
                }
                placeholder="Company name"
                required
                error={errors["family.relatedPersons.mother.employerName"]}
              />
              <InputField
                label="Address of Employer"
                value={family?.relatedPersons?.mother?.employerAddress || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.mother.employerAddress", val)
                }
                placeholder="Company address"
                required
                error={errors["family.relatedPersons.mother.employerAddress"]}
              />
            </div>
            <div className="flex gap-6">
              <label className="text-sm font-medium text-card-foreground">Status:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                    <input
                      type="radio"
                      name="mother-status"
                      value="living"
                      checked={family?.relatedPersons?.mother?.isLiving === true}
                      onChange={() =>
                        handleInputChange("family.relatedPersons.mother.isLiving", true)
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
                      checked={family?.relatedPersons?.mother?.isLiving === false}
                      onChange={() =>
                        handleInputChange("family.relatedPersons.mother.isLiving", false)
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
            {errors["family.relatedPersons.mother.isLiving"] && (
              <p className="text-xs text-red-500 mt-2">{errors["family.relatedPersons.mother.isLiving"]}</p>
            )}
            </div>

            <div className="border-t border-border my-6"></div>

            {/* Guardian Sub-section */}
            <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-4">Guardian</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputField
                label="Name"
                value={family?.relatedPersons?.guardian?.name || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.guardian.name", val)
                }
                placeholder="Guardian's name"
                required
                error={errors["family.relatedPersons.guardian.name"]}
              />
              <InputField
                label="Age"
                type="text"
                inputMode="numeric"
                value={family?.relatedPersons?.guardian?.age || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.guardian.age", val.replace(/[^0-9]/g, ""))
                }
                placeholder="Age"
                required
                error={errors["family.relatedPersons.guardian.age"]}
              />
              <InputField
                label="Educational Attainment"
                value={family?.relatedPersons?.guardian?.educationalAttainment || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.guardian.educationalAttainment", val)
                }
                placeholder="e.g., College Graduate"
                required
                error={errors["family.relatedPersons.guardian.educationalAttainment"]}
              />
              <InputField
                label="Occupation"
                value={family?.relatedPersons?.guardian?.occupation || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.guardian.occupation", val)
                }
                placeholder="e.g., Engineer"
                required
                error={errors["family.relatedPersons.guardian.occupation"]}
              />
              <InputField
                label="Name of Employer"
                value={family?.relatedPersons?.guardian?.employerName || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.guardian.employerName", val)
                }
                placeholder="Company name"
                required
                error={errors["family.relatedPersons.guardian.employerName"]}
              />
              <InputField
                label="Address of Employer"
                value={family?.relatedPersons?.guardian?.employerAddress || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.guardian.employerAddress", val)
                }
                placeholder="Company address"
                required
                error={errors["family.relatedPersons.guardian.employerAddress"]}
              />
            </div>
            <div className="flex gap-6">
              <label className="text-sm font-medium text-card-foreground">Status:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                    <input
                      type="radio"
                      name="guardian-status"
                      value="living"
                      checked={family?.relatedPersons?.guardian?.isLiving === true}
                      onChange={() =>
                        handleInputChange("family.relatedPersons.guardian.isLiving", true)
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
                      checked={family?.relatedPersons?.guardian?.isLiving === false}
                      onChange={() =>
                        handleInputChange("family.relatedPersons.guardian.isLiving", false)
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
            {errors["family.relatedPersons.guardian.isLiving"] && (
              <p className="text-xs text-red-500 mt-2">{errors["family.relatedPersons.guardian.isLiving"]}</p>
            )}
            </div>

            <div className="border-t border-border my-6"></div>

            {/* Family Information Fields */}
            <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-4">Sibling Information</h4>
            {/* Row 1: 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-foreground h-10 flex items-center">No. of Children (incl. yourself)</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={family?.background?.numberOfChildren || ""}
                    onChange={(e) =>
                      handleInputChange("family.background.numberOfChildren", e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      family?.background?.numberOfChildren
                        ? 'bg-card border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'bg-card border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                  />
                  {!!family?.background?.numberOfChildren && (
                    <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-foreground h-10 flex items-center">No. of Brothers</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={family?.background?.brothers || ""}
                    onChange={(e) =>
                      handleInputChange("family.background.brothers", e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      family?.background?.brothers
                        ? 'bg-card border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'bg-card border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                  />
                  {!!family?.background?.brothers && (
                    <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-foreground h-10 flex items-center">No. of Sisters</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={family?.background?.sisters || ""}
                    onChange={(e) =>
                      handleInputChange("family.background.sisters", e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      family?.background?.sisters
                        ? 'bg-card border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'bg-card border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                  />
                  {!!family?.background?.sisters && (
                    <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
                  )}
                </div>
              </div>
            </div>
            {/* Row 2: 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-foreground h-10 flex items-center">No. of Gainfully Employed</label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="0"
                    value={family?.background?.employedSiblings || ""}
                    onChange={(e) =>
                      handleInputChange("family.background.employedSiblings", e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      family?.background?.employedSiblings
                        ? 'bg-card border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'bg-card border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                  />
                  {!!family?.background?.employedSiblings && (
                    <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-foreground h-10 flex items-center">Ordinal Position</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g., 1st"
                    value={family?.background?.ordinalPosition || ""}
                    onChange={(e) =>
                      handleInputChange("family.background.ordinalPosition", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      family?.background?.ordinalPosition
                        ? 'bg-card border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'bg-card border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                  />
                  {!!family?.background?.ordinalPosition && (
                    <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
                  )}
                </div>
              </div>
            </div>
            </div>
            </div>

            <div className="border-t border-border my-6"></div>

            {/* Sibling Support Section */}
            <div className="mb-4">
            <h4 className="text-foreground mb-3">
              Is your brother/sister who is gainfully employed providing support to your:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Checkbox square
                id="sibling-support-family"
                label="Family"
                name="sibling-support-family"
                checked={
                  family?.background?.siblingSupport?.family || false
                }
                onCheckedChange={(checked) =>
                  handleInputChange(
                    "family.background.siblingSupport.family",
                    checked === true
                  )
                }
              />
              <Checkbox square
                id="sibling-support-studies"
                label="Your studies"
                name="sibling-support-studies"
                checked={
                  family?.background?.siblingSupport?.studies || false
                }
                onCheckedChange={(checked) =>
                  handleInputChange(
                    "family.background.siblingSupport.studies",
                    checked === true
                  )
                }
              />
              <Checkbox square
                id="sibling-support-own-family"
                label="His/Her Own Family"
                name="sibling-support-own-family"
                checked={
                  family?.background?.siblingSupport?.ownFamily || false
                }
                onCheckedChange={(checked) =>
                  handleInputChange(
                    "family.background.siblingSupport.ownFamily",
                    checked === true
                  )
                }
              />
            </div>
            </div>

            <div className="border-t border-border my-6"></div>

            {/* Who Finances Your Schooling Section */}
            <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-4">
              Who finances your schooling?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Checkbox square
                id="finance-parents"
                label="Parents"
                name="finance-parents"
                checked={
                  family?.background?.financingSource?.parents || false
                }
                onCheckedChange={(checked) =>
                  handleInputChange(
                    "family.background.financingSource.parents",
                    checked === true
                  )
                }
              />
              <Checkbox square
                id="finance-spouse"
                label="Spouse"
                name="finance-spouse"
                checked={
                  family?.background?.financingSource?.spouse || false
                }
                onCheckedChange={(checked) =>
                  handleInputChange(
                    "family.background.financingSource.spouse",
                    checked === true
                  )
                }
              />
              <Checkbox square
                id="finance-sibling"
                label="Brother/Sister"
                name="finance-sibling"
                checked={
                  family?.background?.financingSource?.sibling || false
                }
                onCheckedChange={(checked) =>
                  handleInputChange(
                    "family.background.financingSource.sibling",
                    checked === true
                  )
                }
              />
              <Checkbox square
                id="finance-scholarship"
                label="Scholarship"
                name="finance-scholarship"
                checked={
                  family?.background?.financingSource?.scholarship || false
                }
                onCheckedChange={(checked) =>
                  handleInputChange(
                    "family.background.financingSource.scholarship",
                    checked === true
                  )
                }
              />
              <Checkbox square
                id="finance-relatives"
                label="Relatives"
                name="finance-relatives"
                checked={
                  family?.background?.financingSource?.relatives || false
                }
                onCheckedChange={(checked) =>
                  handleInputChange(
                    "family.background.financingSource.relatives",
                    checked === true
                  )
                }
              />
              <Checkbox square
                id="finance-self"
                label="Self-supporting/Working Student"
                name="finance-self"
                checked={
                  family?.background?.financingSource?.selfSupporting || false
                }
                onCheckedChange={(checked) =>
                  handleInputChange(
                    "family.background.financingSource.selfSupporting",
                    checked === true
                  )
                }
              />
            </div>
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
                      ""
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
                  ${
                    family?.finance?.monthlyFamilyIncomeRange?.id
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
              {!!family?.finance?.monthlyFamilyIncomeRange?.id && (
                <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
              )}
            </div>
            {errors["family.finance.monthlyFamilyIncomeRange"] && (
              <p className="text-xs text-red-500 mt-2">{errors["family.finance.monthlyFamilyIncomeRange"]}</p>
            )}

            {family?.finance?.monthlyFamilyIncomeRange?.id === "others" && (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">Selected "Others" — please specify income range below.</p>
                <input
                  ref={otherInputRef}
                  type="text"
                  placeholder="Enter income range"
                  value={family?.finance?.monthlyFamilyIncomeRange?.otherSpecification || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "family.finance.monthlyFamilyIncomeRange.otherSpecification",
                      e.target.value
                    )
                  }
                  onBlur={() => setOtherTouched(true)}
                  className={`flex-1 ml-0 mt-2 px-3 py-2 border rounded-md text-sm bg-card focus:outline-none ${
                    otherTouched && !(family?.finance?.monthlyFamilyIncomeRange?.otherSpecification || "")
                      ? "border-red-500 focus:ring-red-500/20"
                      : "border-border"
                  }`}
                />
                {(otherTouched && !(family?.finance?.monthlyFamilyIncomeRange?.otherSpecification || "")) || errors["family.finance.monthlyFamilyIncomeRange.otherSpecification"] ? (
                  <p className="text-xs text-red-500 mt-2">{errors["family.finance.monthlyFamilyIncomeRange.otherSpecification"] || "Please provide an income range."}</p>
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
              value={family?.finance?.weeklyAllowance || ""}
              onChange={(val) =>
                handleInputChange("family.finance.weeklyAllowance", val.replace(/[^0-9.]/g, ""))
              }
              error={errors["family.finance.weeklyAllowance"]}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
