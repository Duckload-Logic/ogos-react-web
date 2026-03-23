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
import Layout from "@/components/layout/Layout";
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
        draft ?? null,
        // completeIIRForm,
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

  const isLoading = isInitializing || isLoadingDraft || isSubmitting || isSaving;

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
    <Layout
      title="Individual Inventory Record"
      isLoading={isLoading}
    >
      <div className="transition-colors duration-500">
        <AnimationStyles />

        {/* Premium Glass Header */}
        <div className="relative pt-16 pb-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -tranneutral-x-1/2 w-full max-w-5xl h-full -z-10 blur-[120px] opacity-70" />
          <div className="max-w-4xl mx-auto text-center animate-in fade-in zoom-in-95 duration-700">
            <span className="inline-block px-4 py-1.5 mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 rounded-full border border-primary/20 backdrop-blur-md">
              Student Profile Portal
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-[900] tracking-tight text-neutral-900 dark:text-white mb-6">
              Individual Inventory <span className="text-primary">Record</span>
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-base sm:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
              Fill out your student information with confidence. Your data is
              protected and used solely for academic and guidance purposes.
            </p>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
          <div className="flex flex-col gap-10 w-full">
            {/* Draft Restore Prompt */}
            {showDraftPrompt && (
              <div className="animate-in slide-in-from-top-4 duration-500">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-primary/5 backdrop-blur-md border border-primary/20 rounded-3xl dark:bg-primary/10 dark:border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">
                        Unsaved Progress Found
                      </h4>
                      <p className="text-xs text-muted-foreground font-medium">
                        Would you like to restore your previous work?
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDiscardDraft}
                      className="flex-1 sm:flex-none text-muted-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl font-bold"
                    >
                      Discard
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleRestoreDraft}
                      className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 font-bold px-6"
                    >
                      Restore Draft
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Tracker Layer */}
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

            <div className="flex flex-col gap-6">
              {/* Form Content Wrapper */}
              <div className="">
                {/* Floating Completion Pill */}
                <div className="mb-3 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
                  <div className="flex items-center gap-2.5 px-4 py-2 bg-white/60 backdrop-blur-md border border-white/20 rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.03)] dark:bg-white/[0.04] dark:border-white/10">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.6)]" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                      {calculateSectionCompletion(
                        currentSection,
                        localFormData ?? null,
                      )}
                      % Form Progress
                    </span>
                  </div>
                </div>

                {/* Individual Form Sections */}
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
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
                    />
                  )}
                  {currentSection === 5 && localFormData?.interests && (
                    <InterestsSection
                      ref={interestsSectionRef}
                      interests={localFormData.interests}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
              </div>

              {/* Form Navigation Action Bar */}
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white/40 backdrop-blur-xl p-5 border border-white/20 shadow-[0_12px_40px_rgba(31,38,135,0.08)] dark:bg-white/[0.04] dark:border-white/10 rounded-[28px] mt-4 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                <Button
                  variant="ghost"
                  onClick={() => setShowResetConfirm(true)}
                  className="text-neutral-400 hover:text-destructive hover:bg-destructive/10 font-bold rounded-xl px-4 sm:px-6 transition-all duration-300"
                >
                  Reset
                </Button>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handlePreviousSection}
                    disabled={currentSection === 1 || isSaving}
                    className="flex items-center gap-2 border-neutral-200/50 bg-white/30 hover:bg-white/60 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 rounded-2xl px-5 sm:px-7 h-12 font-bold text-neutral-700 dark:text-neutral-200 transition-all duration-300 shadow-sm"
                  >
                    <ChevronLeft className="h-5 w-5" />
                    <span className="hidden sm:inline">Back</span>
                  </Button>

                  {currentSection < FORM_SECTIONS.length ? (
                    <Button
                      onClick={handleNextSection}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 rounded-2xl px-6 sm:px-10 h-12 font-black tracking-tight transition-all duration-300 active:scale-95"
                    >
                      {isSaving ? (
                        <div className="flex items-center gap-3">
                          <div className="animate-spin h-5 w-5 border-3 border-primary-foreground border-t-transparent rounded-full" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <>
                          <span>Next Step</span>
                          <ChevronRight className="h-5 w-5" />
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      disabled={isSaving}
                      className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 rounded-2xl px-6 sm:px-10 h-12 font-black tracking-tight transition-all duration-300 active:scale-95"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-3">
                          <div className="animate-spin h-5 w-5 border-3 border-primary-foreground border-t-transparent rounded-full" />
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        <>
                          <Save className="h-5 w-5" />
                          <span>Complete Profile</span>
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlays & Modals */}
        <LegalConsentDialog
          open={showLegalConsentDialog}
          onAccept={handleLegalConsentAccept}
          onCancel={handleLegalConsentCancel}
          isSubmitting={isSaving}
        />

        <SuccessPopup
          isOpen={showSuccessPopup}
          onReturn={() => navigate("/student")}
        />

        <AlertDialog
          open={showResetConfirm}
          onOpenChange={(open) => setShowResetConfirm(open)}
        >
          <AlertDialogContent className="rounded-3xl border-none shadow-2xl backdrop-blur-3xl bg-white/90 dark:bg-neutral-900/90 max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-black tracking-tight">
                Erase everything?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
                This will clear all your current answers. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-row gap-2 mt-4">
              <AlertDialogCancel asChild>
                <Button
                  variant="ghost"
                  className="flex-1 rounded-2xl font-bold border border-neutral-200 dark:border-neutral-800"
                >
                  Cancel
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmReset}
                className="flex-1 bg-destructive hover:bg-destructive/90 text-white rounded-2xl font-bold shadow-lg shadow-destructive/20"
              >
                Yes, Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <FormErrorModal
          isOpen={isErrorModalOpen}
          onClose={() => setIsErrorModalOpen(false)}
          groupedErrors={groupedErrors}
          totalErrors={totalErrors}
          onNavigateToSection={(id) => setCurrentSection(id)}
        />

        {/* Notification Toast Layer */}
        <Toast toasts={toasts} />
      </div>
    </Layout>
  );
}

/**
 * Premium Success Popup Component
 */
function SuccessPopup({
  isOpen,
  onReturn,
}: {
  isOpen: boolean;
  onReturn: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/20 rounded-[40px] shadow-[0_32px_120px_rgba(0,0,0,0.15)] dark:bg-neutral-900/90 dark:border-white/10 p-10 text-center animate-in zoom-in-95 duration-500">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative w-20 h-20 rounded-[28px] bg-green-500 flex items-center justify-center shadow-xl shadow-green-500/30">
              <Check className="w-10 h-10 text-white" strokeWidth={4} />
            </div>
          </div>
        </div>
        <h3 className="text-3xl font-[900] tracking-tight text-neutral-900 dark:text-white mb-3">
          All Done!
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-10 leading-relaxed px-4">
          Your Individual Inventory Record has been successfully submitted and
          saved to our secure database.
        </p>
        <Button
          onClick={onReturn}
          className="w-full h-14 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-950 rounded-2xl font-black tracking-tight text-lg shadow-xl transition-all duration-300 active:scale-95"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
