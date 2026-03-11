import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import { useMe } from "@/features/users/hooks/useMe";
import {
  useIIRForm,
  useIIRFormSave,
  useSaveIIRDraft,
  useGetIIRDraft,
} from "@/features/iir/hooks";
import { IIRForm as IIRFormType } from "@/features/iir/types/IIRForm";
import { EMPTY_IIR_FORM } from "@/features/iir/constants";
import { validateObject } from "@/services/validationSchema";
import { personalInformationValidationSchema } from "@/features/iir/config/personalInfoValidationSchema";
import { LoadingSpinner } from "@/components/shared";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeroSection } from "@/components/ui/hero-section";
import { AnimationStyles } from "@/components/ui/animations";
import Toast from "@/components/ui/Toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  AlertCircle,
  Save,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import {
  PersonalInformationSection,
  EducationBackgroundSection,
  FamilyBackgroundSection,
  HealthInformationSection,
  InterestsSection,
  TestResultsSection,
  SectionContainer,
} from "@/features/iir/components/form";

const FORM_SECTIONS = [
  { title: "I. Personal Information", id: 1, key: "personal" },
  { title: "II. Educational Background", id: 2, key: "education" },
  { title: "III. Home and Family Background", id: 3, key: "family" },
  { title: "IV. Health Information", id: 4, key: "health" },
  { title: "V. Interests and Hobbies", id: 5, key: "interests" },
];

export default function IIRForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: me } = useMe();
  const userId = me?.id;

  const { saveDraft, isSavingDraft, saveDraftError } = useSaveIIRDraft();
  const { draft, isLoadingDraft, draftError } = useGetIIRDraft();

  const { saveSectionAsync, submitFormAsync, isSubmitting } = useIIRFormSave();

  const hasInitialized = useRef(false);
  const personalSectionRef = useRef<any>(null);
  const educationSectionRef = useRef<any>(null);
  const familySectionRef = useRef<any>(null);
  const healthSectionRef = useRef<any>(null);
  const interestsSectionRef = useRef<any>(null);
  const testResultsSectionRef = useRef<any>(null);

  const [currentSection, setCurrentSection] = useState(1);
  const [localFormData, setLocalFormData] = useState<IIRFormType | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [validationErrorList, setValidationErrorList] = useState<string[]>([]);
  const [showValidationError, setShowValidationError] = useState(false);
  const [sectionsWithErrors, setSectionsWithErrors] = useState<number[]>([]);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");
  const [isMobileNav, setIsMobileNav] = useState(window.innerWidth < 1024);
  const [lastSaved, setLastSaved] = useState<string>("");
  const [toasts, setToasts] = useState<string[]>([]);

  useEffect(() => {
    const initializeFormData = () => {
      if (isLoadingDraft || !me || hasInitialized.current) return;

      const baseData = draft || EMPTY_IIR_FORM;

      const initializedData = {
        ...baseData,
        student: {
          ...baseData.student,
          basicInfo: {
            ...baseData.student?.basicInfo,
            firstName: me?.firstName || "",
            middleName:
              me?.middleName && typeof me?.middleName === "string"
                ? me?.middleName
                : "",
            lastName: me?.lastName || "",
            email: me?.email || "",
          },
          personalInfo: {
            ...baseData.student?.personalInfo,
          },
          addresses: baseData.student?.addresses || {},
        },
        education: baseData.education || { schools: [] },
        family: baseData.family || {
          background: {},
          relatedPersons: {},
          finance: {},
        },
        health: baseData.health || { healthRecord: {}, consultations: [] },
        interests: baseData.interests || {},
        testResults: baseData.testResults || [],
      };
      setLocalFormData(initializedData);
      setIsInitializing(false);
      hasInitialized.current = true;
    };

    initializeFormData();
  }, [isLoadingDraft, me]);

  useEffect(() => {
    if (isInitializing || !localFormData) return;

    const saveTimer = setTimeout(() => {
      if (
        Object.keys(localFormData || {}).length > 0 &&
        JSON.stringify(localFormData) !== JSON.stringify(draft)
      ) {
        autoSave();
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [localFormData, currentSection, draft]);

  // Handle window resize for responsive navigation
  useEffect(() => {
    const handleResize = () => {
      setIsMobileNav(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const autoSave = async () => {
    if (!localFormData) return;

    setAutoSaveStatus("saving");
    try {
      await saveDraft(localFormData);
      console.debug("Auto-saved draft data:", localFormData);
      setAutoSaveStatus("saved");
      const now = new Date();
      setLastSaved(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
      setTimeout(() => setAutoSaveStatus("idle"), 2000);
    } catch (err) {
      setAutoSaveStatus("idle");
    }
  };

  const addToast = (message: string, duration: number = 3000) => {
    const id = Math.random();
    setToasts((prev) => [...prev, message]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((_, i) => i !== prev.length - 1));
    }, duration);
  };

  if (isInitializing) return <LoadingSpinner />;

  if (draftError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {draftError?.message || "Error loading draft data"}
        </AlertDescription>
      </Alert>
    );
  }

  const updateNestedField = (path: string[], value: any) => {
    setLocalFormData((prev) => {
      if (!prev) return prev;
      let current = prev as any;
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        const nextKey = path[i + 1];
        
        // Check if next key is a numeric string (array index)
        if (!isNaN(Number(nextKey))) {
          // Keep arrays as arrays
          current[key] = Array.isArray(current[key]) ? [...current[key]] : current[key];
        } else {
          // Next key is a string property — always spread as object
          // Using [...array] would lose non-numeric string properties (e.g. relatedPersons.father)
          current[key] = { ...current[key] };
        }
        current = current[key];
      }
      current[path[path.length - 1]] = value;
      return { ...prev };
    });
  };

  const handleInputChange = (fieldPath: string, value: any) => {
    const path = fieldPath.split(".");
    updateNestedField(path, value);
  };

  const handleNextSection = async () => {
    // Validate current section using its ref
    let sectionRef: any = null;
    let errorMessages: string[] = [];

    switch (currentSection) {
      case 1:
        sectionRef = personalSectionRef;
        break;
      case 2:
        sectionRef = educationSectionRef;
        break;
      case 3:
        sectionRef = familySectionRef;
        break;
      case 4:
        sectionRef = healthSectionRef;
        break;
      case 5:
        sectionRef = interestsSectionRef;
        break;
      case 6:
        sectionRef = testResultsSectionRef;
        break;
    }

    if (sectionRef?.current?.validate) {
      const validation = sectionRef.current.validate();
      if (!validation.isValid) {
        setValidationErrorList(Object.values(validation.errors));
        setShowValidationError(true);
        return;
      }
    }

    setIsSaving(true);
    try {
      if (localFormData?.id) {
        await saveSectionAsync({
          iirID: localFormData.id,
          data: localFormData,
          section: FORM_SECTIONS[currentSection - 1]?.key,
        });
      }
      if (currentSection < FORM_SECTIONS.length) {
        setCurrentSection(currentSection + 1);
      }
    } catch (err: any) {
      console.error("Error saving section:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    // Always trigger validate() on the current section so inline field errors show
    const currentSectionRefs: Record<number, any> = {
      1: personalSectionRef,
      2: educationSectionRef,
      3: familySectionRef,
      4: healthSectionRef,
      5: interestsSectionRef,
    };
    currentSectionRefs[currentSection]?.current?.validate?.();

    // First check: Use completion percentage as source of truth
    // All sections must be 100% complete
    const incompleteCompletionSections: number[] = [];
    const incompleteCompletionMessages: string[] = [];
    
    for (let i = 1; i <= FORM_SECTIONS.length; i++) {
      const completion = calculateSectionCompletion(i);
      if (completion < 100) {
        incompleteCompletionSections.push(i);
        incompleteCompletionMessages.push(
          `${FORM_SECTIONS[i - 1].title} — ${completion}% complete (required 100%)`
        );
      }
    }
    
    // If any section is not 100% complete, block submission
    if (incompleteCompletionSections.length > 0) {
      setSectionsWithErrors(incompleteCompletionSections);
      setValidationErrorList(incompleteCompletionMessages);
      setShowValidationError(true);
      addToast("Please complete all sections before submitting.");
      
      // Only navigate away if current section is not already the failing one
      if (!incompleteCompletionSections.includes(currentSection)) {
        setCurrentSection(incompleteCompletionSections[0]);
      }
      return;
    }

    // Second check: Validate all sections using their refs
    const errorMessages: string[] = [];
    const sectionsWithValidationErrors: number[] = [];
    let hasErrors = false;

    // Validate Personal Information (Section 1)
    if (personalSectionRef?.current?.validate) {
      const validation = personalSectionRef.current.validate();
      if (!validation.isValid) {
        hasErrors = true;
        sectionsWithValidationErrors.push(1);
        errorMessages.push("I. Personal Information — missing required fields");
      }
    }

    // Validate Education (Section 2)
    if (educationSectionRef?.current?.validate) {
      const validation = educationSectionRef.current.validate();
      if (!validation.isValid) {
        hasErrors = true;
        sectionsWithValidationErrors.push(2);
        errorMessages.push("II. Educational Background — missing required fields");
      }
    }

    // Validate Family (Section 3)
    if (familySectionRef?.current?.validate) {
      const validation = familySectionRef.current.validate();
      if (!validation.isValid) {
        hasErrors = true;
        sectionsWithValidationErrors.push(3);
        errorMessages.push("III. Family Background — missing required fields");
      }
    }

    // Validate Health (Section 4)
    if (healthSectionRef?.current?.validate) {
      const validation = healthSectionRef.current.validate();
      if (!validation.isValid) {
        hasErrors = true;
        sectionsWithValidationErrors.push(4);
        errorMessages.push("IV. Health Information — missing required fields");
      }
    }

    // Validate Interests (Section 5)
    if (interestsSectionRef?.current?.validate) {
      const validation = interestsSectionRef.current.validate();
      if (!validation.isValid) {
        hasErrors = true;
        sectionsWithValidationErrors.push(5);
        errorMessages.push("V. Interests and Hobbies — missing required fields");
      }
    }

    // Validate Test Results (Section 6)
    if (testResultsSectionRef?.current?.validate) {
      const validation = testResultsSectionRef.current.validate();
      if (!validation.isValid) {
        hasErrors = true;
        sectionsWithValidationErrors.push(6);
        errorMessages.push("VI. Test Results — missing required fields");
      }
    }

    if (hasErrors) {
      setSectionsWithErrors(sectionsWithValidationErrors);
      setValidationErrorList(errorMessages);
      setShowValidationError(true);
      addToast("Please fix errors before submitting.");
      
      // Only navigate away if current section has no errors
      if (!sectionsWithValidationErrors.includes(currentSection)) {
        setCurrentSection(sectionsWithValidationErrors[0]);
      }
      return;
    }

    // All validations passed, clear section errors and open confirmation dialog
    setSectionsWithErrors([]);
    setConsentAgreed(false);
    setShowSubmitConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowSubmitConfirm(false);
    setIsSaving(true);

    try {
      if (localFormData?.id) {
        await submitFormAsync(localFormData.id);
      }
      addToast("✓ Form submitted successfully!");
      setShowSuccessPopup(true);
      setTimeout(() => {
        navigate("/student");
      }, 3000);
    } catch (err: any) {
      addToast("Failed to submit form. Please try again.");
      console.error("Error submitting form:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmReset = () => {
    // preserve autofilled basicInfo
    const resetData = {
      ...EMPTY_IIR_FORM,
      student: {
        ...EMPTY_IIR_FORM.student,
        basicInfo: {
          firstName: me?.firstName || "",
          middleName: me?.middleName && typeof me?.middleName === "string" ? me?.middleName : "",
          lastName: me?.lastName || "",
          email: me?.email || "",
        },
      },
    };
    setLocalFormData(resetData);
    setShowResetConfirm(false);
    addToast("Form reset.");
  };

  // Calculate section completion percentage
  const calculateSectionCompletion = (sectionIndex: number): number => {
    // Only count these specific leaf fields, not nested object structures
    const countFilledField = (val: any): boolean => {
      if (val === null || val === undefined || val === "") return false;
      if (typeof val === "object") {
        if (Array.isArray(val)) return val.length > 0;
        // For objects, check if they have an id (indicating it's been selected)
        return val?.id !== undefined && val?.id !== null && val?.id !== "";
      }
      return true;
    };

    let filledCount = 0;
    let totalCount = 0;

    switch (sectionIndex) {
      case 1: { // Personal Information
        // Drive completion from the same schema used for validation
        const schemaFields = Object.keys(personalInformationValidationSchema);
        const schemaErrors = validateObject({ student: localFormData?.student }, personalInformationValidationSchema);
        totalCount = schemaFields.length;
        filledCount = schemaFields.length - Object.keys(schemaErrors).length;
        // If employed, include employer fields in completion
        const isEmployed = (localFormData as any)?.student?.personalInfo?.isEmployed;
        if (isEmployed) {
          totalCount += 3; // employerName, employerAddress, employerContact
          if ((localFormData as any)?.student?.personalInfo?.employerName) filledCount++;
          if ((localFormData as any)?.student?.personalInfo?.employerAddress) filledCount++;
          if ((localFormData as any)?.student?.personalInfo?.employerContact) filledCount++;
        }
        break;
      }

      case 2: { // Education
        // Nature of schooling
        totalCount++;
        if (localFormData?.education?.natureOfSchooling) filledCount++;

        // Mirror the requiredFields from EducationBackgroundSection.getCompletionLevel
        // There are 5 school levels displayed (indices 0-4); count all of them
        const schoolFields = ["schoolName", "schoolAddress", "schoolType", "yearStarted", "yearCompleted"];
        const schools = localFormData?.education?.schools ?? [];
        const SCHOOL_LEVEL_COUNT = 5;
        for (let i = 0; i < SCHOOL_LEVEL_COUNT; i++) {
          schoolFields.forEach((field) => {
            totalCount++;
            if (countFilledField((schools[i] as any)?.[field])) filledCount++;
          });
        }
        break;
      }

      case 3: { // Family Background
        const bg = localFormData?.family?.background as any;
        const finance = localFormData?.family?.finance as any;
        const relatedPersons = localFormData?.family?.relatedPersons as any;

        // Parental status
        const familyBgFields = ["parentalStatus", "numberOfChildren", "brothers", "sisters"];
        familyBgFields.forEach((field) => {
          totalCount++;
          if (bg?.[field] !== undefined && bg?.[field] !== null && bg?.[field] !== "") filledCount++;
        });

        // natureOfResidence is an object of booleans — check at least one is true
        totalCount++;
        const residence = bg?.natureOfResidence;
        if (residence && Object.values(residence).some((v) => v === true)) filledCount++;

        // Finance fields
        totalCount++;
        if (finance?.monthlyFamilyIncomeRange?.id) filledCount++;
        totalCount++;
        if (finance?.weeklyAllowance && finance.weeklyAllowance !== "0" && finance.weeklyAllowance !== 0) filledCount++;

        // Track father and mother name fields individually
        const personFields = ["name", "age", "educationalAttainment", "occupation"];
        ["father", "mother"].forEach((person) => {
          personFields.forEach((field) => {
            totalCount++;
            if (countFilledField(relatedPersons?.[person]?.[field])) filledCount++;
          });
        });
        break;
      }

      case 4: { // Health Information
        const hr = localFormData?.health?.healthRecord as any;

        // Physical items: yes/no answer required; if yes, details field also required
        const physicalItems = [
          { bool: "visionHasProblem", detail: "visionDetails" },
          { bool: "hearingHasProblem", detail: "hearingDetails" },
          { bool: "speechHasProblem", detail: "speechDetails" },
          { bool: "generalHealthHasProblem", detail: "generalHealthDetails" },
        ];
        physicalItems.forEach(({ bool, detail }) => {
          totalCount++;
          if (hr?.[bool] !== undefined) {
            filledCount++;
            if (hr[bool] === true) {
              // YES selected — require the details field too
              totalCount++;
              if (countFilledField(hr?.[detail])) filledCount++;
            }
          }
        });

        // Consultations: yes/no required per type; if yes, whenDate + forWhat also required
        const consultations = localFormData?.health?.consultations ?? [];
        const consultationTypes = ["Psychiatrist", "Psychologist", "Counselor"];
        consultationTypes.forEach((type) => {
          totalCount++;
          const record = Array.isArray(consultations)
            ? consultations.find((c: any) => c?.professionalType === type)
            : null;
          if (record?.hasConsulted !== undefined) {
            filledCount++;
            if (record.hasConsulted === true) {
              // YES selected — require whenDate and forWhat too
              totalCount += 2;
              if (countFilledField(record?.whenDate)) filledCount++;
              if (countFilledField(record?.forWhat)) filledCount++;
            }
          }
        });
        break;
      }

      case 5: { // Interests and Hobbies
        const interests = localFormData?.interests as any;

        // Favorite and least liked subjects
        totalCount++;
        if (interests?.academic?.favoriteSubjects) filledCount++;
        totalCount++;
        if (interests?.academic?.leastLikedSubjects) filledCount++;

        // At least one hobby filled (check first two)
        totalCount++;
        if (interests?.hobbies?.[0]?.hobbyName || interests?.hobbies?.["0"]?.hobbyName) filledCount++;
        totalCount++;
        if (interests?.hobbies?.[1]?.hobbyName || interests?.hobbies?.["1"]?.hobbyName) filledCount++;

        // At least one academic club checked (if 'Others' is selected, require specify to count)
        totalCount++;
        const hasAcademic =
          interests?.academic?.mathClub ||
          interests?.academic?.scienceClub ||
          interests?.academic?.debatingClub ||
          interests?.academic?.quizzersClub ||
          (interests?.academic?.othersChecked && countFilledField(interests?.academic?.othersSpecify));
        if (hasAcademic) filledCount++;

        // Organization (single radio selection)
        totalCount++;
        const org = interests?.extraCurricular?.organization;
        if (org) {
          filledCount++;
          if (org === "others") {
            totalCount++;
            if (countFilledField(interests?.extraCurricular?.organizationOthers)) filledCount++;
          }
        }

        // Occupational position in organization
        totalCount++;
        const occPos = interests?.extraCurricular?.occupationalPosition;
        if (occPos) {
          filledCount++;
          if (occPos === "others") {
            totalCount++;
            if (countFilledField(interests?.extraCurricular?.occupationalOthers)) filledCount++;
          }
        }
        break;
      }

      case 6: { // Test Results - count each individual field across 3 rows (5 fields each = 15 total)
        const rows = Array.from({ length: 3 }, (_, i) => (localFormData?.testResults || [])[i] || {});
        totalCount = 15;
        filledCount = rows.reduce((acc: number, r: any) => {
          if (r?.date || r?.testDate) acc++;
          if (r?.nameOfTest || r?.testName) acc++;
          if (r?.rs !== undefined && r?.rs !== "" && r?.rs !== null) acc++;
          if (r?.pr !== undefined && r?.pr !== "" && r?.pr !== null) acc++;
          if (r?.description) acc++;
          return acc;
        }, 0);
        break;
      }
    }

    return totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0;
  };

  const getOverallCompletion = (): number => {
    let totalPercentage = 0;
    for (let i = 1; i <= FORM_SECTIONS.length; i++) {
      totalPercentage += calculateSectionCompletion(i);
    }
    return Math.round(totalPercentage / FORM_SECTIONS.length);
  };

  const getSectionStatus = (sectionIndex: number) => {
    const percentage = calculateSectionCompletion(sectionIndex);
    if (percentage === 100) return "complete";
    if (percentage > 0) return "partial";
    return "empty";
  };

  const currentSectionDef = FORM_SECTIONS.find((s) => s.id === currentSection);

  return (
    <>
      <AnimationStyles />
      <HeroSection
        greeting="Student Form"
        title="Individual Inventory Record"
        subtitle="Complete your student profile information for PUP Guidance Services"
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        {/* Simple Progress Card */}
        <div className="mb-8 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground text-sm">
              Overall Completion
            </h3>
            <span className="text-lg font-bold text-destructive">
              {getOverallCompletion()}%
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-sm h-2.5 overflow-hidden">
            <div
              className="bg-destructive h-full transition-all duration-300"
              style={{ width: `${getOverallCompletion()}%` }}
            />
          </div>
          {lastSaved && (
            <div className="text-sm text-muted-foreground">
              Last saved: {lastSaved}
            </div>
          )}
        </div>

        {/* Validation Errors */}
        {showValidationError && validationErrorList.length > 0 && (
          <Alert variant="destructive" className="mb-6 border-2">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="ml-2">
              <div className="font-semibold mb-2">
                Please fix the following errors:
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {validationErrorList.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Layout: Horizontal Section Nav + Form Content */}
        <div className="flex flex-col gap-6">
          {/* Horizontal Section Navigation */}
          <div className="flex overflow-x-auto gap-2 pb-1">
            {FORM_SECTIONS.map((section) => {
              const status = getSectionStatus(section.id);
              const hasError = sectionsWithErrors.includes(section.id);
              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setCurrentSection(section.id);
                    // Clear validation errors when navigating to a different section
                    setSectionsWithErrors([]);
                    setShowValidationError(false);
                  }}
                  disabled={currentSection === section.id}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors whitespace-nowrap relative ${
                    currentSection === section.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : hasError
                      ? "bg-card text-card-foreground border-2 border-destructive"
                      : "bg-card text-card-foreground border border-border hover:border-primary/30"
                  }`}
                >
                  {section.title}
                  {hasError && (
                    <AlertCircle className="w-4 h-4 flex-shrink-0 text-destructive" />
                  )}
                  {status === "complete" && !hasError && (
                    <Check className="w-4 h-4 flex-shrink-0 text-green-500" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2">

              {/* Form Content Card */}
              <Card className="border-0 shadow-sm bg-background">
                <CardHeader className="bg-transparent border-b p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <CardTitle className="text-base sm:text-lg md:text-xl">
                      {currentSectionDef?.title}
                    </CardTitle>
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-full w-fit">
                      {calculateSectionCompletion(currentSection)}% Complete
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 md:p-8 pb-24">
                  {currentSection === 1 && localFormData?.student && (
                    <PersonalInformationSection
                      ref={personalSectionRef}
                      studentInfo={localFormData.student}
                      onChange={handleInputChange}
                    />
                  )}
                  {currentSection === 2 && localFormData?.education && (
                    <EducationBackgroundSection
                      ref={educationSectionRef}
                      education={localFormData.education}
                      onChange={handleInputChange}
                    />
                  )}
                  {currentSection === 3 && localFormData?.family && (
                    <FamilyBackgroundSection
                      ref={familySectionRef}
                      family={localFormData.family}
                      onChange={handleInputChange}
                    />
                  )}
                  {currentSection === 4 && localFormData?.health && (
                    <HealthInformationSection
                      ref={healthSectionRef}
                      health={localFormData.health}
                      onChange={handleInputChange}
                    />
                  )}
                  {currentSection === 5 && localFormData?.interests && (
                    <InterestsSection
                      ref={interestsSectionRef}
                      interests={localFormData.interests}
                      onChange={handleInputChange}
                    />
                  )}
                  {currentSection === 6 && (
                    <TestResultsSection
                      ref={testResultsSectionRef}
                      testResults={localFormData?.testResults || []}
                      onChange={handleInputChange}
                    />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Form Navigation Buttons */}
            <div className="sticky bottom-0 flex justify-between gap-3 bg-card p-4 border-t border-border shadow-lg flex-wrap z-20 rounded-2xl">
              <Button
                onClick={() => setShowResetConfirm(true)}
                className="bg-destructive hover:bg-destructive/90 text-white"
              >
                Reset Form
              </Button>

              <div className="flex gap-2 ml-auto">
                <Button
                  variant="outline"
                  onClick={handlePreviousSection}
                  disabled={currentSection === 1 || isSaving}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {currentSection < FORM_SECTIONS.length && (
                  <Button
                    onClick={handleNextSection}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-destructive hover:bg-destructive/90"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
                {currentSection === FORM_SECTIONS.length && (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-destructive hover:bg-destructive/90"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Submit Form
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
        </div>

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 pointer-events-none">
            <Card className="w-full max-w-md shadow-2xl bg-card border-border pointer-events-auto">
              <CardHeader className="bg-card border-b border-border pb-4">
                <CardTitle className="text-2xl text-foreground">
                  Confirm Submission
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-4">
                  <p className="text-sm text-foreground">
                    By clicking "I Agree", you consent to the collection, use, and processing of your personal data for legitimate purposes related to this service.
                  </p>
                  <p className="text-sm text-foreground">
                    Your information will be handled in accordance with our Privacy Policy and in compliance with the Data Privacy Act of 2012.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent-agree"
                    checked={consentAgreed}
                    onChange={(e) => setConsentAgreed(e.target.checked)}
                    className="mt-1 rounded border-border cursor-pointer"
                  />
                  <label htmlFor="consent-agree" className="text-sm text-foreground cursor-pointer">
                    I have read and understood the above, and I confirm that all information in my Individual Inventory Record is true and correct.
                  </label>
                </div>
                <div className="flex gap-3 justify-end pt-4">
                  <Button
                    variant="ghost"
                    onClick={() => setShowSubmitConfirm(false)}
                    className="border border-border hover:bg-muted"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmSubmit}
                    disabled={!consentAgreed}
                    className={consentAgreed ? "bg-destructive hover:bg-destructive/90 text-white" : "bg-gray-400 text-gray-600 cursor-not-allowed"}
                  >
                    I Agree & Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pointer-events-none">
            <Card className="w-full max-w-md shadow-2xl pointer-events-auto bg-card border-border">
              <CardHeader className="bg-card border-b border-border py-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
                <CardTitle className="text-2xl text-foreground">
                  Form Submitted!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6 text-center">
                <div className="space-y-2">
                  <p className="text-foreground font-medium">
                    Your Individual Inventory Record has been successfully
                    submitted.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Thank you for completing the form. The information has been
                    saved and will be reviewed.
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/student")}
                  className="w-full bg-destructive hover:bg-destructive/90 text-white"
                >
                  Return to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        <AlertDialog open={showResetConfirm} onOpenChange={(open) => setShowResetConfirm(open)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Form</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear your current responses while preserving autofilled basic information. Are you sure you want to Reset?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="ghost" className="border border-border hover:bg-muted">Cancel</Button>
              </AlertDialogCancel>
              <AlertDialogAction onClick={confirmReset} className="bg-destructive hover:bg-destructive/90 text-white">Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Toast Notifications */}
      <Toast toasts={toasts} />
    </>
  );
}
