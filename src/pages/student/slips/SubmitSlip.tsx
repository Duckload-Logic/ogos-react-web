import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  FileUp,
  CheckCircle2,
  ChevronRight,
  Edit2,
  AlertCircle,
  ClipboardList,
  Layers,
  X,
  Folder,
  Plus,
  Eye,
  ImageIcon,
  FileText,
} from "lucide-react";
import {
  useGetSlipCategories,
  useSubmitSlip,
  useUpdateSlip,
  useGetSlipById,
} from "@/features/slips/hooks";
import { StepProgress } from "@/features/slips/components";
import { AnimationStyles } from "@/components/ui/animations";
import { CreateSlipRequest } from "@/features/slips/types";
import { usePageMetadata } from "@/context";
import { DatePicker } from "@/components/form/DatePicker";
import FormInput from "@/components/form/FormInput";
import { useToast } from "@/context";
import { cn } from "@/lib/utils";

interface SubmitSlipFormState {
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

const EMPTY_FORM_DATA: SubmitSlipFormState = {
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

// Reusable Local File Preview Card
function LocalFileCard({
  file,
  onRemove,
  onPreview,
}: {
  file: File;
  onRemove: () => void;
  onPreview: (file: File, url: string) => void;
}) {
  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      {/* Thumbnail Area */}
      <div
        onClick={() => onPreview(file, previewUrl)}
        className="relative flex aspect-[4/3] cursor-pointer items-center justify-center overflow-hidden bg-muted/30"
      >
        {isImage && previewUrl ? (
          <img
            src={previewUrl}
            alt={file.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : isPdf ? (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg bg-red-100 p-3 shadow-sm dark:bg-red-900/30">
              <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <span className="rounded-full bg-red-100/50 px-2 py-0.5 text-[8px] font-bold text-red-700 dark:bg-red-900/40 dark:text-red-300">
              PDF
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-lg bg-blue-100 p-3 shadow-sm dark:bg-blue-900/30">
              <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-primary/10 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
          <div className="rounded-full bg-white/90 p-2 shadow-lg dark:bg-black/90">
            <Eye className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>

      {/* Info & Remove Area */}
      <div className="flex items-center justify-between border-t border-border/40 p-2">
        <div className="flex min-w-0 items-center gap-1.5">
          {isImage ? (
            <ImageIcon className="h-3 w-3 shrink-0 text-muted-foreground" />
          ) : (
            <FileText className="h-3 w-3 shrink-0 text-muted-foreground" />
          )}
          <p className="truncate text-[10px] font-medium text-foreground/80">
            {file.name}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-950/30"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default function SubmitSlip() {
  const [formData, setFormData] =
    useState<SubmitSlipFormState>(EMPTY_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const [previewData, setPreviewData] = useState<{
    file: File;
    url: string;
  } | null>(null);

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const { triggerToast } = useToast();

  const { data: categories = [], isLoading: isCategoriesLoading } =
    useGetSlipCategories();
  const { data: existingSlip, isLoading: isSlipLoading } = useGetSlipById(
    id || "",
  );
  const { mutate: submitSlip, isPending: isSubmitting } = useSubmitSlip();
  const { mutate: updateSlip, isPending: isUpdating } = useUpdateSlip();

  useEffect(() => {
    if (isEditMode && existingSlip) {
      setFormData({
        dateOfAbsence: existingSlip.dateOfAbsence
          ? new Date(existingSlip.dateOfAbsence).toISOString().split("T")[0]
          : "",
        dateNeeded: existingSlip.dateNeeded
          ? new Date(existingSlip.dateNeeded).toISOString().split("T")[0]
          : "",
        reason: existingSlip.reason,
        categoryId: existingSlip.categoryId,
        files: {
          excuseLetter: [],
          parentId: [],
          medicalCert: [],
        },
      });
    }
  }, [isEditMode, existingSlip]);

  const steps = [
    { id: 1, label: "Dates", icon: Calendar },
    { id: 2, label: "Category", icon: FileUp },
    { id: 3, label: "Documents", icon: FileUp },
  ];

  const datesComplete = !!(formData.dateOfAbsence && formData.dateNeeded);
  const categoryComplete = formData.categoryId > 0;

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

  const excuseLetterProvided = formData.files.excuseLetter.length > 0;
  const parentIdProvided = formData.files.parentId.length > 0;
  const medicalCertProvided =
    !isMedicalCategory() || formData.files.medicalCert.length > 0;

  const documentsProvided =
    excuseLetterProvided && parentIdProvided && medicalCertProvided;

  const isFormValid = datesComplete && categoryComplete && documentsProvided;
  const completedSteps: boolean[] = [
    datesComplete,
    categoryComplete,
    documentsProvided,
  ];

  const handleDateChange = (
    field: "dateOfAbsence" | "dateNeeded",
    value: string,
  ) => {
    if (field === "dateOfAbsence" && value) {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (selectedDate > today) {
        triggerToast("You cannot be absent in the future. Please select a valid date.");
        return;
      }
    }

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
    if (!files) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
    const allFiles = Array.from(files);

    const validFiles = allFiles.filter((file) => {
      const isValidSize = file.size <= MAX_SIZE;
      const isValidType = ALLOWED_TYPES.includes(file.type);

      if (!isValidSize) {
        triggerToast(`File "${file.name}" exceeds the 5MB limit.`);
      } else if (!isValidType) {
        triggerToast(`File "${file.name}" has an unsupported format.`);
      }

      return isValidSize && isValidType;
    });

    if (validFiles.length === 0) return;

    setFormData((prev) => ({
      ...prev,
      files: {
        ...prev.files,
        [documentType]: [...prev.files[documentType], ...validFiles],
      },
    }));
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

    const payload: CreateSlipRequest = {
      reason: formData.reason,
      dateOfAbsence: new Date(formData.dateOfAbsence)
        .toISOString()
        .split("T")[0],
      dateNeeded: new Date(formData.dateNeeded).toISOString().split("T")[0],
      categoryId: formData.categoryId,
      files: {
        excuseLetter: formData.files.excuseLetter,
        parentId: formData.files.parentId,
        medicalCert: formData.files.medicalCert,
      },
    };

    if (isEditMode && id) {
      updateSlip(
        { id, data: payload },
        {
          onSuccess: () => {
            triggerToast("Admission slip updated successfully");
            navigate(`/student/slips/${id}`);
          },
          onError: (error: any) => {
            triggerToast("Failed to update slip");
          },
        },
      );
    } else {
      submitSlip(payload, {
        onSuccess: () => {
          triggerToast("Admission slip submitted successfully");
          navigate("/student/slips");
        },
        onError: (error: any) => {
          if (error.message?.includes("IIR profile")) {
            navigate("/iir-form");
          } else {
            triggerToast(error.message || "Failed to submit slip");
          }
        },
      });
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  usePageMetadata({
    title: isEditMode ? "Update Admission Slip" : "Submit Admission Slip",
    description: isEditMode
      ? "Update your information or re-upload your document links as requested by the guidance counselor."
      : "Provide the required information and supporting documents for your absence.",
    badgeText: isEditMode ? "Revision" : "New Request",
    badgeIcon: isEditMode ? (
      <Edit2 className="h-4 w-4" />
    ) : (
      <Plus className="h-4 w-4" />
    ),
    isLoading:
      isCategoriesLoading ||
      (isEditMode && isSlipLoading) ||
      isSubmitting ||
      isUpdating,
  });

  return (
    <>
      <AnimationStyles />
      <div className="min-h-full bg-background pt-6">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <Card className="border-0 bg-muted/30 px-4 py-3 shadow-sm">
                <StepProgress
                  steps={steps}
                  currentStep={currentStep}
                  completedSteps={completedSteps}
                />
              </Card>

              {(datesComplete || categoryComplete) && (
                <Card className="mb-4 border-primary/20 bg-primary/5">
                  <CardContent className="px-4 py-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {datesComplete && (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className={cn(
                            "group inline-flex items-center gap-2 rounded-full border",
                            "border-border bg-background px-3 py-1.5 text-sm font-medium",
                            "transition-colors hover:bg-muted",
                          )}
                        >
                          <Calendar className="h-4 w-4 text-primary" />
                          {formatDate(formData.dateOfAbsence)} to{" "}
                          {formatDate(formData.dateNeeded)}
                          <Edit2 className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                        </button>
                      )}
                      {datesComplete && categoryComplete && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      {categoryComplete && (
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className={cn(
                            "group inline-flex items-center gap-2 rounded-full border",
                            "border-border bg-background px-3 py-1.5 text-sm font-medium",
                            "transition-colors hover:bg-muted",
                          )}
                        >
                          <Badge
                            variant="outline"
                            className="text-xs"
                          >
                            {getSelectedCategory()?.name}
                          </Badge>
                          <Edit2 className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {currentStep === 1 && (
                <div className="animate-in fade-in duration-200">
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="border-b border-border/60 bg-muted/30 py-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-red-500" />
                        <CardTitle className="text-base">
                          Absence Dates
                        </CardTitle>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Tell us when you were absent and when you need approval
                        by
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-5">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <DatePicker
                            label="Date of Absence"
                            required
                            value={formData.dateOfAbsence}
                            onChange={(val) =>
                              handleDateChange("dateOfAbsence", val)
                            }
                          />
                        </div>
                        <div className="space-y-1.5">
                          <DatePicker
                            label="Date Needed"
                            required
                            value={formData.dateNeeded}
                            onChange={(val) =>
                              handleDateChange("dateNeeded", val)
                            }
                          />
                          <p className="mt-1 text-xs text-muted-foreground">
                            When do you need this approval?
                          </p>
                        </div>
                      </div>

                      <FormInput
                        label="Reason for Absence"
                        value={formData.reason}
                        onChange={(val) =>
                          setFormData((prev) => ({
                            ...prev,
                            reason: val,
                          }))
                        }
                        placeholder="Briefly explain why you were absent"
                        isTextarea
                        required
                        info="This reason will be reviewed by the Guidance Office. Use the mic icon to dictate your reason."
                      />

                      <Button
                        onClick={() => setCurrentStep(2)}
                        disabled={!datesComplete}
                        className={`w-full ${
                          datesComplete
                            ? "bg-red-500 text-white hover:bg-red-600"
                            : "cursor-not-allowed bg-muted text-muted-foreground"
                        }`}
                      >
                        Continue to Category
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}

              {currentStep === 2 && (
                <div className="animate-in fade-in duration-200">
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="border-b border-border/60 bg-muted/30 py-3">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-red-500" />
                        <CardTitle className="text-base">
                          Select Category
                        </CardTitle>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Choose the category that best describes your absence
                      </p>
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
                            type="button"
                            onClick={() => handleCategoryChange(category.id)}
                            className={`w-full rounded-md border p-3 text-left text-sm transition-all ${
                              formData.categoryId === category.id
                                ? "border-primary bg-primary/5"
                                : "border-border/60 hover:border-primary/50 hover:bg-muted/30"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-foreground">
                                {category.name}
                              </span>
                              {formData.categoryId === category.id && (
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="mt-4 flex gap-3">
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

              {currentStep === 3 && (
                <div className="animate-in fade-in space-y-4 duration-200">
                  <Card className="border-0 shadow-sm">
                    <CardHeader className="border-b border-border/60 bg-muted/30 py-3">
                      <div className="flex items-center gap-2">
                        <FileUp className="h-4 w-4 text-red-500" />
                        <CardTitle className="text-base">
                          Upload Documents
                        </CardTitle>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Upload all required documents to complete your admission
                        slip request
                      </p>
                    </CardHeader>
                  </Card>

                  <Card
                    className={cn(
                      "border-amber-200/60 bg-amber-50/50 dark:border-amber-900/30",
                      "dark:bg-amber-950/10",
                    )}
                  >
                    <CardContent className="px-4 py-3">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                        <p className="text-xs text-amber-700 dark:text-amber-200">
                          Accepted: PDF, JPG, PNG (Max 5MB per file)
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue="excuse-letter"
                      >
                        <AccordionItem
                          value="excuse-letter"
                          className="border-b last:border-b-0"
                        >
                          <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 hover:no-underline">
                            <div className="flex flex-1 items-center gap-3">
                              <div
                                className={cn(
                                  "flex h-6 w-6 items-center justify-center rounded-full",
                                  "bg-muted text-xs font-semibold text-foreground",
                                )}
                              >
                                1
                              </div>
                              <div className="text-left">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-medium text-foreground">
                                    Excuse Letter
                                  </h3>
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Required
                                  </Badge>
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  Upload your excuse letter
                                </p>
                              </div>
                            </div>
                            {excuseLetterProvided && (
                              <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-green-500" />
                            )}
                          </AccordionTrigger>
                          <AccordionContent className="border-t border-border/40 bg-muted/20 px-4 py-3">
                            <div className="space-y-4">
                              <div
                                className={cn(
                                  "relative cursor-pointer rounded-lg border-2 border-dashed",
                                  "border-border/60 p-6 transition-colors",
                                  "hover:border-primary/50 hover:bg-muted/20",
                                )}
                              >
                                <input
                                  type="file"
                                  multiple
                                  onChange={(e) =>
                                    handleFileAdd(
                                      "excuseLetter",
                                      e.target.files,
                                    )
                                  }
                                  className="absolute inset-0 cursor-pointer opacity-0"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <div className="flex flex-col items-center justify-center text-center">
                                  <Folder className="mb-2 h-8 w-8 text-muted-foreground" />
                                  <p className="text-sm font-medium text-foreground">
                                    Click to upload or drag and drop
                                  </p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    PDF, JPG, PNG up to 5MB
                                  </p>
                                </div>
                              </div>

                              {formData.files.excuseLetter.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                  {formData.files.excuseLetter.map(
                                    (file, index) => (
                                      <LocalFileCard
                                        key={`excuse-${index}`}
                                        file={file}
                                        onRemove={() =>
                                          handleFileRemove(
                                            "excuseLetter",
                                            index,
                                          )
                                        }
                                        onPreview={(f, url) =>
                                          setPreviewData({ file: f, url })
                                        }
                                      />
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem
                          value="parent-id"
                          className="border-b last:border-b-0"
                        >
                          <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 hover:no-underline">
                            <div className="flex flex-1 items-center gap-3">
                              <div
                                className={cn(
                                  "flex h-6 w-6 items-center justify-center rounded-full",
                                  "bg-muted text-xs font-semibold text-foreground",
                                )}
                              >
                                2
                              </div>
                              <div className="text-left">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-medium text-foreground">
                                    Valid Parent&apos;s ID
                                  </h3>
                                  <Badge
                                    variant="destructive"
                                    className="text-xs"
                                  >
                                    Required
                                  </Badge>
                                </div>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  Upload copy of parent/guardian ID
                                </p>
                              </div>
                            </div>
                            {parentIdProvided && (
                              <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-green-500" />
                            )}
                          </AccordionTrigger>
                          <AccordionContent className="border-t border-border/40 bg-muted/20 px-4 py-3">
                            <div className="space-y-4">
                              <div
                                className={cn(
                                  "relative cursor-pointer rounded-lg border-2 border-dashed",
                                  "border-border/60 p-6 transition-colors",
                                  "hover:border-primary/50 hover:bg-muted/20",
                                )}
                              >
                                <input
                                  type="file"
                                  multiple
                                  onChange={(e) =>
                                    handleFileAdd("parentId", e.target.files)
                                  }
                                  className="absolute inset-0 cursor-pointer opacity-0"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                                <div className="flex flex-col items-center justify-center text-center">
                                  <Folder className="mb-2 h-8 w-8 text-muted-foreground" />
                                  <p className="text-sm font-medium text-foreground">
                                    Click to upload or drag and drop
                                  </p>
                                  <p className="mt-1 text-xs text-muted-foreground">
                                    PDF, JPG, PNG up to 5MB
                                  </p>
                                </div>
                              </div>

                              {formData.files.parentId.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                  {formData.files.parentId.map(
                                    (file, index) => (
                                      <LocalFileCard
                                        key={`parent-${index}`}
                                        file={file}
                                        onRemove={() =>
                                          handleFileRemove("parentId", index)
                                        }
                                        onPreview={(f, url) =>
                                          setPreviewData({ file: f, url })
                                        }
                                      />
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        {isMedicalCategory() && (
                          <AccordionItem
                            value="medical-cert"
                            className="border-b last:border-b-0"
                          >
                            <AccordionTrigger className="px-4 py-3 hover:bg-muted/30 hover:no-underline">
                              <div className="flex flex-1 items-center gap-3">
                                <div
                                  className={cn(
                                    "flex h-6 w-6 items-center justify-center rounded-full",
                                    "bg-muted text-xs font-semibold text-foreground",
                                  )}
                                >
                                  3
                                </div>
                                <div className="text-left">
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-medium text-foreground">
                                      Medical Certificate
                                    </h3>
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      Required
                                    </Badge>
                                  </div>
                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                    Upload medical certificate
                                  </p>
                                </div>
                              </div>
                              {medicalCertProvided &&
                                formData.files.medicalCert.length > 0 && (
                                  <CheckCircle2 className="mr-2 h-4 w-4 shrink-0 text-green-500" />
                                )}
                            </AccordionTrigger>
                            <AccordionContent className="border-t border-border/40 bg-muted/20 px-4 py-3">
                              <div className="space-y-4">
                                <div
                                  className={cn(
                                    "relative cursor-pointer rounded-lg border-2 border-dashed",
                                    "border-border/60 p-6 transition-colors",
                                    "hover:border-primary/50 hover:bg-muted/20",
                                  )}
                                >
                                  <input
                                    type="file"
                                    multiple
                                    onChange={(e) =>
                                      handleFileAdd(
                                        "medicalCert",
                                        e.target.files,
                                      )
                                    }
                                    className="absolute inset-0 cursor-pointer opacity-0"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                  />
                                  <div className="flex flex-col items-center justify-center text-center">
                                    <Folder className="mb-2 h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm font-medium text-foreground">
                                      Click to upload or drag and drop
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                      PDF, JPG, PNG up to 5MB
                                    </p>
                                  </div>
                                </div>

                                {formData.files.medicalCert.length > 0 && (
                                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {formData.files.medicalCert.map(
                                      (file, index) => (
                                        <LocalFileCard
                                          key={`cert-${index}`}
                                          file={file}
                                          onRemove={() =>
                                            handleFileRemove(
                                              "medicalCert",
                                              index,
                                            )
                                          }
                                          onPreview={(f, url) =>
                                            setPreviewData({ file: f, url })
                                          }
                                        />
                                      ),
                                    )}
                                  </div>
                                )}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )}
                      </Accordion>
                    </CardContent>
                  </Card>

                  <div className="mt-5 flex gap-3 pt-2">
                    <Button
                      onClick={() => setCurrentStep(2)}
                      variant="outline"
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      disabled={!isFormValid || isSubmitting || isUpdating}
                      className="flex-1"
                    >
                      {isSubmitting || isUpdating
                        ? "Saving..."
                        : isEditMode
                          ? "Update & Resubmit"
                          : "Submit Admission Slip"}
                    </Button>
                  </div>
                </div>
              )}

              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-border/60 pb-3">
                  <CardTitle className="text-sm">NEED HELP?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-3 text-sm">
                  <p className="font-medium text-foreground">
                    Visit the Guidance Office
                  </p>
                  <div className="space-y-1 text-xs">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">
                        Hours:
                      </span>{" "}
                      Mon-Fri, 7:30 AM - 4:00 PM
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-500" />
                    <CardTitle className="text-sm">TIPS</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">
                      <span className="text-primary">Date of Absence</span> is
                      when you were actually absent.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      <span className="font-medium">Date Needed</span> is your
                      deadline for the approval.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Be{" "}
                      <span className="text-primary">specific and honest</span>{" "}
                      in your reason.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Vague reasons may cause delays in approval.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <ClipboardList className="h-4 w-4 text-primary" />{" "}
                    REQUIREMENTS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span className="shrink-0 font-bold text-primary">1</span>
                      <div>
                        <p className="font-medium text-foreground">
                          Excuse Letter
                        </p>
                        <p className="text-xs text-muted-foreground">
                          required for all admission slip requests
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 font-bold text-primary">2</span>
                      <div>
                        <p className="font-medium text-foreground">
                          Medical Certificate
                        </p>
                        <p className="text-xs text-muted-foreground">
                          required for illness-related absences
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 font-bold text-primary">3</span>
                      <div>
                        <p className="font-medium text-foreground">
                          Supporting Document
                        </p>
                        <p className="text-xs text-muted-foreground">
                          any proof related to your reason
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="shrink-0 font-bold text-primary">4</span>
                      <div>
                        <p className="font-medium text-foreground">
                          File formats
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG, PNG — max 5MB per file
                        </p>
                      </div>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="border-b border-border/60 pb-3">
                  <CardTitle className="text-sm">APPROVAL PROCESS</CardTitle>
                </CardHeader>
                <CardContent className="pt-3">
                  <div className="relative pl-6">
                    <div className="relative pb-3">
                      <div className="absolute -left-5 top-0.5 h-2.5 w-2.5 rounded-full bg-primary" />
                      <div>
                        <p className="text-sm font-medium leading-tight text-foreground">
                          You Submit
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          Fill and submit your slip
                        </p>
                      </div>
                    </div>

                    <div className="relative pb-3">
                      <div className="absolute -left-5 top-0.5 h-2.5 w-2.5 rounded-full bg-border/30" />
                      <div>
                        <p className="text-sm font-medium leading-tight text-foreground">
                          Under Review
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          School office reviews within 1-2 days
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-5 top-0.5 h-2.5 w-2.5 rounded-full bg-border/30" />
                      <div>
                        <p className="text-sm font-medium leading-tight text-foreground">
                          Approved / Returned
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          You&apos;ll be notified on status
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Preview Dialog */}
      <Dialog
        open={!!previewData}
        onOpenChange={(open) => !open && setPreviewData(null)}
      >
        <DialogContent className="max-w-4xl border-border/40 bg-background/95 shadow-2xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">
              {previewData?.file.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Local File Preview - Verify document clarity before submission
            </DialogDescription>
          </DialogHeader>

          <div className="flex min-h-[300px] flex-col items-center justify-center py-4">
            {previewData?.file.type.startsWith("image/") ? (
              <img
                src={previewData.url}
                alt="Preview"
                className="max-h-[60vh] max-w-full rounded-lg border border-border/40 object-contain shadow-md"
              />
            ) : previewData?.file.type === "application/pdf" ? (
              <iframe
                src={previewData.url}
                className="h-[60vh] w-full rounded-lg border border-border/40"
                title="PDF Preview"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border/60 bg-muted/30 p-8 text-center">
                <FileText className="h-10 w-10 text-primary" />
                <p className="text-sm font-medium text-foreground">
                  Preview Unavailable
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
