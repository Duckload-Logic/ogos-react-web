import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMe } from "@/features/users/hooks/useMe";
import {
  useIIRFormSave,
  useSaveIIRDraft,
  useGetIIRDraft,
  useTouchedState,
  useIIRProfile,
} from "@/features/iir/hooks";
import { IIRForm as IIRFormType } from "@/features/iir/types";
import { EMPTY_IIR_FORM } from "@/features/iir/constants";
import { Spinner } from "@/components/shared";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Layout from "@/components/layout/Layout";
import { usePageMetadata } from "@/context";
import { useToast } from "@/context";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/ui/hero-section";
import { AnimationStyles } from "@/components/ui/animations";
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
  User,
  FileText,
  Upload,
} from "lucide-react";
import {
  PersonalSection,
  EducationSection,
  FamilySection,
  HealthSection,
  InterestsSection,
  // ConsentDialog,
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
import { SectionProgress } from "@/features/iir/components/form/SectionProgress";
import ConsentDialog from "@/features/iir/components/form/ConsentDialog";
import { cn } from "@/lib/utils";
import { PatchIIRSubmit, UploadIIRCor } from "@/features/iir/services/service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const FORM_SECTIONS = [
  { title: "Basic Info", id: 1, key: "personal_basic", main: 1 },
  { title: "Personal Profile", id: 2, key: "personal_profile", main: 1 },
  { title: "Address & Contact", id: 3, key: "personal_address", main: 1 },
  { title: "Employment", id: 4, key: "personal_employment", main: 1 },
  { title: "Educational Background", id: 5, key: "education", main: 2 },
  { title: "Home Environment", id: 6, key: "family_background", main: 3 },
  { title: "Father's Information", id: 7, key: "family_father", main: 3 },
  { title: "Mother's Information", id: 8, key: "family_mother", main: 3 },
  { title: "Guardian & Siblings", id: 9, key: "family_others", main: 3 },
  { title: "Health Information", id: 10, key: "health", main: 4 },
  { title: "Interests & Hobbies", id: 11, key: "interests", main: 5 },
];

export default function IIRForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editIirId = searchParams.get("iirId") || undefined;
  const isEditMode = searchParams.get("edit") === "true" && !!editIirId;
  const { data: me } = useMe({});

  const { saveDraft, clearDraft, lastSaved } = useSaveIIRDraft();
  const { draft, isLoadingDraft, draftError } = useGetIIRDraft();
  const { data: editProfileData, isLoading: isLoadingEditProfile } =
    useIIRProfile(editIirId || "");

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

  const [currentSection, setCurrentSection] = useState<number>(() => {
    const saved = localStorage.getItem("iir_current_section");
    return saved ? parseInt(saved, 10) : 1;
  });
  const [visitedSections, setVisitedSections] = useState<number[]>(() => {
    const saved = localStorage.getItem("iir_visited_sections");
    return saved ? JSON.parse(saved) : [1];
  });
  const [localFormData, setLocalFormData] = useState<IIRFormType | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [validationErrorList, setValidationErrorList] = useState<string[]>([]);
  const [showValidationError, setShowValidationError] = useState(false);
  const [sectionsWithErrors, setSectionsWithErrors] = useState<number[]>([]);
  const [showDraftPrompt, setShowDraftPrompt] = useState(false);
  const [draftData, setDraftData] = useState<IIRFormType | null>(null);
  const [corFile, setCorFile] = useState<File | null>(null);
  const [isUploadingCor, setIsUploadingCor] = useState(false);
  const { triggerToast } = useToast();

  // Modal error state
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [groupedErrors, setGroupedErrors] = useState({});
  const [totalErrors, setTotalErrors] = useState(0);

  const [lastChangeTimestamp, setLastChangeTimestamp] = useState(0);

  const handleInputChange = useCallback((fieldPath: string, value: any) => {
    const path = fieldPath.split(".");
    setLocalFormData((prev: IIRFormType | null) =>
      updateNestedField(prev, path, value),
    );
    setLastChangeTimestamp(Date.now());
  }, []);

  useEffect(() => {
    const initializeForm = () => {
      if (
        isLoadingDraft ||
        isLoadingEditProfile ||
        !me ||
        hasInitialized.current
      )
        return;

      const sourceData = isEditMode ? editProfileData || draft : draft;
      const initializedData = initializeFormData(
        sourceData ?? null,
        EMPTY_IIR_FORM,
        me,
      );
      setLocalFormData(initializedData);
      setIsInitializing(false);
      hasInitialized.current = true;
    };

    initializeForm();
  }, [
    isLoadingDraft,
    isLoadingEditProfile,
    isEditMode,
    editProfileData,
    draft,
    me,
  ]);

  useEffect(() => {
    if (isInitializing || !localFormData) return;

    const saveTimer = setTimeout(() => {
      autoSave();
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [localFormData, lastChangeTimestamp]);

  useEffect(() => {
    if (!visitedSections.includes(currentSection)) {
      setVisitedSections((prev) => {
        const next = [...prev, currentSection];
        localStorage.setItem("iir_visited_sections", JSON.stringify(next));
        return next;
      });
    }
    localStorage.setItem("iir_current_section", currentSection.toString());
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

  const isLoading =
    isInitializing ||
    isLoadingDraft ||
    isLoadingEditProfile ||
    isSubmitting ||
    isSaving ||
    isUploadingCor;

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
      2: personalSectionRef,
      3: personalSectionRef,
      4: personalSectionRef,
      5: educationSectionRef,
      6: familySectionRef,
      7: familySectionRef,
      8: familySectionRef,
      9: familySectionRef,
      10: healthSectionRef,
      11: interestsSectionRef,
    };

    const validation = validateSection(sectionRefs[currentSection]);
    if (!validation.isValid) {
      console.debug("Validation errors:", validation.errors);
      markAllTouched(); // Reveal inline errors in the current section
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

  const handleCorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      triggerToast("Please upload COR as PDF, JPG, or PNG.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      triggerToast("COR file must be 10MB or smaller.");
      return;
    }

    setCorFile(file);
  };

  const handleUploadCor = async () => {
    if (!editIirId || !corFile) return;

    setIsUploadingCor(true);
    try {
      await UploadIIRCor(editIirId, corFile);
      triggerToast("COR uploaded successfully.");
      setCorFile(null);
    } catch (err) {
      console.error("Error uploading COR:", err);
      triggerToast("Unable to upload COR. Please try again.");
    } finally {
      setIsUploadingCor(false);
    }
  };

  const handleSubmit = async () => {
    // Mark all fields as touched so validation errors show
    markAllTouched();

    // Always trigger validate() on the current section so inline field errors show
    const currentSectionRefs: Record<number, any> = {
      1: personalSectionRef,
      2: personalSectionRef,
      3: personalSectionRef,
      4: personalSectionRef,
      5: educationSectionRef,
      6: familySectionRef,
      7: familySectionRef,
      8: familySectionRef,
      9: familySectionRef,
      10: healthSectionRef,
      11: interestsSectionRef,
    };
    currentSectionRefs[currentSection]?.current?.validate?.();

    // Validate all sections
    const sectionRefs: Record<number, any> = {
      1: personalSectionRef,
      2: personalSectionRef,
      3: personalSectionRef,
      4: personalSectionRef,
      5: educationSectionRef,
      6: familySectionRef,
      7: familySectionRef,
      8: familySectionRef,
      9: familySectionRef,
      10: healthSectionRef,
      11: interestsSectionRef,
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
        triggerToast("Please complete all sections before submitting.");
        if (
          !validationResult.incompleteCompletionSections.includes(
            currentSection,
          )
        ) {
          setCurrentSection(validationResult.incompleteCompletionSections[0]);
        }
      } else {
        triggerToast("Please fix errors before submitting.");
        if (!validationResult.sectionsWithErrors.includes(currentSection)) {
          setCurrentSection(validationResult.sectionsWithErrors[0]);
        }
      }
      return;
    }

    // All validations passed, clear section errors and open legal consent dialog
    setSectionsWithErrors([]);
    setShowValidationError(false);
    setShowConsentDialog(true);
  };

  const handleLegalConsentAccept = async () => {
    if (!localFormData) {
      triggerToast("Form data is missing. Please try again.");
      return;
    }

    setIsSaving(true);

    try {
      // Submit or update backend record (service handles transformation via normalizeIIRPayload)
      if (isEditMode && editIirId) {
        await PatchIIRSubmit(editIirId, localFormData);
      } else {
        await submitFormAsync(localFormData);
      }

      if (corFile && editIirId) {
        await UploadIIRCor(editIirId, corFile);
      }

      // Cleanup local draft on successful final submission
      clearDraft();

      // Success
      setShowConsentDialog(false);
      triggerToast(
        isEditMode
          ? "✓ IIR profile updated successfully!"
          : "✓ Form submitted successfully!",
      );
      setShowSuccessPopup(true);

      setTimeout(() => {
        navigate(isEditMode ? "/student/iir" : "/student");
      }, 3000);
    } catch (err: any) {
      console.error("Error submitting form:", err);
      const errorMessage =
        err?.response?.data?.error ||
        "Failed to submit form. Please try again.";
      triggerToast(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLegalConsentCancel = () => {
    setShowConsentDialog(false);
  };

  const confirmReset = () => {
    const resetData = createResetFormData(EMPTY_IIR_FORM, me);
    setLocalFormData(resetData);
    setCurrentSection(1);
    setVisitedSections([1]);
    localStorage.removeItem("iir_current_section");
    localStorage.removeItem("iir_visited_sections");
    resetTouched(); // Clear touched state on reset
    setShowResetConfirm(false);
    triggerToast("Form has been reset.");
  };

  const currentSectionDef = FORM_SECTIONS.find((s) => s.id === currentSection);
  usePageMetadata({
    title: isEditMode
      ? "Edit Individual Inventory Record"
      : "Individual Inventory Record",
    description: isEditMode
      ? "Review and update your student profile information, including your current COR."
      : "Fill out your student information with confidence. Your data is protected and used solely for academic and guidance purposes.",
    badgeText: "Student Profile Portal",
    badgeIcon: <User className="h-4 w-4" />,
    isLoading,
  });

  return (
    <>
      <div className="transition-colors duration-500">
        <AnimationStyles />

        {/* Main Content Container */}
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-start lg:gap-10">
            {/* Sidebar Progress Tracker (Desktop) */}
            <aside className="hidden w-[300px] shrink-0 lg:sticky lg:top-24 lg:block">
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
                  calculateSectionCompletion(
                    sectionIndex,
                    localFormData ?? null,
                  )
                }
                lastSaved={lastSaved}
              />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1">
              <div className="flex flex-col gap-10">
                {/* Mobile/Tablet Progress Tracker */}
                <div className="lg:hidden">
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
                      calculateSectionCompletion(
                        sectionIndex,
                        localFormData ?? null,
                      )
                    }
                    lastSaved={lastSaved}
                  />
                </div>

                {/* Draft Restore Prompt */}
                {showDraftPrompt && (
                  <div className="animate-in slide-in-from-top-4 duration-500">
                    <div
                      className={cn(
                        "rounded-3xl border border-primary/20 bg-primary/5 p-5",
                        "backdrop-blur-md dark:border-primary/20",
                        "dark:bg-primary/10 sm:flex-row",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-2xl",
                            "bg-primary/10 text-primary",
                          )}
                        >
                          <AlertCircle className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-foreground">
                            Unsaved Progress Found
                          </h4>
                          <p className="text-xs font-medium text-muted-foreground">
                            Would you like to restore your previous work?
                          </p>
                        </div>
                      </div>
                      <div className="flex w-full gap-2 sm:w-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDiscardDraft}
                          className={cn(
                            "flex-1 rounded-xl font-bold text-muted-foreground",
                            "hover:bg-neutral-100 dark:hover:bg-neutral-800 sm:flex-none",
                          )}
                        >
                          Discard
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleRestoreDraft}
                          className={cn(
                            "flex-1 rounded-xl bg-primary px-6 font-bold text-white",
                            "shadow-lg shadow-primary/20 hover:bg-primary/90 sm:flex-none",
                          )}
                        >
                          Restore Draft
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-6">
                  {/* Form Content Wrapper */}
                  <div className="">
                    {/* Floating Completion Pill */}
                    <div className="animate-in fade-in slide-in-from-right-4 mb-3 delay-300 duration-700">
                      <div
                        className={cn(
                          "flex items-center gap-2.5 rounded-full border",
                          "border-white/20 bg-white/60 px-4 py-2",
                          "shadow-[0_4px_12px_rgba(0,0,0,0.03)] backdrop-blur-md",
                          "dark:border-white/10 dark:bg-white/[0.04]",
                        )}
                      >
                        <div
                          className={cn(
                            "h-2.5 w-2.5 animate-pulse rounded-full bg-primary",
                            "shadow-[0_0_10px_rgba(var(--primary),0.6)]",
                          )}
                        />
                        <span
                          className={cn(
                            "text-[11px] font-black uppercase tracking-wider",
                            "text-neutral-900 dark:text-white",
                          )}
                        >
                          {calculateSectionCompletion(
                            currentSection,
                            localFormData ?? null,
                          )}
                          % Form Progress
                        </span>
                      </div>
                    </div>

                    {isEditMode && (
                      <Card className="mb-5 rounded-3xl border-primary/15 bg-primary/5 shadow-sm">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center gap-2 text-base">
                            <FileText className="h-5 w-5 text-primary" />
                            Certificate of Registration (COR)
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <label className="flex cursor-pointer flex-col rounded-2xl border border-dashed border-primary/30 bg-background/70 px-4 py-3 text-sm transition hover:bg-primary/5 sm:flex-1">
                              <span className="font-semibold text-foreground">
                                {corFile ? corFile.name : "Upload current COR"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                PDF, JPG, or PNG up to 10MB
                              </span>
                              <input
                                type="file"
                                className="hidden"
                                accept="application/pdf,image/jpeg,image/png"
                                onChange={handleCorFileChange}
                              />
                            </label>
                            <Button
                              type="button"
                              onClick={handleUploadCor}
                              disabled={!corFile || isUploadingCor}
                              className="h-11 rounded-2xl font-bold"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              {isUploadingCor ? "Uploading..." : "Save COR"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Individual Form Sections */}
                    <div
                      className={cn(
                        "animate-in fade-in slide-in-from-bottom-8",
                        "fill-mode-both duration-700 ease-out",
                      )}
                    >
                      {[1, 2, 3, 4].includes(currentSection) &&
                        localFormData?.student && (
                          <PersonalSection
                            ref={personalSectionRef}
                            studentInfo={localFormData.student}
                            onChange={handleInputChange}
                            onFieldBlur={markFieldTouched}
                            shouldShowError={shouldShowError}
                            subStep={currentSection}
                          />
                        )}
                      {currentSection === 5 && localFormData?.education && (
                        <EducationSection
                          ref={educationSectionRef}
                          education={localFormData.education}
                          onChange={handleInputChange}
                          onFieldBlur={markFieldTouched}
                          shouldShowError={shouldShowError}
                        />
                      )}
                      {[6, 7, 8, 9].includes(currentSection) &&
                        localFormData?.family && (
                          <FamilySection
                            ref={familySectionRef}
                            family={localFormData.family}
                            onChange={handleInputChange}
                            onFieldBlur={markFieldTouched}
                            shouldShowError={shouldShowError}
                            subStep={currentSection - 5}
                          />
                        )}
                      {currentSection === 10 && localFormData?.health && (
                        <HealthSection
                          ref={healthSectionRef}
                          health={localFormData.health}
                          onChange={handleInputChange}
                          onFieldBlur={markFieldTouched}
                          shouldShowError={shouldShowError}
                        />
                      )}
                      {currentSection === 11 && localFormData?.interests && (
                        <InterestsSection
                          ref={interestsSectionRef}
                          interests={localFormData.interests}
                          onChange={handleInputChange}
                          onFieldBlur={markFieldTouched}
                          shouldShowError={shouldShowError}
                        />
                      )}
                    </div>
                  </div>

                  {/* Form Navigation Action Bar */}
                  <div
                    className={cn(
                      "animate-in fade-in slide-in-from-bottom-4 mb-20 mt-4 flex",
                      "flex-col items-center justify-between gap-4 rounded-[28px]",
                      "border border-white/20 bg-white/40 p-5",
                      "shadow-[0_12px_40px_rgba(31,38,135,0.08)] backdrop-blur-xl",
                      "delay-500 duration-700 dark:border-white/10",
                      "dark:bg-white/[0.04] md:flex-row",
                    )}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => setShowResetConfirm(true)}
                      className={cn(
                        "rounded-xl px-4 font-bold text-neutral-400 transition-all",
                        "duration-300 hover:bg-destructive/10 hover:text-destructive",
                        "sm:px-6",
                      )}
                    >
                      Reset
                    </Button>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={handlePreviousSection}
                        disabled={currentSection === 1 || isSaving}
                        className={cn(
                          "flex h-12 items-center gap-2 rounded-2xl",
                          "border-neutral-200/50 bg-white/30 px-5 font-bold",
                          "text-neutral-700 shadow-sm transition-all duration-300",
                          "hover:bg-white/60 dark:border-white/10 dark:bg-white/5",
                          "dark:text-neutral-200 dark:hover:bg-white/10 sm:px-7",
                        )}
                      >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="hidden sm:inline">Back</span>
                      </Button>

                      {currentSection < FORM_SECTIONS.length ? (
                        <Button
                          onClick={handleNextSection}
                          disabled={isSaving}
                          className={cn(
                            "flex h-12 items-center gap-2 rounded-2xl bg-primary px-6",
                            "font-black tracking-tight text-primary-foreground shadow-xl",
                            "shadow-primary/20 transition-all duration-300",
                            "hover:bg-primary/90 active:scale-95 sm:px-10",
                          )}
                        >
                          {isSaving ? (
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "border-3 h-5 w-5 animate-spin rounded-full",
                                  "border-primary-foreground border-t-transparent",
                                )}
                              />
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
                          className={cn(
                            "flex h-12 items-center gap-2 rounded-2xl bg-primary",
                            "px-6 font-black tracking-tight",
                            "text-primary-foreground shadow-xl shadow-primary/20",
                            "transition-all duration-300 hover:bg-primary/90",
                            "active:scale-95 sm:px-10",
                          )}
                        >
                          {isSubmitting ? (
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "border-3 h-5 w-5 animate-spin rounded-full",
                                  "border-primary-foreground border-t-transparent",
                                )}
                              />
                              <span>Submitting...</span>
                            </div>
                          ) : (
                            <>
                              <Save className="h-5 w-5" />
                              <span>
                                {isEditMode
                                  ? "Save Changes"
                                  : "Complete Profile"}
                              </span>
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overlays & Modals */}
        <ConsentDialog
          open={showConsentDialog}
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
          <AlertDialogContent
            className={cn(
              "max-w-sm rounded-3xl border-none bg-white/90 shadow-2xl",
              "backdrop-blur-3xl dark:bg-neutral-900/90",
            )}
          >
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-black tracking-tight">
                Erase everything?
              </AlertDialogTitle>
              <AlertDialogDescription className="font-medium leading-relaxed text-neutral-500 dark:text-neutral-400">
                This will clear all your current answers. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4 flex-row gap-2">
              <AlertDialogCancel asChild>
                <Button
                  variant="ghost"
                  className="flex-1 rounded-2xl border border-neutral-200 font-bold dark:border-neutral-800"
                >
                  Cancel
                </Button>
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmReset}
                className={cn(
                  "flex-1 rounded-2xl bg-destructive font-bold text-white",
                  "shadow-lg shadow-destructive/20 hover:bg-destructive/90",
                )}
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
      </div>
    </>
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
    <div
      className={cn(
        "animate-in fade-in fixed inset-0 z-[100] flex items-center",
        "justify-center bg-neutral-950/40 p-4 backdrop-blur-sm",
        "duration-500",
      )}
    >
      <div
        className={cn(
          "animate-in zoom-in-95 w-full max-w-md rounded-[40px] border",
          "border-white/20 bg-white/90 p-10 text-center",
          "shadow-[0_32px_120px_rgba(0,0,0,0.15)] backdrop-blur-2xl",
          "duration-500 dark:border-white/10 dark:bg-neutral-900/90",
        )}
      >
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/20 blur-2xl" />
            <div
              className={cn(
                "relative flex h-20 w-20 items-center justify-center",
                "rounded-[28px] bg-green-500 shadow-xl shadow-green-500/30",
              )}
            >
              <Check
                className="h-10 w-10 text-white"
                strokeWidth={4}
              />
            </div>
          </div>
        </div>
        <h3
          className={cn(
            "mb-3 text-3xl font-[900]",
            "text-neutral-900 dark:text-white",
          )}
        >
          All Done!
        </h3>
        <p
          className={cn(
            "mb-10 px-4 font-medium",
            "text-neutral-500 dark:text-neutral-400",
          )}
        >
          Your Individual Inventory Record has been successfully submitted and
          saved to our secure database.
        </p>
        <Button
          onClick={onReturn}
          className={cn(
            "h-14 w-full rounded-2xl bg-neutral-900 text-lg font-bold",
            "text-white shadow-xl transition-all",
            "duration-300 hover:bg-neutral-800 active:scale-95",
            "dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200",
          )}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
