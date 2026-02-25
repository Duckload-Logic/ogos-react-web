import { forwardRef, useImperativeHandle, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { DropdownField, InputField, Checkbox } from "@/components/form";
import { SectionContainer } from "./SectionContainer";
import {
  useIncomeRanges,
  useNatureOfResidenceTypes,
  useParentalStatusTypes,
  useStudentRelationshipTypes,
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
  const { data: familyRelationshipOptions } = useStudentRelationshipTypes();

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): { isValid: boolean; errors: FormErrors } => {
    const sectionErrors: FormErrors = {};

    if (!family?.background) {
      sectionErrors["family.background"] = "Family background is required";
    }
    if (!family?.relatedPersons || family.relatedPersons.length === 0) {
      sectionErrors["family.relatedPersons"] =
        "At least one family member information is required";
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
    <div className="space-y-6">
      <SectionContainer title="A. Family Background">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DropdownField
            label="Parental Status"
            options={parentalStatusOptions || []}
            value={family?.background?.parentalStatus?.id || ""}
            onChange={(val) =>
              handleInputChange("family.background.parentalStatus", { id: val })
            }
            required
          />
          <InputField
            label="Number of Brothers"
            type="number"
            placeholder="Enter number of brothers"
            value={family?.background?.brothers || ""}
            onChange={(val) =>
              handleInputChange("family.background.brothers", val)
            }
            required
          />
          <InputField
            label="Number of Sisters"
            type="number"
            placeholder="Enter number of sisters"
            value={family?.background?.sisters || ""}
            onChange={(val) =>
              handleInputChange("family.background.sisters", val)
            }
            required
          />
          <InputField
            label="Employed Siblings"
            placeholder="Enter number of employed siblings"
            type="number"
            value={family?.background?.employedSiblings || ""}
            onChange={(val) =>
              handleInputChange("family.background.employedSiblings", val)
            }
            required
          />
          <InputField
            label="Ordinal Position"
            type="number"
            value={family?.background?.ordinalPosition || ""}
            onChange={(val) =>
              handleInputChange("family.background.ordinalPosition", val)
            }
            placeholder="e.g., 2 (2nd child)"
            required
          />
        </div>

        <div className="mt-6 space-y-4">
          <Checkbox
            id="quietPlace"
            label="Have quiet place to study at home"
            name="quietPlace"
            checked={family?.background?.haveQuietPlaceToStudy || false}
            onCheckedChange={(checked: boolean | "indeterminate") =>
              handleInputChange(
                "family.background.haveQuietPlaceToStudy",
                checked === true,
              )
            }
          />

          <Checkbox
            id="sharingRoom"
            label="Sharing room with siblings"
            name="sharingRoom"
            checked={family?.background?.isSharingRoom || false}
            onCheckedChange={(checked: boolean | "indeterminate") =>
              handleInputChange(
                "family.background.isSharingRoom",
                checked === true,
              )
            }
          />

          {family?.background?.isSharingRoom && (
            <InputField
              label="Sharing Room Details"
              isTextarea
              value={family?.background?.roomSharingDetails || ""}
              onChange={(val) =>
                handleInputChange("family.background.roomSharingDetails", val)
              }
              placeholder="Who do you share the room with?"
            />
          )}
        </div>

        <div className="mt-4">
          <DropdownField
            label="Nature of Residence"
            options={natureOfResidenceOptions || []}
            value={family?.background?.natureOfResidence?.id || ""}
            onChange={(val) =>
              handleInputChange("family.background.natureOfResidence", {
                id: val,
              })
            }
          />
        </div>
      </SectionContainer>

      <SectionContainer title="B. Family Members Information">
        <div className="space-y-4">
          {family?.relatedPersons?.map((person: any, idx: number) => (
            <Card
              key={idx}
              className="bg-gray-50 border-l-4 border-l-purple-500"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  {person.firstName} {person.lastName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    value={person.firstName || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${idx}.firstName`,
                        val,
                      )
                    }
                  />
                  <InputField
                    label="Middle Name"
                    value={person.middleName || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${idx}.middleName`,
                        val,
                      )
                    }
                  />
                  <InputField
                    label="Last Name"
                    value={person.lastName || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${idx}.lastName`,
                        val,
                      )
                    }
                  />
                  <InputField
                    label="Date of Birth"
                    type="date"
                    value={person.dateOfBirth || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${idx}.dateOfBirth`,
                        val,
                      )
                    }
                  />
                  <InputField
                    label="Educational Level"
                    value={person.educationalLevel || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${idx}.educationalLevel`,
                        val,
                      )
                    }
                    placeholder="e.g., College Graduate"
                  />
                  <InputField
                    label="Occupation"
                    value={person.occupation || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${idx}.occupation`,
                        val,
                      )
                    }
                  />
                  <InputField
                    label="Employer Name"
                    value={person.employerName || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${idx}.employerName`,
                        val,
                      )
                    }
                  />
                  <InputField
                    label="Employer Address"
                    value={person.employerAddress || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${idx}.employerAddress`,
                        val,
                      )
                    }
                  />
                  <DropdownField
                    label="Relationship"
                    options={familyRelationshipOptions}
                    value={person.relationship?.id || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `family.relatedPersons.${idx}.relationship`,
                        {
                          id: val,
                        },
                      )
                    }
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <Checkbox
                    id={`parent-${idx}`}
                    label="Parent"
                    name={`parent-${idx}`}
                    checked={person.isParent || false}
                    onCheckedChange={(checked: boolean | "indeterminate") =>
                      handleInputChange(
                        `family.relatedPersons.${idx}.isParent`,
                        checked === true,
                      )
                    }
                  />
                  <Checkbox
                    id={`guardian-${idx}`}
                    label="Guardian"
                    name={`guardian-${idx}`}
                    checked={person.isGuardian || false}
                    onCheckedChange={(checked: boolean | "indeterminate") =>
                      handleInputChange(
                        `family.relatedPersons.${idx}.isGuardian`,
                        checked === true,
                      )
                    }
                  />
                  <Checkbox
                    id={`living-${idx}`}
                    label="Living"
                    name={`living-${idx}`}
                    checked={person.isLiving !== false}
                    onCheckedChange={(checked: boolean | "indeterminate") =>
                      handleInputChange(
                        `family.relatedPersons.${idx}.isLiving`,
                        checked === true,
                      )
                    }
                  />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => {
                    const updated = family.relatedPersons.filter(
                      (_: any, i: number) => i !== idx,
                    );
                    handleInputChange("family.relatedPersons", updated);
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() =>
              handleInputChange("family.relatedPersons", [
                ...(family?.relatedPersons || []),
                {
                  firstName: "",
                  middleName: "",
                  lastName: "",
                  dateOfBirth: "",
                  educationalLevel: "",
                  occupation: "",
                  employerName: "",
                  employerAddress: "",
                  relationship: {},
                  isParent: false,
                  isGuardian: false,
                  isLiving: true,
                },
              ])
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Family Member
          </Button>
        </div>
      </SectionContainer>

      <SectionContainer title="C. Financial Information">
        <div className="space-y-4">
          <DropdownField
            label="Monthly Family Income Range"
            options={monthlyFamilyIncomeRanges || []}
            value={family?.finance?.monthlyFamilyIncomeRange?.id || ""}
            onChange={(val) =>
              handleInputChange("family.finance.monthlyFamilyIncomeRange", {
                id: val,
              })
            }
          />

          <InputField
            label="Other Income Details"
            isTextarea
            value={family?.finance?.otherIncomeDetails || ""}
            onChange={(val) =>
              handleInputChange("family.finance.otherIncomeDetails", val)
            }
            placeholder="e.g., Business, rental income"
          />

          <InputField
            label="Weekly Allowance (PHP)"
            type="number"
            inputMode="decimal"
            value={family?.finance?.weeklyAllowance || ""}
            onChange={(val) =>
              handleInputChange("family.finance.weeklyAllowance", val)
            }
          />
        </div>
      </SectionContainer>
    </div>
  );
});
