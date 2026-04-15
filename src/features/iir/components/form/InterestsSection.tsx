import { forwardRef, useImperativeHandle, useState } from "react";
import {
  Star,
  Library,
  Trophy,
  Users,
  CheckCircle2,
  Heart,
  BookOpen,
  Music,
  Palette,
  Briefcase,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { FormInput, Checkbox } from "@/components/form";
import { SectionContainer } from "./SectionContainer";
import { validateObject, validateField } from "@/services/validationSchema";
import { interestsValidationSchema } from "@/features/iir/config/interestsValidationSchema";
import { useActivityOptions } from "@/features/iir/hooks/useLookups";
import { Activity, Hobby, SubjectPreference } from "@/features/iir/types";

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
    onFieldBlur?: (fieldPath: string) => void;
    shouldShowError?: (fieldPath: string) => boolean;
  }
>(function InterestsSection({ interests, onChange, onFieldBlur, shouldShowError }, ref) {
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

    // Instant validation
    const fieldRules = interestsValidationSchema[fieldPath];
    if (fieldRules) {
      const error = validateField(value, fieldRules, { interests });
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

  // Activity Constants
  const ACADEMIC_CLUBS = ["Math Club", "Science Club", "Debating Club", "Quizzer's Club"];
  const EXTRA_CURRICULAR_ORGS = ["Athletics", "Religious Organizations", "Glee Club", "Dramatics", "Chess Club", "Scouting"];
  const ROLE_OPTIONS = ["Officer", "Member"];

  const namesMatch = (name1: string = "", name2: string = "") =>
    (name1 || "").toLowerCase().trim() === (name2 || "").toLowerCase().trim();

  const isOtherName = (name: string = "") => {
    const n = (name || "").toLowerCase().trim();
    return n === "others" || n === "other" || n.includes("others") || n.includes("other");
  };

  const categoryMatches = (optCategory: string = "", isAcademic: boolean) => {
    const cat = (optCategory || "").toLowerCase();
    if (!cat || cat === "both") return true;
    return isAcademic ? cat.includes("academic") : !cat.includes("academic");
  };

  const toggleActivity = (name: string, isAcademic: boolean, isOther: boolean = false) => {
    const currentActivities = [...(interests?.activities || [])];
    const existingIndex = currentActivities.findIndex(a => {
      const optName = a.activityOption.name;
      const optCategory = a.activityOption.category;

      if (isOther) {
        if (!isOtherName(optName)) return false;
        if (optCategory) return categoryMatches(optCategory, isAcademic);
        return !!a.activityOption.isAcademic === isAcademic;
      }
      return namesMatch(optName, name);
    });

    if (existingIndex > -1) {
      currentActivities.splice(existingIndex, 1);
    } else {
      let option = activityOptions.find((opt: any) => {
        const nameMatch = isOther ? isOtherName(opt.name) : namesMatch(opt.name, name);
        if (!nameMatch) return false;
        if (opt.category) return categoryMatches(opt.category, isAcademic);
        return true;
      });

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
      // Logic for mutual exclusivity: Officer and Member and Others cannot both be selected
      if (role === "Officer") {
        newRoles = newRoles.filter(r => !namesMatch(r, "Member") && !namesMatch(r, "Others"));
      } else if (role === "Member") {
        newRoles = newRoles.filter(r => !namesMatch(r, "Officer") && !namesMatch(r, "Others"));
      } else if (role === "Others") {
        newRoles = newRoles.filter(r => !namesMatch(r, "Officer") && !namesMatch(r, "Member"));
      }
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

  const getFieldError = (fieldPath: string): string | undefined => {
    const hasError = errors[fieldPath];
    const showError = shouldShowError ? shouldShowError(fieldPath) : true;
    return hasError && showError ? errors[fieldPath] : undefined;
  };

  return (
    <SectionContainer
      title="Interests & Activities"
      description="Tell us about your passions and involvement"
      icon={Sparkles}
    >
      <div className="space-y-12">
        {/* A. Academic Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1.5 bg-primary rounded-full" />
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">A. Academic Interests</h3>
          </div>

          <div className="bg-glass-bg/60 backdrop-blur-glass border border-glass-border/40 rounded-[24px] p-5 sm:p-8 mb-8 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <h4 className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-widest mb-6 sm:mb-8">
              <Library size={16} />
              School Clubs & Organizations
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {ACADEMIC_CLUBS.map((club, idx) => (
                <div key={club} className="flex items-center">
                  <Checkbox
                    id={`academic-club-${idx}`}
                    name="academic_clubs"
                    label={club}
                    checked={isActivityChecked(club)}
                    onCheckedChange={() => toggleActivity(club, true)}
                  />
                </div>
              ))}
              <Checkbox
                id="academic-others-check"
                name="academic_clubs"
                label="Others (Specify)"
                checked={isActivityChecked("Others", true, true)}
                onCheckedChange={() => toggleActivity("Others", true, true)}
              />
            </div>

            {isActivityChecked("Others", true, true) && (
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-glass-border/20 animate-in fade-in slide-in-from-top-4 duration-300">
                <FormInput
                  label="Please specify club name"
                  value={getOtherSpecification(true)}
                  onChange={(val: string) => updateOtherSpecification(true, val)}
                  noSpecialCharacters={true}
                  placeholder="e.g. Journalism Club"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-glass-bg/60 backdrop-blur-glass border border-glass-border/40 rounded-[24px] p-5 sm:p-6 hover:border-primary/20 transition-all duration-300 shadow-sm">
              <h4 className="flex items-center gap-2 text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-6">
                <Star size={14} className="text-primary" />
                Favorite Subjects
              </h4>
              <FormInput
                label=""
                value={getSubjects(true)}
                onChange={(val: string) => updateSubjects(true, val)}
                noSpecialCharacters={true}
                placeholder="Math, Science, etc."
                error={getFieldError("interests.academic.favoriteSubjects")}
              />
            </div>
            <div className="bg-glass-bg/60 backdrop-blur-glass border border-glass-border/40 rounded-[24px] p-5 sm:p-6 hover:border-primary/20 transition-all duration-300 shadow-sm">
              <h4 className="flex items-center gap-2 text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-6">
                <Heart size={14} className="text-primary opacity-50" />
                Least Liked Subjects
              </h4>
              <FormInput
                label=""
                value={getSubjects(false)}
                onChange={(val: string) => updateSubjects(false, val)}
                noSpecialCharacters={true}
                placeholder="History, etc."
                error={getFieldError("interests.academic.leastLikedSubjects")}
              />
            </div>
          </div>
        </section>

        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* B. Extra-Curricular Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1.5 bg-primary rounded-full" />
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">B. Extra-Curricular & Hobbies</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {/* Hobbies Card */}
            <div className="lg:col-span-1 bg-glass-bg/60 backdrop-blur-glass border border-glass-border/40 rounded-[24px] p-6 sm:p-8 overflow-hidden relative group transition-all duration-300 shadow-sm">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150" />

              <h4 className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-widest mb-2">
                <Palette size={16} />
                My Hobbies
              </h4>
              <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-8">Rank by preference</p>

              <div className="space-y-5 sm:space-y-6">
                {[1, 2, 3, 4].map((rank) => (
                  <div key={rank} className="relative group">
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 scale-0 group-focus-within:scale-100 transition-transform duration-300">
                      <ChevronRight size={16} className="text-primary" strokeWidth={3} />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`
                        flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-black
                        ${rank <= 2 ? "bg-primary text-white shadow-sm" : "bg-primary/10 text-primary"}
                      `}>
                        {rank}
                      </div>
                      <div className="w-full">
                        <FormInput
                          label=""
                          value={getHobby(rank)}
                          onChange={(val: string) => updateHobby(rank, val)}
                          noSpecialCharacters={true}
                          placeholder={`Preference #${rank}`}
                          error={rank <= 2 ? getFieldError(`interests.hobbies.${rank - 1}.hobbyName`) : undefined}
                          required={rank <= 2}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Organizations Card */}
            <div className="lg:col-span-2 bg-glass-bg/60 backdrop-blur-glass border border-glass-border/40 rounded-[24px] p-6 sm:p-8 relative overflow-hidden transition-all duration-300 shadow-sm">
              <h4 className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-widest mb-8">
                <Users size={16} />
                Organizations Participated In
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 mb-8">
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
                  label="Other Organizations"
                  checked={isActivityChecked("Others", false, true)}
                  onCheckedChange={() => toggleActivity("Others", false, true)}
                />
              </div>

              {isActivityChecked("Others", false, true) && (
                <div className="mt-8 pt-8 border-t border-white/10 animate-in fade-in slide-in-from-top-4 duration-300">
                  <FormInput
                    label="Please specify details"
                    value={getOtherSpecification(false)}
                    onChange={(val: string) => updateOtherSpecification(false, val)}
                    placeholder="e.g. Community Volunteers"
                  />
                </div>
              )}

              {/* Roles Section Sub-Card */}
              <div className="mt-8 sm:mt-10 p-5 sm:p-8 rounded-[20px] bg-primary/5 border border-primary/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Briefcase size={64} className="text-primary" />
                </div>
                <h5 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-6 sm:mb-8">
                  Occupational Role/Position:
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-6 items-start">
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
                  <div className="col-span-2 space-y-4">
                    <Checkbox
                      id="role-others-check"
                      name="occupational_role"
                      label="Others (Specify)"
                      checked={isRoleChecked("Others")}
                      onCheckedChange={() => toggleRole("Others")}
                    />
                    {isRoleChecked("Others") && (
                      <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <FormInput
                          label=""
                          value={interests?._tempRoleSpecification || ""}
                          onChange={(val: string) => handleInputChange("interests._tempRoleSpecification", val)}
                          onBlur={() => {
                            const currentActivities = (interests?.activities || []).map((a: Activity) => ({
                              ...a,
                              roleSpecification: interests?._tempRoleSpecification
                            }));
                            handleInputChange("interests.activities", currentActivities);
                          }}
                          placeholder="Specify your role"
                        />
                      </div>
                    )}
                  </div>
                </div>
                {getFieldError("interests.activities") && (
                  <p className="mt-6 text-xs font-bold text-primary flex items-center gap-2">
                    <CheckCircle2 size={12} />
                    Select organization & role to complete
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </SectionContainer>
  );
});

