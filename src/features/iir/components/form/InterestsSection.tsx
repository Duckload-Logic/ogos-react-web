import { forwardRef, useImperativeHandle, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { InputField, Checkbox } from "@/components/form";
import { validateObject } from "@/services/validationSchema";
import { interestsValidationSchema } from "@/features/iir/config/interestsValidationSchema";
import { useActivityOptions } from "@/features/iir/hooks/useLookups";
import { Activity, Hobby, SubjectPreference } from "@/features/iir/types/IIRForm";

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
  const { data: activityOptions = [] } = useActivityOptions();

  const validate = (): { isValid: boolean; errors: FormErrors } => {
    const sectionErrors = validateObject({ interests }, interestsValidationSchema);
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

  // Activity Constants updated for casing
  const ACADEMIC_CLUBS = ["Math Club", "Science Club", "Debating Club", "Quizzer's Club"];
  const EXTRA_CURRICULAR_ORGS = ["Athletics", "Religious Organizations", "Glee Club", "Dramatics", "Chess Club", "Scouting"];
  const ROLE_OPTIONS = ["Officer", "Member"];

  // Helper for case-insensitive and flexible name matching
  const namesMatch = (name1: string = "", name2: string = "") =>
    (name1 || "").toLowerCase().trim() === (name2 || "").toLowerCase().trim();

  const isOtherName = (name: string = "") => {
    const n = (name || "").toLowerCase().trim();
    return n === "others" || n === "other" || n.includes("others") || n.includes("other");
  };

  const categoryMatches = (optCategory: string = "", isAcademic: boolean) => {
    const cat = (optCategory || "").toLowerCase();
    if (!cat || cat === "both") return true; // Flexible fallback or "both"
    return isAcademic ? cat.includes("academic") : !cat.includes("academic");
  };

  // Activity Handlers
  const toggleActivity = (name: string, isAcademic: boolean, isOther: boolean = false) => {
    const currentActivities = [...(interests?.activities || [])];

    // Check if the activity is already selected (Academic matching logic depends on isAcademic flag)
    const existingIndex = currentActivities.findIndex(a => {
      const optName = a.activityOption.name;
      const optCategory = a.activityOption.category;

      if (isOther) {
        if (!isOtherName(optName)) return false;
        // If categories are present in both, they must match
        if (optCategory) return categoryMatches(optCategory, isAcademic);
        // Fallback to our internal flag for consistency
        return !!a.activityOption.isAcademic === isAcademic;
      }
      return namesMatch(optName, name);
    });

    if (existingIndex > -1) {
      currentActivities.splice(existingIndex, 1);
    } else {
      // Find the option in the lookup data more flexibly
      // First try to find by name AND category (best match)
      let option = activityOptions.find((opt: any) => {
        const nameMatch = isOther ? isOtherName(opt.name) : namesMatch(opt.name, name);
        if (!nameMatch) return false;
        if (opt.category) return categoryMatches(opt.category, isAcademic);
        return true;
      });

      // Fallback: Just find by name if category wasn't specific enough
      if (!option) {
        option = activityOptions.find((opt: any) =>
          isOther ? isOtherName(opt.name) : namesMatch(opt.name, name)
        );
      }

      if (option) {
        currentActivities.push({
          activityOption: { ...option, isAcademic },
          otherSpecification: "",
          role: interests?._tempRole || "",
          roleSpecification: (interests?._tempRole || "").includes("Others")
            ? (interests?._tempRoleSpecification || "")
            : "",
        });
      }
    }
    handleInputChange("interests.activities", currentActivities);
  };

  const isActivityChecked = (name: string, isAcademic?: boolean, isOther: boolean = false) => {
    return !!(interests?.activities || []).some((a: Activity) => {
      const optName = a.activityOption.name;
      const optCategory = a.activityOption.category;

      if (isOther) {
        if (!isOtherName(optName)) return false;
        if (optCategory) return categoryMatches(optCategory, isAcademic || false);
        return !!a.activityOption.isAcademic === isAcademic;
      }
      return namesMatch(optName, name);
    });
  };

  const getOtherSpecification = (isAcademic: boolean) => {
    return (interests?.activities || []).find((a: Activity) => {
      const optName = a.activityOption.name;
      const optCategory = a.activityOption.category;
      if (!isOtherName(optName)) return false;
      if (optCategory) return categoryMatches(optCategory, isAcademic);
      return !!a.activityOption.isAcademic === isAcademic;
    })?.otherSpecification || "";
  };

  const updateOtherSpecification = (isAcademic: boolean, value: string) => {
    const currentActivities = [...(interests?.activities || [])];
    const index = currentActivities.findIndex(a => {
      const optName = a.activityOption.name;
      const optCategory = a.activityOption.category;
      if (!isOtherName(optName)) return false;
      if (optCategory) return categoryMatches(optCategory, isAcademic);
      return !!a.activityOption.isAcademic === isAcademic;
    });
    if (index > -1) {
      currentActivities[index] = { ...currentActivities[index], otherSpecification: value };
      handleInputChange("interests.activities", currentActivities);
    }
  };

  const toggleRole = (role: string) => {
    const currentRoles = (interests?._tempRole || "").split(", ").filter(Boolean);
    const index = currentRoles.findIndex((r: string) => namesMatch(r, role));
    let newRoles = [...currentRoles];

    if (index > -1) {
      newRoles.splice(index, 1);
    } else {
      newRoles.push(role);
    }

    const roleStr = newRoles.join(", ");
    handleInputChange("interests._tempRole", roleStr);

    const currentActivities = (interests?.activities || []).map((a: Activity) => ({
      ...a,
      role: roleStr
    }));
    handleInputChange("interests.activities", currentActivities);
  };

  const isRoleChecked = (role: string) => {
    return (interests?._tempRole || "").split(", ").some((r: string) => namesMatch(r, role));
  };

  const getHobby = (rank: number) =>
    interests?.hobbies?.find((h: Hobby) => h.priorityRank === rank)?.hobbyName || "";

  const updateHobby = (rank: number, name: string) => {
    const currentHobbies = [...(interests?.hobbies || [])];
    const index = currentHobbies.findIndex((h: Hobby) => h.priorityRank === rank);

    if (index > -1) {
      if (!name) {
        currentHobbies.splice(index, 1);
      } else {
        currentHobbies[index] = { ...currentHobbies[index], hobbyName: name, priorityRank: rank };
      }
    } else if (name) {
      currentHobbies.push({ hobbyName: name, priorityRank: rank });
    }

    handleInputChange("interests.hobbies", currentHobbies);
  };

  const getSubjects = (isFavorite: boolean) =>
    interests?.subjectPreferences
      ?.filter((s: SubjectPreference) => s.isFavorite === isFavorite)
      ?.map((s: SubjectPreference) => s.subjectName)
      ?.join(", ") || "";

  const updateSubjects = (isFavorite: boolean, subjectsStr: string) => {
    const otherPreferences = (interests?.subjectPreferences || [])
      .filter((s: SubjectPreference) => s.isFavorite !== isFavorite);

    const newPreferences = subjectsStr.split(",")
      .map(s => s.trim())
      .filter(s => s !== "")
      .map(s => ({ subjectName: s, isFavorite }));

    handleInputChange("interests.subjectPreferences", [...otherPreferences, ...newPreferences]);
  };

  return (
    <Card className="bg-card border border-border">
      <CardContent className="pt-6">
        <div className="space-y-12">
          {/* A. Academic Section */}
          <section>
            <div className="space-y-8">
              <div>
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
                  A. Academic (School Clubs / Organizations)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  {ACADEMIC_CLUBS.map((club, idx) => (
                    <Checkbox
                      key={club}
                      id={`academic-club-${idx}`}
                      name="academic_clubs"
                      label={club}
                      checked={isActivityChecked(club)}
                      onCheckedChange={() => toggleActivity(club, true)}
                    />
                  ))}
                  <Checkbox
                    id="academic-others-check"
                    name="academic_clubs"
                    label="Others, please specify"
                    checked={isActivityChecked("Others", true, true)}
                    onCheckedChange={() => toggleActivity("Others", true, true)}
                  />
                </div>
                {isActivityChecked("Others", true, true) && (
                  <div className="max-w-md animate-in fade-in slide-in-from-top-2 duration-200 mt-4 px-4 border-l-2 border-red-500/20">
                    <InputField
                      label="Please specify:"
                      name="academic_others_input"
                      value={getOtherSpecification(true)}
                      onChange={(val) => updateOtherSpecification(true, val)}
                      placeholder="e.g. Journalism Club"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/40">
                <InputField
                  label="What is/are your favorite subject/s?"
                  name="favoriteSubjects"
                  value={getSubjects(true)}
                  onChange={(val) => updateSubjects(true, val)}
                  placeholder="e.g. Mathematics, Science"
                  error={errors["interests.academic.favoriteSubjects"]}
                />

                <InputField
                  label="What is/are the subject/s you like least?"
                  name="leastLikedSubjects"
                  value={getSubjects(false)}
                  onChange={(val) => updateSubjects(false, val)}
                  placeholder="e.g. History, Physical Education"
                  error={errors["interests.academic.leastLikedSubjects"]}
                />
              </div>
            </div>
          </section>

          {/* B. Extra-Curricular Section */}
          <section className="pt-8 border-t border-border/60">
            <div className="space-y-10">
              <div>
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                  B. Extra-Curricular (Hobbies)
                </h4>
                <p className="text-sm text-muted-foreground mb-6 italic">
                  What are your hobbies? Write them in the order of your preferences.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                  {[1, 2, 3, 4].map((rank) => (
                    <InputField
                      key={rank}
                      name={`hobby-${rank}`}
                      label={`${rank}. ${rank <= 2 ? "(Required)" : ""}`}
                      value={getHobby(rank)}
                      onChange={(val) => updateHobby(rank, val)}
                      placeholder={`Hobby #${rank}`}
                      error={rank <= 2 ? errors[`interests.hobbies.${rank - 1}.hobbyName`] : undefined}
                      required={rank <= 2}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-10 border-t border-border/40 relative">
                {errors["interests.activities"] && (
                  <p className="absolute top-4 right-0 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">{errors["interests.activities"]}</p>
                )}
                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider opacity-80 mb-6 font-medium">
                  Which organizations have you participated in?
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {EXTRA_CURRICULAR_ORGS.map((org, idx) => (
                    <Checkbox
                      key={org}
                      id={`extra-org-${idx}`}
                      name="extra_orgs"
                      label={org}
                      checked={isActivityChecked(org)}
                      onCheckedChange={() => toggleActivity(org, false)}
                    />
                  ))}
                  <Checkbox
                    id="extra-others-check"
                    name="extra_orgs"
                    label="Others, please specify"
                    checked={isActivityChecked("Others", false, true)}
                    onCheckedChange={() => toggleActivity("Others", false, true)}
                  />
                </div>

                {isActivityChecked("Others", false, true) && (
                  <div className="max-w-md mb-10 animate-in fade-in slide-in-from-top-2 duration-200 px-4 border-l-2 border-red-500/20">
                    <InputField
                      label="Please specify:"
                      name="org_others_input"
                      value={getOtherSpecification(false)}
                      onChange={(val) => updateOtherSpecification(false, val)}
                      placeholder="e.g. Red Cross Youth"
                    />
                  </div>
                )}

                <div className="mt-12 p-8 rounded-2xl border border-border bg-muted/5">
                  <h5 className="text-xs font-bold text-foreground uppercase tracking-widest opacity-60 mb-8">
                    Occupational position in the organization:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {ROLE_OPTIONS.map((role, idx) => (
                      <Checkbox
                        key={role}
                        id={`role-${idx}`}
                        name="occupational_role"
                        label={role}
                        checked={isRoleChecked(role)}
                        onCheckedChange={() => toggleRole(role)}
                      />
                    ))}

                    <div className="md:col-span-1 lg:col-span-2 space-y-6">
                      <Checkbox
                        id="role-others-check"
                        name="occupational_role"
                        label="Others, please specify"
                        checked={isRoleChecked("Others")}
                        onCheckedChange={() => toggleRole("Others")}
                      />
                      {isRoleChecked("Others") && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-200 mt-2">
                          <InputField
                            label=""
                            name="role_others_input"
                            value={interests?._tempRoleSpecification || ""}
                            onChange={(val) => handleInputChange("interests._tempRoleSpecification", val)}
                            onBlur={() => {
                              const currentActivities = (interests?.activities || []).map((a: Activity) => ({
                                ...a,
                                roleSpecification: interests?._tempRoleSpecification
                              }));
                              handleInputChange("interests.activities", currentActivities);
                            }}
                            placeholder="Specify role"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </CardContent>
    </Card>
  );
});
