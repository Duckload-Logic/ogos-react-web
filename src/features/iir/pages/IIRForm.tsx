import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMe } from "@/features/users/hooks/useMe";
import {
  useIIRFormSave,
  useSaveIIRDraft,
  useGetIIRDraft,
  useTouchedState,
} from "@/features/iir/hooks";
import { IIRForm as IIRFormType } from "@/features/iir/types/IIRForm";
import { EMPTY_IIR_FORM } from "@/features/iir/constants";
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
  // LegalConsentDialog,
  // FormErrorModal,
  // SectionProgress,
} from "@/features/iir/components/form";
import {
  updateNestedField,
  getOverallCompletion,
  getSectionStatus,
  createResetFormData,
  initializeFormData,
  calculateSectionCompletion,
  validateAllSections,
  validateSection,
} from "@/features/iir/utils/form";
import {
  FormErrorModal,
  groupErrorsBySection,
} from "@/features/iir/components/form/FormErrorModal";
import { completeIIRForm } from "../tests/test";
import { SectionProgress } from "../components/form/SectionProgress";
import LegalConsentDialog from "../components/form/LegalConsentDialog";

const FORM_SECTIONS = [
  { title: "I. Personal Information", id: 1, key: "personal" },
  { title: "II. Educational Background", id: 2, key: "education" },
  { title: "III. Home and Family Background", id: 3, key: "family" },
  { title: "IV. Health Information", id: 4, key: "health" },
  { title: "V. Interests and Hobbies", id: 5, key: "interests" },
];

export default function IIRForm() {
  const navigate = useNavigate();
  const { data: me } = useMe({});

  const { saveDraft, clearDraft, lastSaved } = useSaveIIRDraft();
  const { draft, isLoadingDraft, draftError } = useGetIIRDraft();

  const { submitFormAsync, isSubmitting } = useIIRFormSave();

  // Touched state management
  const { markFieldTouched, markAllTouched, shouldShowError, resetTouched } =
    useTouchedState();

  const hasInitialized = useRef(false);
  const personalSectionRef = useRef<any>(null);
  const educationSectionRef = useRef<any>(null);
  const familySectionRef = useRef<any>(null);
  const healthSectionRef = useRef<any>(null);
  const interestsSectionRef = useRef<any>(null);

  const [currentSection, setCurrentSection] = useState(1);
  const [visitedSections, setVisitedSections] = useState<number[]>([1]);
  const [localFormData, setLocalFormData] = useState<IIRFormType | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showLegalConsentDialog, setShowLegalConsentDialog] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [validationErrorList, setValidationErrorList] = useState<string[]>([]);
  const [showValidationError, setShowValidationError] = useState(false);
  const [sectionsWithErrors, setSectionsWithErrors] = useState<number[]>([]);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [draftData, setDraftData] = useState<IIRFormType | null>(null);
  const [toasts, setToasts] = useState<string[]>([]);

  // Modal error state
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [groupedErrors, setGroupedErrors] = useState({});
  const [totalErrors, setTotalErrors] = useState(0);

  const [lastChangeTimestamp, setLastChangeTimestamp] = useState(0);

  const handleInputChange = useCallback((fieldPath: string, value: any) => {
    const path = fieldPath.split(".");
    setLocalFormData((prev) => updateNestedField(prev, path, value));
    setLastChangeTimestamp(Date.now());
  }, []);

  useEffect(() => {
    const initializeForm = () => {
      if (isLoadingDraft || !me || hasInitialized.current) return;

      const initializedData = initializeFormData(
        // draft ?? null
        completeIIRForm,
        EMPTY_IIR_FORM,
        me,
      );
      setLocalFormData(initializedData);
      setIsInitializing(false);
      hasInitialized.current = true;
    };

    initializeForm();
  }, [isLoadingDraft, me]);

  useEffect(() => {
    if (isInitializing || !localFormData) return;

    const saveTimer = setTimeout(() => {
      autoSave();
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [localFormData, lastChangeTimestamp]);

  useEffect(() => {
    if (!visitedSections.includes(currentSection)) {
      setVisitedSections((prev) => [...prev, currentSection]);
    }
  }, [currentSection, visitedSections]);

  useEffect(() => {
    const localDraftStr = localStorage.getItem(`iir_draft-student_${me?.id}`);
    if (localDraftStr) {
      try {
        const parsed = JSON.parse(localDraftStr) as IIRFormType;
        if (
          parsed.student?.basicInfo?.lastName ||
          parsed.student?.basicInfo?.firstName ||
          (parsed.family?.relatedPersons &&
            parsed.family.relatedPersons.length > 0)
        ) {
          setDraftData(parsed);
          setShowDraftPrompt(true);
        }
      } catch (e) {
        clearDraft();
      }
    }
  }, [clearDraft]);

  const handleRestoreDraft = () => {
    if (draftData) {
      setLocalFormData(draftData);
    }
    setShowDraftPrompt(false);
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftPrompt(false);
  };

  const autoSave = async () => {
    if (!localFormData) return;

    try {
      await saveDraft(localFormData);
    } catch (err) {
      console.error("[AutoSave] Error saving draft:", err);
    }
  };

  const addToast = (message: string, duration: number = 3000) => {
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

  const handleNextSection = async () => {
    // Validate current section using its ref
    const sectionRefs: Record<number, any> = {
      1: personalSectionRef,
      2: educationSectionRef,
      3: familySectionRef,
      4: healthSectionRef,
      5: interestsSectionRef,
    };

    const validation = validateSection(sectionRefs[currentSection]);
    if (!validation.isValid) {
      console.debug("Validation errors:", validation.errors);
      setValidationErrorList(Object.values(validation.errors));
      setShowValidationError(true);
      return;
    }

    setIsSaving(true);
    try {
      if (localFormData) {
        await saveDraft(localFormData);
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
    // Mark all fields as touched so validation errors show
    markAllTouched();

    // Always trigger validate() on the current section so inline field errors show
    const currentSectionRefs: Record<number, any> = {
      1: personalSectionRef,
      2: educationSectionRef,
      3: familySectionRef,
      4: healthSectionRef,
      5: interestsSectionRef,
    };
    currentSectionRefs[currentSection]?.current?.validate?.();

    // Validate all sections
    const sectionRefs: Record<number, any> = {
      1: personalSectionRef,
      2: educationSectionRef,
      3: familySectionRef,
      4: healthSectionRef,
      5: interestsSectionRef,
    };

    const validationResult = validateAllSections(
      sectionRefs,
      FORM_SECTIONS,
      (sectionIndex) =>
        calculateSectionCompletion(sectionIndex, localFormData ?? null),
      currentSection,
    );

    if (validationResult.hasErrors) {
      setSectionsWithErrors(validationResult.sectionsWithErrors);
      setValidationErrorList(validationResult.errorMessages);
      setShowValidationError(true);

      const raw = validationResult.rawErrors || {};
      const total = Object.keys(raw).length;

      if (total > 0) {
        setGroupedErrors(groupErrorsBySection(raw));
        setTotalErrors(total);
        setIsErrorModalOpen(true);
      } else if (validationResult.incompleteCompletionSections.length > 0) {
        addToast("Please complete all sections before submitting.");
        if (
          !validationResult.incompleteCompletionSections.includes(
            currentSection,
          )
        ) {
          setCurrentSection(validationResult.incompleteCompletionSections[0]);
        }
      } else {
        addToast("Please fix errors before submitting.");
        if (!validationResult.sectionsWithErrors.includes(currentSection)) {
          setCurrentSection(validationResult.sectionsWithErrors[0]);
        }
      }
      return;
    }

    // All validations passed, clear section errors and open legal consent dialog
    setSectionsWithErrors([]);
    setShowValidationError(false);
    setShowLegalConsentDialog(true);
  };

  const handleLegalConsentAccept = async () => {
    if (!localFormData) {
      addToast("Form data is missing. Please try again.");
      return;
    }

    setIsSaving(true);

    try {
      // Submit to backend (service handles transformation via normalizeIIRPayload)
      await submitFormAsync(localFormData);

      // Cleanup local draft on successful final submission
      clearDraft();

      // Success
      setShowLegalConsentDialog(false);
      addToast("✓ Form submitted successfully!");
      setShowSuccessPopup(true);

      setTimeout(() => {
        navigate("/student");
      }, 3000);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      const errorMessage =
        err?.response?.data?.error ||
        "Failed to submit form. Please try again.";
      addToast(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLegalConsentCancel = () => {
    setShowLegalConsentDialog(false);
  };

  const confirmReset = () => {
    const resetData = createResetFormData(EMPTY_IIR_FORM, me);
    setLocalFormData(resetData);
    setShowResetConfirm(false);
    resetTouched(); // Clear touched state on reset
    addToast("Form reset.");
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
              {getOverallCompletion(
                localFormData ?? null,
                FORM_SECTIONS.length,
                (sectionIndex) =>
                  calculateSectionCompletion(
                    sectionIndex,
                    localFormData ?? null,
                  ),
              )}
              %
            </span>
          </div>
          <div className="w-full bg-gray-300 rounded-sm h-2.5 overflow-hidden">
            <div
              className="bg-destructive h-full transition-all duration-300"
              style={{
                width: `${getOverallCompletion(
                  localFormData ?? null,
                  FORM_SECTIONS.length,
                  (sectionIndex) =>
                    calculateSectionCompletion(
                      sectionIndex,
                      localFormData ?? null,
                    ),
                )}%`,
              }}
            />
          </div>
        </div>

        {/* Draft Restore Prompt */}
        {showDraftPrompt && (
          <Alert className="mb-6 border-blue-200 bg-blue-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-500" />
              <AlertDescription className="text-blue-700 font-medium">
                We found an unsaved draft. Would you like to restore it?
              </AlertDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDiscardDraft}>
                Discard
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleRestoreDraft}
              >
                Restore
              </Button>
            </div>
          </Alert>
        )}

        {/* Main Layout: Horizontal Section Nav + Form Content */}
        <div className="flex flex-col gap-6 relative w-full">
          <SectionProgress
            sections={FORM_SECTIONS}
            currentSection={currentSection}
            sectionsWithErrors={sectionsWithErrors}
            visitedSections={visitedSections}
            onNavigate={(id: number) => {
              setCurrentSection(id);
              setSectionsWithErrors([]);
              setShowValidationError(false);
            }}
            calculateCompletion={(sectionIndex: number) =>
              calculateSectionCompletion(sectionIndex, localFormData ?? null)
            }
            onToast={addToast}
            lastSaved={lastSaved}
          />

          <div className="flex flex-col gap-2">
            {/* Form Content Card */}
            <Card className="border-0 shadow-sm bg-background">
              <CardHeader className="bg-transparent border-b p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-base sm:text-lg md:text-xl">
                    {currentSectionDef?.title}
                  </CardTitle>
                  <span className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-full w-fit">
                    {calculateSectionCompletion(
                      currentSection,
                      localFormData ?? null,
                    )}
                    % Complete
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 md:p-8 pb-24">
                {currentSection === 1 && localFormData?.student && (
                  <PersonalInformationSection
                    ref={personalSectionRef}
                    studentInfo={localFormData.student}
                    onChange={handleInputChange}
                    onFieldBlur={markFieldTouched}
                    shouldShowError={shouldShowError}
                  />
                )}
                {currentSection === 2 && localFormData?.education && (
                  <EducationBackgroundSection
                    ref={educationSectionRef}
                    education={localFormData.education}
                    onChange={handleInputChange}
                  // onFieldBlur={markFieldTouched}
                  // shouldShowError={shouldShowError}
                  />
                )}
                {currentSection === 3 && localFormData?.family && (
                  <FamilyBackgroundSection
                    ref={familySectionRef}
                    family={localFormData.family}
                    onChange={handleInputChange}
                    onFieldBlur={markFieldTouched}
                    shouldShowError={shouldShowError}
                  />
                )}
                {currentSection === 4 && localFormData?.health && (
                  <HealthInformationSection
                    ref={healthSectionRef}
                    health={localFormData.health}
                    onChange={handleInputChange}
                  // onFieldBlur={markFieldTouched}
                  // shouldShowError={shouldShowError}
                  />
                )}
                {currentSection === 5 && localFormData?.interests && (
                  <InterestsSection
                    ref={interestsSectionRef}
                    interests={localFormData.interests}
                    onChange={handleInputChange}
                  // onFieldBlur={markFieldTouched}
                  // shouldShowError={shouldShowError}
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

        {/* Legal Consent Dialog */}
        <LegalConsentDialog
          open={showLegalConsentDialog}
          onAccept={handleLegalConsentAccept}
          onCancel={handleLegalConsentCancel}
          isSubmitting={isSaving}
        />

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
        <AlertDialog
          open={showResetConfirm}
          onOpenChange={(open) => setShowResetConfirm(open)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Form</AlertDialogTitle>
              <AlertDialogDescription>
                This will clear your current responses while preserving
                autofilled basic information. Are you sure you want to Reset?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button
                  variant="ghost"
                  className="border border-border hover:bg-muted"
                >
                  Cancel
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmReset}
                className="bg-destructive hover:bg-destructive/90 text-white"
              >
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <FormErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        groupedErrors={groupedErrors}
        totalErrors={totalErrors}
        onNavigateToSection={(id) => setCurrentSection(id)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} />
    </>
  );
}
