import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calendar,
  FileUp,
  CheckCircle2,
  ChevronRight,
  Edit2,
  CircleChevronLeft,
  AlertCircle,
  ClipboardList,
  Layers,
  Trash2,
  X,
  Folder,
} from "lucide-react";
import { useGetSlipCategories, useSubmitSlip } from "@/features/slips/hooks";
import {
  SlipStepProgress,
} from "@/features/slips/components";
import { AnimationStyles } from "@/components/ui/animations";

interface FormData {
  dateOfAbsence: string;
  dateNeeded: string;
  reason: string;
  categoryId: number;
  files: {
    excuseLetter: File[];
    parentId: File[];
    medicalCert: File[];
  };
}

const EMPTY_FORM_DATA: FormData = {
  dateOfAbsence: "",
  dateNeeded: "",
  reason: "",
  categoryId: 0,
  files: {
    excuseLetter: [],
    parentId: [],
    medicalCert: [],
  },
};

export default function SubmitSlip() {
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const { data: categories = [], isLoading: isCategoriesLoading } =
    useGetSlipCategories();
  const { mutate: submitSlip, isPending: isSubmitting } = useSubmitSlip();

  const steps = [
    { id: 1, label: "Dates", icon: Calendar },
    { id: 2, label: "Category", icon: FileUp },
    { id: 3, label: "Documents", icon: FileUp },
  ];

  const datesComplete = !!(formData.dateOfAbsence && formData.dateNeeded);
  const categoryComplete = formData.categoryId > 0;
  const documentsProvided = Object.values(formData.files).some(
    (fileArray) => fileArray.length > 0,
  );

  const isFormValid = datesComplete && categoryComplete && documentsProvided;
  const completedSteps: boolean[] = [datesComplete, categoryComplete, documentsProvided];

  const handleDateChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryChange = (categoryId: number) => {
    setFormData((prev) => ({
      ...prev,
      categoryId,
    }));
  };

  const handleFileAdd = (
    documentType: "excuseLetter" | "parentId" | "medicalCert",
    files: FileList | null,
  ) => {
    if (files) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        files: {
          ...prev.files,
          [documentType]: [...prev.files[documentType], ...newFiles],
        },
      }));
    }
  };

  const handleFileRemove = (
    documentType: "excuseLetter" | "parentId" | "medicalCert",
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [documentType]: prev.files[documentType].filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const formDataToSend = new FormData();
    formDataToSend.append(
      "dateOfAbsence",
      new Date(formData.dateOfAbsence).toISOString().split("T")[0],
    );
    formDataToSend.append(
      "dateNeeded",
      new Date(formData.dateNeeded).toISOString().split("T")[0],
    );
    formDataToSend.append("reason", formData.reason);
    formDataToSend.append("categoryId", String(formData.categoryId));

    // Add all files with proper naming
    formData.files.excuseLetter.forEach((file) => {
      formDataToSend.append("files", file);
    });
    formData.files.parentId.forEach((file) => {
      formDataToSend.append("files", file);
    });
    formData.files.medicalCert.forEach((file) => {
      formDataToSend.append("files", file);
    });

    submitSlip(formDataToSend, {
      onSuccess: () => {
        navigate("/student/slips");
      },
    });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getSelectedCategory = () => {
    return categories.find((c) => c.id === formData.categoryId);
  };

  const isMedicalCategory = () => {
    const selected = getSelectedCategory();
    if (!selected) return false;
    const categoryName = selected.name?.toLowerCase() || "";
    return (
      categoryName.includes("medical") ||
      categoryName.includes("health") ||
      categoryName.includes("illness") ||
      categoryName.includes("sick")
    );
  };

  return (
    <>
      <AnimationStyles />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 bg-gradient-to-b from-muted/40 to-transparent">
          <Link
            to="/student/slips"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all group"
          >
            <CircleChevronLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            <span>Return to My Slips</span>
          </Link>
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep} of {steps.length}
          </span>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Title Section - Centered in main content */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Submit an Admission Slip
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Provide the required information and supporting documents for your absence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-2 space-y-4">
          {/* Progress Indicator */}
          <Card className="border-0 shadow-sm bg-muted/30 py-3 px-4">
            <SlipStepProgress
              steps={steps}
              currentStep={currentStep}
              completedSteps={completedSteps}
            />
          </Card>

          {/* Selection Summary */}
          {(datesComplete || categoryComplete) && (
            <Card className="mb-4 border-primary/20 bg-primary/5">
              <CardContent className="py-2.5 px-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {datesComplete && (
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors group"
                    >
                      <Calendar className="w-4 h-4 text-primary" />
                      {formatDate(formData.dateOfAbsence)} to{" "}
                      {formatDate(formData.dateNeeded)}
                      <Edit2 className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
                    </button>
                  )}
                  {datesComplete && categoryComplete && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  {categoryComplete && (
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-full text-sm font-medium hover:bg-muted transition-colors group"
                    >
                      <Badge variant="outline" className="text-xs">
                        {getSelectedCategory()?.name}
                      </Badge>
                      <Edit2 className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 1: Date Selection */}
          {currentStep === 1 && (
            <div className="animate-in fade-in duration-200">
              <Card className="border-0 shadow-sm">
                <CardHeader className="bg-muted/30 border-b border-border/60 py-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <CardTitle className="text-base">Absence Dates</CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Tell us when you were absent and when you need approval by</p>
                </CardHeader>
                <CardContent className="pt-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Date of Absence <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.dateOfAbsence}
                        onChange={(e) =>
                          handleDateChange("dateOfAbsence", e.target.value)
                        }
                        className="w-full border border-border rounded-md p-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Date Needed <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.dateNeeded}
                        onChange={(e) =>
                          handleDateChange("dateNeeded", e.target.value)
                        }
                        className="w-full border border-border rounded-md p-2.5 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        When do you need this approval?
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Reason for Absence <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          reason: e.target.value,
                        }))
                      }
                      placeholder="Briefly explain why you were absent"
                      className="w-full border border-border rounded-md p-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none h-20"
                    />
                  </div>

                  <Button
                    onClick={() => setCurrentStep(2)}
                    disabled={!datesComplete}
                    className={`w-full ${
                      datesComplete
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    }`}
                  >
                    Continue to Category
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 2: Category Selection */}
          {currentStep === 2 && (
            <div className="animate-in fade-in duration-200">
              <Card className="border-0 shadow-sm">
                <CardHeader className="bg-muted/30 border-b border-border/60 py-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-red-500" />
                    <CardTitle className="text-base">Select Category</CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Choose the category that best describes your absence</p>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {isCategoriesLoading && (
                      <p className="text-sm text-muted-foreground">
                        Loading categories...
                      </p>
                    )}
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`w-full p-3 border rounded-md transition-all text-left text-sm
                          ${
                            formData.categoryId === category.id
                              ? "border-primary bg-primary/5"
                              : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">
                            {category.name}
                          </span>
                          {formData.categoryId === category.id && (
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={() => setCurrentStep(1)}
                      variant="outline"
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setCurrentStep(3)}
                      disabled={!categoryComplete}
                      className="flex-1"
                    >
                      Continue to Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Document Upload */}
          {currentStep === 3 && (
            <div className="animate-in fade-in duration-200 space-y-4">
              {/* Section Header Card */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="bg-muted/30 border-b border-border/60 py-3">
                  <div className="flex items-center gap-2">
                    <FileUp className="w-4 h-4 text-red-500" />
                    <CardTitle className="text-base">Upload Documents</CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Upload all required documents to complete your admission slip request</p>
                </CardHeader>
              </Card>

              {/* Info Box */}
              <Card className="border-amber-200/60 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/10">
                <CardContent className="py-3 px-4">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 dark:text-amber-200">
                      Accepted: PDF, JPG, PNG, DOC, DOCX (Max 5MB per file)
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Document Sections */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                  <Accordion type="single" collapsible className="w-full">
                    {/* Document 1: Excuse Letter */}
                    <AccordionItem value="excuse-letter" className="border-b last:border-b-0">
                      <AccordionTrigger className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 hover:no-underline transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-semibold text-foreground">
                            1
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-foreground">Excuse Letter</h3>
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Upload an excuse letter explaining your absence</p>
                          </div>
                        </div>
                        {formData.files.excuseLetter.length > 0 && (
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-3 bg-muted/20 border-t border-border/40">
                        <div className="space-y-3">
                          {formData.files.excuseLetter.length === 0 ? (
                            <div className="relative border-2 border-dashed border-border/60 rounded-lg p-6 transition-colors cursor-pointer hover:border-primary/50 hover:bg-muted/20">
                              <input
                                type="file"
                                multiple
                                onChange={(e) => handleFileAdd("excuseLetter", e.target.files)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              />
                              <div className="flex flex-col items-center justify-center text-center">
                                <Folder className="w-8 h-8 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG, DOC up to 5MB</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {formData.files.excuseLetter.map((file, index) => (
                                <div key={`excuse-${index}`} className="flex items-center justify-between p-3 bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/40 rounded-md">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleFileRemove("excuseLetter", index)}
                                    className="p-0.5 hover:bg-red-100/50 dark:hover:bg-red-950/30 rounded transition-colors shrink-0"
                                    aria-label="Remove file"
                                  >
                                    <X className="w-3.5 h-3.5 text-red-500" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Document 2: Valid Parent's ID */}
                    <AccordionItem value="parent-id" className="border-b last:border-b-0">
                      <AccordionTrigger className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 hover:no-underline transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-semibold text-foreground">
                            2
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-foreground">Valid Parent's ID</h3>
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Upload a copy of your parent's or guardian's valid ID</p>
                          </div>
                        </div>
                        {formData.files.parentId.length > 0 && (
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-3 bg-muted/20 border-t border-border/40">
                        <div className="space-y-3">
                          {formData.files.parentId.length === 0 ? (
                            <div className="relative border-2 border-dashed border-border/60 rounded-lg p-6 transition-colors cursor-pointer hover:border-primary/50 hover:bg-muted/20">
                              <input
                                type="file"
                                multiple
                                onChange={(e) => handleFileAdd("parentId", e.target.files)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              />
                              <div className="flex flex-col items-center justify-center text-center">
                                <Folder className="w-8 h-8 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG, DOC up to 5MB</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {formData.files.parentId.map((file, index) => (
                                <div key={`parent-${index}`} className="flex items-center justify-between p-3 bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/40 rounded-md">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleFileRemove("parentId", index)}
                                    className="p-0.5 hover:bg-red-100/50 dark:hover:bg-red-950/30 rounded transition-colors shrink-0"
                                    aria-label="Remove file"
                                  >
                                    <X className="w-3.5 h-3.5 text-red-500" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {/* Document 3: Medical Certificate - Only show if medical category */}
                    {isMedicalCategory() && (
                    <AccordionItem value="medical-cert" className="border-b last:border-b-0">
                      <AccordionTrigger className="flex items-center justify-between px-4 py-3 hover:bg-muted/30 hover:no-underline transition-colors">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-semibold text-foreground">
                            3
                          </div>
                          <div className="text-left">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-medium text-foreground">Medical Certificate</h3>
                              <Badge variant="destructive" className="text-xs">Required</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">Upload medical certificate (required)</p>
                          </div>
                        </div>
                        {formData.files.medicalCert.length > 0 && (
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        )}
                      </AccordionTrigger>
                      <AccordionContent className="px-4 py-3 bg-muted/20 border-t border-border/40">
                        <div className="space-y-3">
                          {formData.files.medicalCert.length === 0 ? (
                            <div className="relative border-2 border-dashed border-border/60 rounded-lg p-6 transition-colors cursor-pointer hover:border-primary/50 hover:bg-muted/20">
                              <input
                                type="file"
                                multiple
                                onChange={(e) => handleFileAdd("medicalCert", e.target.files)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              />
                              <div className="flex flex-col items-center justify-center text-center">
                                <Folder className="w-8 h-8 text-muted-foreground mb-2" />
                                <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                                <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG, DOC up to 5MB</p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {formData.files.medicalCert.map((file, index) => (
                                <div key={`cert-${index}`} className="flex items-center justify-between p-3 bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/40 rounded-md">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                    <div className="min-w-0">
                                      <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => handleFileRemove("medicalCert", index)}
                                    className="p-0.5 hover:bg-red-100/50 dark:hover:bg-red-950/30 rounded transition-colors shrink-0"
                                    aria-label="Remove file"
                                  >
                                    <X className="w-3.5 h-3.5 text-red-500" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    )}
                  </Accordion>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex gap-3 mt-5 pt-2">
                <Button
                  onClick={() => setCurrentStep(2)}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Submitting..." : "Submit Admission Slip"}
                </Button>
              </div>
            </div>
          )}

          {/* Need Help? Contact Card */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm">NEED HELP?</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 pt-3">
              <div>
                <p className="font-medium text-foreground">Visit the Guidance Office</p>
              </div>
              <div className="space-y-1 text-xs">
                <p className="text-muted-foreground"><span className="font-medium text-foreground">Hours:</span> Mon-Fri, 7:30 AM - 4:00 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-4">
          {/* Tips Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                <CardTitle className="text-sm">TIPS</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-foreground">
                  <span className="text-primary">Date of Absence</span> is when you were actually absent.
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  <span className="font-medium">Date Needed</span> is your deadline for the approval.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">
                  Be <span className="text-primary">specific and honest</span> in your reason.
                </p>
                <p className="text-muted-foreground text-xs mt-1">
                  Vague reasons may cause delays in approval.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Requirements Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-primary" /> REQUIREMENTS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3 text-sm">
                <li className="flex gap-3">
                  <span className="font-bold text-primary shrink-0">1</span>
                  <div>
                    <p className="font-medium text-foreground">Medical Certificate</p>
                    <p className="text-muted-foreground text-xs">required for illness-related absences</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary shrink-0">2</span>
                  <div>
                    <p className="font-medium text-foreground">Supporting Document</p>
                    <p className="text-muted-foreground text-xs">any proof of related to your reason</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary shrink-0">3</span>
                  <div>
                    <p className="font-medium text-foreground">File formats</p>
                    <p className="text-muted-foreground text-xs">PDF, JPG, PNG — max 5MB per file</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Approval Process Section */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm">APPROVAL PROCESS</CardTitle>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="relative pl-6">
                
                {/* Step 1 - Active */}
                <div className="relative pb-3">
                  <div className="absolute -left-5 top-0.5 w-2.5 h-2.5 rounded-full bg-primary z-10"></div>
                  <div>
                    <p className="font-medium text-foreground text-sm leading-tight">You Submit</p>
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">Fill and submit your slip</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative pb-3">
                  <div className="absolute -left-5 top-0.5 w-2.5 h-2.5 rounded-full bg-border/30 z-10"></div>
                  <div>
                    <p className="font-medium text-foreground text-sm leading-tight">Under Review</p>
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">School office reviews within 1-2 days</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-5 top-0.5 w-2.5 h-2.5 rounded-full bg-border/30 z-10"></div>
                  <div>
                    <p className="font-medium text-foreground text-sm leading-tight">Approved / Returned</p>
                    <p className="text-muted-foreground text-xs mt-1 leading-relaxed">You'll be notified on status</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</>
);
}