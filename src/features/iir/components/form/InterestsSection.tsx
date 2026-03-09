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

          {/* Academic Clubs - Radio buttons (single selection) */}
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {[
                { value: "mathClub", label: "Math Club" },
                { value: "scienceClub", label: "Science Club" },
                { value: "debatingClub", label: "Debating Club" },
                { value: "quizzersClub", label: "Quizzer's Club" },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
                  <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                    <input
                      type="radio"
                      name="academicClub"
                      value={opt.value}
                      checked={interests?.academic?.academicClub === opt.value}
                      onChange={() => {
                        handleInputChange("interests.academic.academicClub", opt.value);
                        handleInputChange("interests.academic.othersSpecify", "");
                      }}
                      className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                    <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <span className="text-sm text-foreground">{opt.label}</span>
                </label>
              ))}

              <div className="flex items-center gap-3 whitespace-nowrap">
                <div className="relative flex items-center justify-center h-4 w-4 shrink-0">
                  <input
                    type="radio"
                    name="academicClub"
                    value="others"
                    checked={interests?.academic?.academicClub === "others"}
                    onChange={() => {
                      handleInputChange("interests.academic.academicClub", "others");
                      handleInputChange("interests.academic.othersSpecify", "");
                    }}
                    className="peer absolute h-full w-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="h-full w-full rounded-full border border-card-foreground bg-card transition-all duration-200 peer-checked:border-red-600" />
                  <div className="absolute h-2 w-2 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
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
                  disabled={interests?.academic?.academicClub !== "others"}
                />
              </div>
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
                    value={interests?.hobbies?.[0]?.hobbyName || ""}
                    onChange={(e) =>
                      handleInputChange("interests.hobbies.0.hobbyName", e.target.value)
                    }
                    placeholder="Hobby"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      interests?.hobbies?.[0]?.hobbyName
                        ? 'bg-card border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'bg-card border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                  />
                  {interests?.hobbies?.[0]?.hobbyName && (
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
                    value={interests?.hobbies?.[2]?.hobbyName || ""}
                    onChange={(e) =>
                      handleInputChange("interests.hobbies.2.hobbyName", e.target.value)
                    }
                    placeholder="Hobby"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      interests?.hobbies?.[2]?.hobbyName
                        ? 'bg-card border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'bg-card border-red-500 focus:border-red-500 focus:ring-red-500/20'
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
                      interests?.hobbies?.[1]?.hobbyName
                        ? 'bg-card border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'bg-card border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                  />
                  {interests?.hobbies?.[1]?.hobbyName && (
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
                    value={interests?.hobbies?.[3]?.hobbyName || ""}
                    onChange={(e) =>
                      handleInputChange("interests.hobbies.3.hobbyName", e.target.value)
                    }
                    placeholder="Hobby"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 ${
                      interests?.hobbies?.[3]?.hobbyName
                        ? 'bg-card border-green-500 focus:border-green-500 focus:ring-green-500/20'
                        : 'bg-card border-red-500 focus:border-red-500 focus:ring-red-500/20'
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
