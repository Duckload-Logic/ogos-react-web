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
    const sectionErrors: FormErrors = {};

    const favSubjects = (interests?.academic?.favoriteSubjects || "").trim();
    if (!favSubjects) {
      sectionErrors["interests.academic.favoriteSubjects"] = "Favorite subjects are required";
    } else if (favSubjects.length < 2) {
      sectionErrors["interests.academic.favoriteSubjects"] = "Must be at least 2 characters";
    }

    const leastLiked = (interests?.academic?.leastLikedSubjects || "").trim();
    if (!leastLiked) {
      sectionErrors["interests.academic.leastLikedSubjects"] = "Least liked subjects are required";
    } else if (leastLiked.length < 2) {
      sectionErrors["interests.academic.leastLikedSubjects"] = "Must be at least 2 characters";
    }

    if (!(interests?.hobbies?.[0]?.hobbyName || "").trim()) {
      sectionErrors["interests.hobbies.0.hobbyName"] = "First hobby is required";
    }

    if (!(interests?.hobbies?.[1]?.hobbyName || "").trim()) {
      sectionErrors["interests.hobbies.1.hobbyName"] = "Second hobby is required";
    }

    if (!interests?.extraCurricular?.organization) {
      sectionErrors["interests.extraCurricular.organization"] = "Please select an organization";
    }

    if (!interests?.extraCurricular?.occupationalPosition) {
      sectionErrors["interests.extraCurricular.occupationalPosition"] = "Please select an occupational position";
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
        {/* A. Academic */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            A. Academic
          </h3>

          {/* Academic Clubs Checkboxes - 3 column grid */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Checkbox square
                id="mathClub"
                name="mathClub"
                label="Math Club"
                checked={interests?.academic?.mathClub || false}
                onCheckedChange={(checked) => {
                  handleInputChange("interests.academic.mathClub", checked === true);
                  if (checked === true) {
                    // if user selects a named club, deselect "Others"
                    handleInputChange("interests.academic.othersChecked", false);
                    handleInputChange("interests.academic.othersSpecify", "");
                  }
                }}
              />

              <Checkbox square
                id="scienceClub"
                name="scienceClub"
                label="Science Club"
                checked={interests?.academic?.scienceClub || false}
                onCheckedChange={(checked) => {
                  handleInputChange("interests.academic.scienceClub", checked === true);
                  if (checked === true) {
                    handleInputChange("interests.academic.othersChecked", false);
                    handleInputChange("interests.academic.othersSpecify", "");
                  }
                }}
              />

              <div className="flex items-center gap-3 whitespace-nowrap">
                <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                  <input
                    type="checkbox"
                    checked={interests?.academic?.othersChecked || false}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      handleInputChange("interests.academic.othersChecked", checked);
                      if (!checked) {
                        handleInputChange("interests.academic.othersSpecify", "");
                      } else {
                        // when Others is selected, deselect all named clubs
                        handleInputChange("interests.academic.mathClub", false);
                        handleInputChange("interests.academic.scienceClub", false);
                        handleInputChange("interests.academic.debatingClub", false);
                        handleInputChange("interests.academic.quizzersClub", false);
                      }
                    }}
                    className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="h-full w-full rounded border border-card-foreground bg-card transition-all duration-200 peer-checked:bg-red-600 peer-checked:border-red-600 peer-hover:border-red-600" />
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
                  className="px-3 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:border-border focus:ring-ring/20 text-sm w-32 flex-shrink-0 bg-card text-foreground"
                  disabled={!interests?.academic?.othersChecked}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Checkbox square
                id="debatingClub"
                name="debatingClub"
                label="Debating Club"
                checked={interests?.academic?.debatingClub || false}
                onCheckedChange={(checked) => {
                  handleInputChange("interests.academic.debatingClub", checked === true);
                  if (checked === true) {
                    handleInputChange("interests.academic.othersChecked", false);
                    handleInputChange("interests.academic.othersSpecify", "");
                  }
                }}
              />

              <Checkbox square
                id="quizzersClub"
                name="quizzersClub"
                label="Quizzer's Club"
                checked={interests?.academic?.quizzersClub || false}
                onCheckedChange={(checked) => {
                  handleInputChange("interests.academic.quizzersClub", checked === true);
                  if (checked === true) {
                    handleInputChange("interests.academic.othersChecked", false);
                    handleInputChange("interests.academic.othersSpecify", "");
                  }
                }}
              />
            </div>
          </div>

          {/* Subject Preference Text Fields */}
          <div className="space-y-4">
            <InputField
              label="What is/are your favorite subject/s?"
              required
              value={interests?.academic?.favoriteSubjects || ""}
              onChange={(val) =>
                handleInputChange("interests.academic.favoriteSubjects", val)
              }
              placeholder="Enter favorite subjects"
            />
            {errors["interests.academic.favoriteSubjects"] && (
              <p className="text-xs font-semibold text-red-600 mt-1">{errors["interests.academic.favoriteSubjects"]}</p>
            )}
            <InputField
              label="What is/are the subject/s you like least?"
              required
              value={interests?.academic?.leastLikedSubjects || ""}
              onChange={(val) =>
                handleInputChange("interests.academic.leastLikedSubjects", val)
              }
              placeholder="Enter least liked subjects"
            />
            {errors["interests.academic.leastLikedSubjects"] && (
              <p className="text-xs font-semibold text-red-600 mt-1">{errors["interests.academic.leastLikedSubjects"]}</p>
            )}
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
                    value={interests?.hobbies?.[0]?.hobbyName || ""}
                    onChange={(e) =>
                      handleInputChange("interests.hobbies.0.hobbyName", e.target.value)
                    }
                    placeholder="Hobby"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                       (!interests?.hobbies?.[0]?.hobbyName || errors["interests.hobbies.0.hobbyName"])
                        ? 'bg-card border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'bg-card border-green-500 focus:border-green-500 focus:ring-green-500/20'
                      }`}
                  />
                  {interests?.hobbies?.[0]?.hobbyName && (
                    <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
                  )}
                </div>
                {errors["interests.hobbies.0.hobbyName"] && (
                  <p className="text-xs font-semibold text-red-600 mt-1">{errors["interests.hobbies.0.hobbyName"]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  3.
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={interests?.hobbies?.[2]?.hobbyName || ""}
                    onChange={(e) =>
                      handleInputChange("interests.hobbies.2.hobbyName", e.target.value)
                    }
                    placeholder="Hobby"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                        interests?.hobbies?.[2]?.hobbyName
                          ? 'bg-card border-green-500 focus:border-green-500 focus:ring-green-500/20'
                          : 'bg-card border-border focus:border-border focus:ring-ring/20'
                    }`}
                  />
                  {interests?.hobbies?.[2]?.hobbyName && (
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
                    value={interests?.hobbies?.[1]?.hobbyName || ""}
                    onChange={(e) =>
                      handleInputChange("interests.hobbies.1.hobbyName", e.target.value)
                    }
                    placeholder="Hobby"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                       (!interests?.hobbies?.[1]?.hobbyName || errors["interests.hobbies.1.hobbyName"])
                        ? 'bg-card border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'bg-card border-green-500 focus:border-green-500 focus:ring-green-500/20'
                      }`}
                  />
                  {interests?.hobbies?.[1]?.hobbyName && (
                    <Check size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" strokeWidth={2.5} />
                  )}
                </div>
                {errors["interests.hobbies.1.hobbyName"] && (
                  <p className="text-xs font-semibold text-red-600 mt-1">{errors["interests.hobbies.1.hobbyName"]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  4.
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={interests?.hobbies?.[3]?.hobbyName || ""}
                    onChange={(e) =>
                      handleInputChange("interests.hobbies.3.hobbyName", e.target.value)
                    }
                    placeholder="Hobby"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                        interests?.hobbies?.[3]?.hobbyName
                          ? 'bg-card border-green-500 focus:border-green-500 focus:ring-green-500/20'
                          : 'bg-card border-border focus:border-border focus:ring-ring/20'
                    }`}
                  />
                  {interests?.hobbies?.[3]?.hobbyName && (
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
              {[
                { value: "athletics", label: "Athletics" },
                { value: "religiousOrganization", label: "Religious Organization" },
                { value: "gleeClub", label: "Glee Club" },
                { value: "dramatics", label: "Dramatics" },
                { value: "chessClub", label: "Chess Club" },
                { value: "scouting", label: "Scouting" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                  <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                    <input
                      type="radio"
                      name="organization"
                      value={opt.value}
                      checked={interests?.extraCurricular?.organization === opt.value}
                      onChange={() => {
                        handleInputChange("interests.extraCurricular.organization", opt.value);
                        handleInputChange("interests.extraCurricular.organizationOthers", "");
                      }}
                      className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                    <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-sm text-foreground">{opt.label}</span>
                </label>
              ))}
            </div>

            {/* Others - Separate row */}
            <div className="flex items-center gap-3 whitespace-nowrap">
              <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                <input
                  type="radio"
                  name="organization"
                  value="others"
                  checked={interests?.extraCurricular?.organization === "others"}
                  onChange={() => {
                    handleInputChange("interests.extraCurricular.organization", "others");
                    handleInputChange("interests.extraCurricular.organizationOthers", "");
                  }}
                  className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                />
                <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
              </div>
              <span className="text-sm text-foreground flex-shrink-0">Others, please specify</span>
              <input
                type="text"
                value={interests?.extraCurricular?.organizationOthers || ""}
                onChange={(e) =>
                  handleInputChange("interests.extraCurricular.organizationOthers", e.target.value)
                }
                placeholder="specify"
                className="px-3 py-1 border border-border rounded-md focus:outline-none focus:ring-2 focus:border-border focus:ring-ring/20 text-sm w-32 flex-shrink-0 bg-card text-foreground"
                disabled={interests?.extraCurricular?.organization !== "others"}
              />
            </div>
            {errors["interests.extraCurricular.organization"] && (
              <p className="text-xs font-semibold text-red-600 mt-1">{errors["interests.extraCurricular.organization"]}</p>
            )}
          </div>

          {/* Occupational Position */}
          <div className="mb-8">
            <p className="text-sm font-medium text-foreground mb-4">
              Occupational position in the organization:
            </p>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                  <input
                    type="radio"
                    name="occupationalPosition"
                    value="officer"
                    checked={interests?.extraCurricular?.occupationalPosition === "officer"}
                    onChange={() =>
                      handleInputChange("interests.extraCurricular.occupationalPosition", "officer")
                    }
                    className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                  <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className="text-sm text-foreground">Officer</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                  <input
                    type="radio"
                    name="occupationalPosition"
                    value="member"
                    checked={interests?.extraCurricular?.occupationalPosition === "member"}
                    onChange={() =>
                      handleInputChange("interests.extraCurricular.occupationalPosition", "member")
                    }
                    className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                  <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className="text-sm text-foreground">Member</span>
              </label>

              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                  <input
                    type="radio"
                    name="occupationalPosition"
                    value="others"
                    checked={interests?.extraCurricular?.occupationalPosition === "others"}
                    onChange={() =>
                      handleInputChange("interests.extraCurricular.occupationalPosition", "others")
                    }
                    className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                  <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
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
                        ? "border-border bg-card focus:border-border focus:ring-ring/20"
                        : "border-border bg-card opacity-50 text-foreground cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>
            </div>
            {errors["interests.extraCurricular.occupationalPosition"] && (
              <p className="text-xs font-semibold text-red-600 mt-1">{errors["interests.extraCurricular.occupationalPosition"]}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
