import { forwardRef, useImperativeHandle, useState } from "react";
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

  const validate = (): { isValid: boolean; errors: FormErrors } => {
    const sectionErrors: FormErrors = {};

    if (!family?.background) {
      sectionErrors["family.background"] = "Family background is required";
    }
    if (!family?.relatedPersons) {
      sectionErrors["family.relatedPersons"] =
        "Family members information is required";
    }
    if (!family?.finance) {
      sectionErrors["family.finance"] =
        "Family financial information is required";
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
    <Card className="bg-white border border-gray-200">
      <CardContent className="pt-6">
        {/* I. Parental Status */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-card-foreground pb-3 mb-6">
            I. Parental Status
          </h3>
          <div className="space-y-2">
            <div className="text-sm font-medium text-card-foreground flex items-start gap-1">
              <span>Select Parental Status</span>
              <span className="text-red-500">*</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {parentalStatusOptions?.map((option: any) => {
                const isOther = option.name?.toLowerCase() === "other";
                const isSelected = String(family?.background?.parentalStatus) === String(option.id);

                if (isOther && isSelected) {
                  return (
                    <div key={option.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="parentalStatus"
                        value={option.id}
                        checked={true}
                        onChange={(e) =>
                          handleInputChange("family.background.parentalStatus", e.target.value)
                        }
                        className="w-4 h-4 cursor-pointer accent-red-600 flex-shrink-0"
                      />
                      <span className="text-sm text-foreground whitespace-nowrap">Other, please specify:</span>
                      <input
                        type="text"
                        placeholder="specify"
                        value={family?.background?.parentalStatusOther || ""}
                        onChange={(e) =>
                          handleInputChange("family.background.parentalStatusOther", e.target.value)
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-gray-300 focus:ring-gray-200 text-sm"
                      />
                    </div>
                  );
                } else if (isOther) {
                  return (
                    <label key={option.id} className="flex items-center gap-3 group cursor-pointer">
                      <input
                        type="radio"
                        name="parentalStatus"
                        value={option.id}
                        checked={false}
                        onChange={(e) =>
                          handleInputChange("family.background.parentalStatus", e.target.value)
                        }
                        className="w-4 h-4 cursor-pointer accent-red-600"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                        Other, please specify:
                      </span>
                    </label>
                  );
                } else {
                  return (
                    <label key={option.id} className="flex items-center gap-3 group cursor-pointer">
                      <input
                        type="radio"
                        name="parentalStatus"
                        value={option.id}
                        checked={isSelected}
                        onChange={(e) =>
                          handleInputChange("family.background.parentalStatus", e.target.value)
                        }
                        className="w-4 h-4 cursor-pointer accent-red-600"
                      />
                      <span className="text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                        {option.name || option.text || option.code}
                      </span>
                    </label>
                  );
                }
              })}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-8"></div>

        {/* II. Living Situation */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-card-foreground pb-3 mb-6">
            II. Living Situation
          </h3>
          <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-medium text-gray-900 mb-3">
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

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-medium text-gray-900 mb-3">
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

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">
                Nature of Residence
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Checkbox
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
                <Checkbox
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
                <Checkbox
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
                <Checkbox
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
                <Checkbox
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
                <Checkbox
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
                <Checkbox
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
        <div className="border-t border-gray-300 my-8"></div>

        {/* III. Family Members Information */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-card-foreground pb-3 mb-6">
            III. Family Members Information
          </h3>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            {/* Father Sub-section */}
            <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Father</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputField
                label="Name"
                value={family?.relatedPersons?.father?.name || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.father.name", val)
                }
                placeholder="Father's name"
              />
              <InputField
                label="Age"
                type="number"
                value={family?.relatedPersons?.father?.age || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.father.age", val)
                }
                placeholder="Age"
              />
              <InputField
                label="Educational Attainment"
                value={family?.relatedPersons?.father?.educationalAttainment || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.father.educationalAttainment", val)
                }
                placeholder="e.g., College Graduate"
              />
              <InputField
                label="Occupation"
                value={family?.relatedPersons?.father?.occupation || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.father.occupation", val)
                }
                placeholder="e.g., Engineer"
              />
              <InputField
                label="Name of Employer"
                value={family?.relatedPersons?.father?.employerName || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.father.employerName", val)
                }
                placeholder="Company name"
              />
              <InputField
                label="Address of Employer"
                value={family?.relatedPersons?.father?.employerAddress || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.father.employerAddress", val)
                }
                placeholder="Company address"
              />
            </div>
            <div className="flex gap-6">
              <label className="text-sm font-medium text-card-foreground">Status:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="father-status"
                    value="living"
                    checked={family?.relatedPersons?.father?.isLiving !== false}
                    onChange={() =>
                      handleInputChange("family.relatedPersons.father.isLiving", true)
                    }
                    className="w-4 h-4 accent-red-600"
                  />
                  <span className="text-sm">Living</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="father-status"
                    value="deceased"
                    checked={family?.relatedPersons?.father?.isLiving === false}
                    onChange={() =>
                      handleInputChange("family.relatedPersons.father.isLiving", false)
                    }
                    className="w-4 h-4 accent-red-600"
                  />
                  <span className="text-sm">Deceased</span>
                </label>
              </div>
            </div>
            </div>

            <div className="border-t border-gray-300 my-6"></div>

            {/* Mother Sub-section */}
            <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Mother</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputField
                label="Name"
                value={family?.relatedPersons?.mother?.name || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.mother.name", val)
                }
                placeholder="Mother's name"
              />
              <InputField
                label="Age"
                type="number"
                value={family?.relatedPersons?.mother?.age || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.mother.age", val)
                }
                placeholder="Age"
              />
              <InputField
                label="Educational Attainment"
                value={family?.relatedPersons?.mother?.educationalAttainment || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.mother.educationalAttainment", val)
                }
                placeholder="e.g., College Graduate"
              />
              <InputField
                label="Occupation"
                value={family?.relatedPersons?.mother?.occupation || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.mother.occupation", val)
                }
                placeholder="e.g., Engineer"
              />
              <InputField
                label="Name of Employer"
                value={family?.relatedPersons?.mother?.employerName || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.mother.employerName", val)
                }
                placeholder="Company name"
              />
              <InputField
                label="Address of Employer"
                value={family?.relatedPersons?.mother?.employerAddress || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.mother.employerAddress", val)
                }
                placeholder="Company address"
              />
            </div>
            <div className="flex gap-6">
              <label className="text-sm font-medium text-card-foreground">Status:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mother-status"
                    value="living"
                    checked={family?.relatedPersons?.mother?.isLiving !== false}
                    onChange={() =>
                      handleInputChange("family.relatedPersons.mother.isLiving", true)
                    }
                    className="w-4 h-4 accent-red-600"
                  />
                  <span className="text-sm">Living</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mother-status"
                    value="deceased"
                    checked={family?.relatedPersons?.mother?.isLiving === false}
                    onChange={() =>
                      handleInputChange("family.relatedPersons.mother.isLiving", false)
                    }
                    className="w-4 h-4 accent-red-600"
                  />
                  <span className="text-sm">Deceased</span>
                </label>
              </div>
            </div>
            </div>

            <div className="border-t border-gray-300 my-6"></div>

            {/* Guardian Sub-section */}
            <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Guardian</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <InputField
                label="Name"
                value={family?.relatedPersons?.guardian?.name || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.guardian.name", val)
                }
                placeholder="Guardian's name"
              />
              <InputField
                label="Age"
                type="number"
                value={family?.relatedPersons?.guardian?.age || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.guardian.age", val)
                }
                placeholder="Age"
              />
              <InputField
                label="Educational Attainment"
                value={family?.relatedPersons?.guardian?.educationalAttainment || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.guardian.educationalAttainment", val)
                }
                placeholder="e.g., College Graduate"
              />
              <InputField
                label="Occupation"
                value={family?.relatedPersons?.guardian?.occupation || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.guardian.occupation", val)
                }
                placeholder="e.g., Engineer"
              />
              <InputField
                label="Name of Employer"
                value={family?.relatedPersons?.guardian?.employerName || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.guardian.employerName", val)
                }
                placeholder="Company name"
              />
              <InputField
                label="Address of Employer"
                value={family?.relatedPersons?.guardian?.employerAddress || ""}
                onChange={(val) =>
                  handleInputChange("family.relatedPersons.guardian.employerAddress", val)
                }
                placeholder="Company address"
              />
            </div>
            <div className="flex gap-6">
              <label className="text-sm font-medium text-card-foreground">Status:</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="guardian-status"
                    value="living"
                    checked={family?.relatedPersons?.guardian?.isLiving !== false}
                    onChange={() =>
                      handleInputChange("family.relatedPersons.guardian.isLiving", true)
                    }
                    className="w-4 h-4 accent-red-600"
                  />
                  <span className="text-sm">Living</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="guardian-status"
                    value="deceased"
                    checked={family?.relatedPersons?.guardian?.isLiving === false}
                    onChange={() =>
                      handleInputChange("family.relatedPersons.guardian.isLiving", false)
                    }
                    className="w-4 h-4 accent-red-600"
                  />
                  <span className="text-sm">Deceased</span>
                </label>
              </div>
            </div>
            </div>

            <div className="border-t border-gray-300 my-6"></div>

            {/* Family Information Fields */}
            <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">Sibling Information</h4>
            {/* Row 1: 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-foreground h-10 flex items-center">No. of Children (incl. yourself)</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    value={family?.background?.numberOfChildren || ""}
                    onChange={(e) =>
                      handleInputChange("family.background.numberOfChildren", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      family?.background?.numberOfChildren
                        ? 'bg-white border-green-500 focus:border-green-500 focus:ring-green-200'
                        : 'bg-white border-red-500 focus:border-red-500 focus:ring-red-200'
                    }`}
                  />
                  {family?.background?.numberOfChildren && (
                    <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-foreground h-10 flex items-center">No. of Brothers</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    value={family?.background?.brothers || ""}
                    onChange={(e) =>
                      handleInputChange("family.background.brothers", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      family?.background?.brothers
                        ? 'bg-white border-green-500 focus:border-green-500 focus:ring-green-200'
                        : 'bg-white border-red-500 focus:border-red-500 focus:ring-red-200'
                    }`}
                  />
                  {family?.background?.brothers && (
                    <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
                  )}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-foreground h-10 flex items-center">No. of Sisters</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0"
                    value={family?.background?.sisters || ""}
                    onChange={(e) =>
                      handleInputChange("family.background.sisters", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      family?.background?.sisters
                        ? 'bg-white border-green-500 focus:border-green-500 focus:ring-green-200'
                        : 'bg-white border-red-500 focus:border-red-500 focus:ring-red-200'
                    }`}
                  />
                  {family?.background?.sisters && (
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
                    type="number"
                    placeholder="0"
                    value={family?.background?.employedSiblings || ""}
                    onChange={(e) =>
                      handleInputChange("family.background.employedSiblings", e.target.value)
                    }
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      family?.background?.employedSiblings
                        ? 'bg-white border-green-500 focus:border-green-500 focus:ring-green-200'
                        : 'bg-white border-red-500 focus:border-red-500 focus:ring-red-200'
                    }`}
                  />
                  {family?.background?.employedSiblings && (
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
                        ? 'bg-white border-green-500 focus:border-green-500 focus:ring-green-200'
                        : 'bg-white border-red-500 focus:border-red-500 focus:ring-red-200'
                    }`}
                  />
                  {family?.background?.ordinalPosition && (
                    <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
                  )}
                </div>
              </div>
            </div>
            </div>
            </div>

            <div className="border-t border-gray-300 my-6"></div>

            {/* Sibling Support Section */}
            <div className="mb-4">
            <h4 className="text-gray-900 mb-3">
              Is your brother/sister who is gainfully employed providing support to your:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Checkbox
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
              <Checkbox
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
              <Checkbox
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

            <div className="border-t border-gray-300 my-6"></div>

            {/* Who Finances Your Schooling Section */}
            <div className="mb-6">
            <h4 className="font-semibold text-gray-900 mb-4">
              Who finances your schooling?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Checkbox
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
              <Checkbox
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
              <Checkbox
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
              <Checkbox
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
              <Checkbox
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
              <Checkbox
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
        <div className="border-t border-gray-300 my-8"></div>

        {/* IV. Financial Information */}
        <div>
          <h3 className="text-lg font-semibold text-card-foreground pb-3 mb-6">
            IV. Financial Information
          </h3>

          <div className="mb-8">
            <h4 className="font-semibold text-gray-900 mb-4">
              Parents' Combined Total Monthly Income
            </h4>
            <RadioField
              label=""
              options={monthlyFamilyIncomeRanges || []}
              value={family?.finance?.monthlyFamilyIncomeRange?.id || ""}
              onChange={(val) =>
                handleInputChange("family.finance.monthlyFamilyIncomeRange", {
                  id: val,
                })
              }
              columns={3}
            />
            {/* Others, please specify option */}
            <label className="flex items-center gap-3 group cursor-pointer mt-4">
              <input
                type="radio"
                name="income-range"
                value="others"
                checked={family?.finance?.monthlyFamilyIncomeRange?.id === "others"}
                onChange={(e) =>
                  handleInputChange("family.finance.monthlyFamilyIncomeRange", {
                    id: e.target.value,
                  })
                }
                className="w-4 h-4 cursor-pointer accent-red-600"
              />
              <span className="text-sm text-foreground">Others, please specify:</span>
              {family?.finance?.monthlyFamilyIncomeRange?.id === "others" && (
                <input
                  type="text"
                  placeholder="Enter income range"
                  value={family?.finance?.monthlyFamilyIncomeRange?.otherSpecification || ""}
                  onChange={(e) =>
                    handleInputChange(
                      "family.finance.monthlyFamilyIncomeRange.otherSpecification",
                      e.target.value
                    )
                  }
                  className="flex-1 ml-2 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              )}
            </label>
          </div>

          <div className="mb-8">
            <InputField
              label="Weekly Allowance (PHP)"
              type="number"
              inputMode="decimal"
              placeholder="Enter amount"
              value={family?.finance?.weeklyAllowance || ""}
              onChange={(val) =>
                handleInputChange("family.finance.weeklyAllowance", val)
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
