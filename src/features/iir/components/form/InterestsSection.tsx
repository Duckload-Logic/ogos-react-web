import { forwardRef, useImperativeHandle, useState } from "react";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InputField, Checkbox } from "@/components/form";

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
    <Card className="bg-card border border-border">
      <CardContent className="pt-6">
        {/* A. Academic */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            A. Academic
          </h3>

          {/* Academic Clubs Checkboxes - 3 column grid */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Checkbox
                id="mathClub"
                name="mathClub"
                label="Math Club"
                checked={interests?.academic?.mathClub || false}
                onCheckedChange={(checked) =>
                  handleInputChange("interests.academic.mathClub", checked === true)
                }
              />

              <Checkbox
                id="scienceClub"
                name="scienceClub"
                label="Science Club"
                checked={interests?.academic?.scienceClub || false}
                onCheckedChange={(checked) =>
                  handleInputChange("interests.academic.scienceClub", checked === true)
                }
              />

              <div className="flex items-center gap-3 whitespace-nowrap">
                <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                  <input
                    type="checkbox"
                    checked={interests?.academic?.othersChecked || false}
                    onChange={(e) => {
                      handleInputChange("interests.academic.othersChecked", e.target.checked);
                      if (!e.target.checked) {
                        handleInputChange("interests.academic.othersSpecify", "");
                      }
                    }}
                    className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="h-full w-full rounded-full border border-card-foreground bg-white transition-all duration-200 peer-checked:bg-red-600 peer-checked:border-red-600 peer-hover:border-red-600" />
                  <Check className="absolute h-3 w-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <span className="text-sm text-foreground flex-shrink-0">Others:</span>
                <input
                  type="text"
                  value={interests?.academic?.othersSpecify || ""}
                  onChange={(e) =>
                    handleInputChange("interests.academic.othersSpecify", e.target.value)
                  }
                  placeholder="specify"
                  className="px-3 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:border-border focus:ring-ring/20 text-sm w-32 flex-shrink-0"
                  disabled={!interests?.academic?.othersChecked}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Checkbox
                id="debatingClub"
                name="debatingClub"
                label="Debating Club"
                checked={interests?.academic?.debatingClub || false}
                onCheckedChange={(checked) =>
                  handleInputChange("interests.academic.debatingClub", checked === true)
                }
              />

              <Checkbox
                id="quizzersClub"
                name="quizzersClub"
                label="Quizzer's Club"
                checked={interests?.academic?.quizzersClub || false}
                onCheckedChange={(checked) =>
                  handleInputChange("interests.academic.quizzersClub", checked === true)
                }
              />
            </div>
          </div>

          {/* Subject Preference Text Fields */}
          <div className="space-y-4">
            <InputField
              label="What is/are your favorite subject/s?"
              value={interests?.academic?.favoriteSubjects || ""}
              onChange={(val) =>
                handleInputChange("interests.academic.favoriteSubjects", val)
              }
              placeholder="Enter favorite subjects"
            />
            <InputField
              label="What is/are the subject/s you like least?"
              value={interests?.academic?.leastLikedSubjects || ""}
              onChange={(val) =>
                handleInputChange("interests.academic.leastLikedSubjects", val)
              }
              placeholder="Enter least liked subjects"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-8"></div>

        {/* B. Extra-Curricular */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            B. Extra-Curricular
          </h3>

          {/* Hobbies Section */}
          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-4">
              What are your hobbies? Write them in the order of your preferences.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  1.
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={interests?.extraCurricular?.hobbies?.[0] || ""}
                    onChange={(e) =>
                      handleInputChange("interests.extraCurricular.hobbies.0", e.target.value)
                    }
                    placeholder="Hobby"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      interests?.extraCurricular?.hobbies?.[0]
                        ? 'bg-input border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'bg-input border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                  />
                  {interests?.extraCurricular?.hobbies?.[0] && (
                    <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  3.
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={interests?.extraCurricular?.hobbies?.[2] || ""}
                    onChange={(e) =>
                      handleInputChange("interests.extraCurricular.hobbies.2", e.target.value)
                    }
                    placeholder="Hobby"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      interests?.extraCurricular?.hobbies?.[2]
                        ? 'bg-input border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'bg-input border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                  />
                  {interests?.extraCurricular?.hobbies?.[2] && (
                    <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  2.
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={interests?.extraCurricular?.hobbies?.[1] || ""}
                    onChange={(e) =>
                      handleInputChange("interests.extraCurricular.hobbies.1", e.target.value)
                    }
                    placeholder="Hobby"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      interests?.extraCurricular?.hobbies?.[1]
                        ? 'bg-input border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'bg-input border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                  />
                  {interests?.extraCurricular?.hobbies?.[1] && (
                    <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  4.
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={interests?.extraCurricular?.hobbies?.[3] || ""}
                    onChange={(e) =>
                      handleInputChange("interests.extraCurricular.hobbies.3", e.target.value)
                    }
                    placeholder="Hobby"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      interests?.extraCurricular?.hobbies?.[3]
                        ? 'bg-input border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'bg-input border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                  />
                  {interests?.extraCurricular?.hobbies?.[3] && (
                    <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Organizations Section */}
          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-4">
              Which of the following organizations have you participated in and which interest you most? (Please specify)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Checkbox
                id="athletics"
                name="athletics"
                label="Athletics"
                checked={interests?.extraCurricular?.athletics || false}
                onCheckedChange={(checked) =>
                  handleInputChange("interests.extraCurricular.athletics", checked === true)
                }
              />

              <Checkbox
                id="religiousOrganization"
                name="religiousOrganization"
                label="Religious Organization"
                checked={interests?.extraCurricular?.religiousOrganization || false}
                onCheckedChange={(checked) =>
                  handleInputChange("interests.extraCurricular.religiousOrganization", checked === true)
                }
              />

              <Checkbox
                id="gleeClub"
                name="gleeClub"
                label="Glee Club"
                checked={interests?.extraCurricular?.gleeClub || false}
                onCheckedChange={(checked) =>
                  handleInputChange("interests.extraCurricular.gleeClub", checked === true)
                }
              />

              <Checkbox
                id="dramatics"
                name="dramatics"
                label="Dramatics"
                checked={interests?.extraCurricular?.dramatics || false}
                onCheckedChange={(checked) =>
                  handleInputChange("interests.extraCurricular.dramatics", checked === true)
                }
              />

              <Checkbox
                id="chessClub"
                name="chessClub"
                label="Chess Club"
                checked={interests?.extraCurricular?.chessClub || false}
                onCheckedChange={(checked) =>
                  handleInputChange("interests.extraCurricular.chessClub", checked === true)
                }
              />

              <Checkbox
                id="scouting"
                name="scouting"
                label="Scouting"
                checked={interests?.extraCurricular?.scouting || false}
                onCheckedChange={(checked) =>
                  handleInputChange("interests.extraCurricular.scouting", checked === true)
                }
              />
            </div>

            {/* Others - Separate row */}
            <div className="flex items-center gap-3 whitespace-nowrap">
              <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                <input
                  type="checkbox"
                  checked={interests?.extraCurricular?.organizationOthersChecked || false}
                  onChange={(e) => {
                    handleInputChange("interests.extraCurricular.organizationOthersChecked", e.target.checked);
                    if (!e.target.checked) {
                      handleInputChange("interests.extraCurricular.organizationOthers", "");
                    }
                  }}
                  className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                />
                <div className="h-full w-full rounded-full border border-card-foreground bg-white transition-all duration-200 peer-checked:bg-red-600 peer-checked:border-red-600 peer-hover:border-red-600" />
                <Check className="absolute h-3 w-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm text-foreground flex-shrink-0">Others:</span>
              <input
                type="text"
                value={interests?.extraCurricular?.organizationOthers || ""}
                onChange={(e) =>
                  handleInputChange("interests.extraCurricular.organizationOthers", e.target.value)
                }
                placeholder="specify"
                className="px-3 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:border-border focus:ring-ring/20 text-sm w-32 flex-shrink-0"
                disabled={!interests?.extraCurricular?.organizationOthersChecked}
              />
            </div>
          </div>

          {/* Occupational Position */}
          <div className="mb-8">
            <p className="text-sm font-medium text-foreground mb-4">
              Occupational position in the organization:
            </p>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="occupationalPosition"
                  value="officer"
                  checked={interests?.extraCurricular?.occupationalPosition === "officer"}
                  onChange={() =>
                    handleInputChange("interests.extraCurricular.occupationalPosition", "officer")
                  }
                  className="w-4 h-4 cursor-pointer accent-red-600"
                />
                <span className="text-sm text-foreground">Officer</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="occupationalPosition"
                  value="member"
                  checked={interests?.extraCurricular?.occupationalPosition === "member"}
                  onChange={() =>
                    handleInputChange("interests.extraCurricular.occupationalPosition", "member")
                  }
                  className="w-4 h-4 cursor-pointer accent-red-600"
                />
                <span className="text-sm text-foreground">Member</span>
              </label>

              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="occupationalPosition"
                  value="others"
                  checked={interests?.extraCurricular?.occupationalPosition === "others"}
                  onChange={() =>
                    handleInputChange("interests.extraCurricular.occupationalPosition", "others")
                  }
                  className="w-4 h-4 cursor-pointer accent-red-600"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">Others, please specify</span>
                  <input
                    type="text"
                    value={interests?.extraCurricular?.occupationalOthers || ""}
                    onChange={(e) =>
                      handleInputChange("interests.extraCurricular.occupationalOthers", e.target.value)
                    }
                    placeholder="specify"
                    disabled={interests?.extraCurricular?.occupationalPosition !== "others"}
                    className={`px-3 py-1 border rounded-md focus:outline-none focus:ring-2 text-sm transition-colors ${
                      interests?.extraCurricular?.occupationalPosition === "others"
                        ? "border-border bg-input focus:border-border focus:ring-ring/20"
                        : "border-border bg-input opacity-50 text-foreground cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
