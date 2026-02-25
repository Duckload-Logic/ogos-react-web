import { forwardRef, useImperativeHandle, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { InputField, Checkbox } from "@/components/form";
import { SectionContainer } from "./SectionContainer";

interface FormErrors {
  [key: string]: string;
}

interface InterestsSectionRef {
  validate: () => { isValid: boolean; errors: FormErrors };
}

export const InterestsSection = forwardRef<
  InterestsSectionRef,
  {
    interests: any;
    onChange: (path: string, value: any) => void;
  }
>(function InterestsSection({ interests, onChange }, ref) {
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): { isValid: boolean; errors: FormErrors } => {
    // Interests section has no required validation
    const sectionErrors: FormErrors = {};
    setErrors(sectionErrors);
    return {
      isValid: true,
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
      <SectionContainer title="A. Activities & Involvement">
        <div className="space-y-4">
          {interests?.activities?.map((activity: any, idx: number) => (
            <Card key={idx} className="bg-gray-50">
              <CardContent className="pt-6 space-y-4">
                <InputField
                  label="Activity"
                  value={activity.activityOptions?.[0]?.name || ""}
                  onChange={(val) =>
                    handleInputChange(
                      `interests.activities.${idx}.activityOptions.0.name`,
                      val,
                    )
                  }
                  placeholder="Activity name"
                />
                <InputField
                  label="Role"
                  value={activity.role || ""}
                  onChange={(val) =>
                    handleInputChange(`interests.activities.${idx}.role`, val)
                  }
                  placeholder="e.g., Member, Officer"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600"
                  onClick={() => {
                    const updated = interests.activities.filter(
                      (_: any, i: number) => i !== idx,
                    );
                    handleInputChange("interests.activities", updated);
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
            className="w-full"
            onClick={() =>
              handleInputChange("interests.activities", [
                ...(interests?.activities || []),
                { activityOptions: [{}], role: "" },
              ])
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </div>
      </SectionContainer>

      <SectionContainer title="B. Subject Preferences">
        <div className="space-y-4">
          {interests?.subjectPreferences?.map((subject: any, idx: number) => (
            <Card key={idx} className="bg-gray-50">
              <CardContent className="pt-6 space-y-4">
                <div className="flex gap-4 items-end">
                  <InputField
                    label="Subject"
                    value={subject.subjectName || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `interests.subjectPreferences.${idx}.subjectName`,
                        val,
                      )
                    }
                    placeholder="Subject name"
                  />
                  <div className="flex items-center gap-2 pb-3">
                    <Checkbox
                      id={`fav-${idx}`}
                      label="Favorite"
                      name={`fav-${idx}`}
                      checked={subject.isFavorite || false}
                      onCheckedChange={(checked: boolean | "indeterminate") =>
                        handleInputChange(
                          `interests.subjectPreferences.${idx}.isFavorite`,
                          checked === true,
                        )
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              handleInputChange("interests.subjectPreferences", [
                ...(interests?.subjectPreferences || []),
                { subjectName: "", isFavorite: false },
              ])
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </SectionContainer>

      <SectionContainer title="C. Hobbies">
        <div className="space-y-4">
          {interests?.hobbies?.map((hobby: any, idx: number) => (
            <Card key={idx} className="bg-gray-50">
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Hobby"
                    value={hobby.hobbyName || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `interests.hobbies.${idx}.hobbyName`,
                        val,
                      )
                    }
                    placeholder="Hobby name"
                  />
                  <InputField
                    label="Priority Rank"
                    type="number"
                    value={hobby.priorityRanking || ""}
                    onChange={(val) =>
                      handleInputChange(
                        `interests.hobbies.${idx}.priorityRanking`,
                        val,
                      )
                    }
                    placeholder="1, 2, 3..."
                  />
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              handleInputChange("interests.hobbies", [
                ...(interests?.hobbies || []),
                { hobbyName: "", priorityRanking: 0 },
              ])
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Hobby
          </Button>
        </div>
      </SectionContainer>
    </div>
  );
});
