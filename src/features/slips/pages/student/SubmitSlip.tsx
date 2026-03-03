import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  FileUp,
  CheckCircle2,
  ChevronRight,
  Edit2,
  CircleChevronLeft,
  AlertCircle,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useGetSlipCategories, useSubmitSlip } from "@/features/slips/hooks";

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

  const datesComplete = formData.dateOfAbsence && formData.dateNeeded;
  const categoryComplete = formData.categoryId > 0;
  const documentsProvided = Object.values(formData.files).some(
    (fileArray) => fileArray.length > 0,
  );

  const isFormValid = datesComplete && categoryComplete && documentsProvided;

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4 py-10 border-b border-border/40 bg-background/50 backdrop-blur-sm">
        <Link
          to="/student/slips"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all group"
        >
          <CircleChevronLeft
            size={16}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          <span>Return to My Slips</span>
        </Link>

        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Submit an Admission Slip
          </h1>
          <p className="text-sm text-muted-foreground max-w-prose">
            Provide the required information and supporting documents for your
            absence.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-0">
            {steps.map((step, index) => {
              const StepIcon = Calendar;
              const isCompleted =
                (step.id === 1 && datesComplete) ||
                (step.id === 2 && categoryComplete) ||
                (step.id === 3 && documentsProvided);
              const isCurrent = currentStep === step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        flex items-center justify-center w-10 h-10 rounded-full
                        transition-all duration-300
                        ${
                          isCompleted
                            ? "bg-primary text-primary-foreground"
                            : isCurrent
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                              : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`
                        text-xs font-medium mt-1.5 transition-colors
                        ${
                          isCurrent || isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }
                      `}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        w-16 sm:w-24 h-0.5 mx-3 rounded-full transition-colors duration-300
                        ${
                          (step.id === 1 && datesComplete) ||
                          (step.id === 2 && categoryComplete)
                            ? "bg-primary"
                            : "bg-border"
                        }
                      `}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selection Summary */}
        {(datesComplete || categoryComplete) && (
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="py-3 px-4">
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
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card className="border border-border shadow-sm">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-muted border-b border-border">
                <CardTitle className="text-lg">Absence Dates</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Date of Absence <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfAbsence}
                      onChange={(e) =>
                        handleDateChange("dateOfAbsence", e.target.value)
                      }
                      className="w-full border border-border rounded-lg p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Date Needed <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.dateNeeded}
                      onChange={(e) =>
                        handleDateChange("dateNeeded", e.target.value)
                      }
                      className="w-full border border-border rounded-lg p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    />
                    <p className="text-xs text-muted-foreground">
                      When do you need this approval?
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
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
                    className="w-full border border-border rounded-lg p-3 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none h-24"
                  />
                </div>

                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!datesComplete}
                  className="w-full"
                >
                  Continue to Category
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Category Selection */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <Card className="border border-border shadow-sm">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-muted border-b border-border">
                <CardTitle className="text-lg">Select Category</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {isCategoriesLoading && (
                    <p className="text-sm text-muted-foreground">
                      Loading categories...
                    </p>
                  )}
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`w-full p-4 border-2 rounded-lg transition-all text-left
                        ${
                          formData.categoryId === category.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-foreground">
                          {category.name}
                        </span>
                        {formData.categoryId === category.id && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <Button
                  onClick={() => setCurrentStep(3)}
                  disabled={!categoryComplete}
                  className="w-full mt-6"
                >
                  Continue to Documents
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Document Upload */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
            {/* Info Box */}
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
              <CardContent className="py-4 px-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    Upload supporting documents for your absence claim. Accepted
                    file types: PDF, JPG, PNG, DOC, DOCX (Max 5MB per file)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Document Sections */}
            <div className="space-y-4">
              {/* Excuse Letter */}
              <DocumentUploadSection
                title="Excuse Letter"
                description="Upload an excuse letter explaining your absence"
                files={formData.files.excuseLetter}
                onFilesAdd={(files) => handleFileAdd("excuseLetter", files)}
                onFileRemove={(index) =>
                  handleFileRemove("excuseLetter", index)
                }
                documentType="excuseLetter"
              />

              {/* Parent's ID */}
              <DocumentUploadSection
                title="Valid Parent's ID"
                description="Upload a copy of your parent's or guardian's valid ID"
                files={formData.files.parentId}
                onFilesAdd={(files) => handleFileAdd("parentId", files)}
                onFileRemove={(index) => handleFileRemove("parentId", index)}
                documentType="parentId"
              />

              {/* Medical Certificate */}
              <DocumentUploadSection
                title="Medical Certificate"
                description="Upload medical certificate if applicable (optional)"
                files={formData.files.medicalCert}
                onFilesAdd={(files) => handleFileAdd("medicalCert", files)}
                onFileRemove={(index) => handleFileRemove("medicalCert", index)}
                documentType="medicalCert"
                optional
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 mt-8">
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
      </div>
    </div>
  );
}

interface DocumentUploadSectionProps {
  title: string;
  description: string;
  files: File[];
  onFilesAdd: (files: FileList | null) => void;
  onFileRemove: (index: number) => void;
  documentType: string;
  optional?: boolean;
}

function DocumentUploadSection({
  title,
  description,
  files,
  onFilesAdd,
  onFileRemove,
  documentType,
  optional = false,
}: DocumentUploadSectionProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    onFilesAdd(e.dataTransfer.files);
  };

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">
              {title}
              {!optional && <span className="text-red-500 ml-1">*</span>}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
            ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }
          `}
        >
          <input
            type="file"
            multiple
            onChange={(e) => onFilesAdd(e.target.files)}
            className="absolute inset-0 opacity-0 cursor-pointer"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <div className="flex flex-col items-center justify-center text-center">
            <FileUp className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground">
              Drag and drop or click to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, JPG, PNG, DOC, DOCX up to 5MB
            </p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Uploaded Files
            </p>
            {files.map((file, index) => (
              <div
                key={`${documentType}-${index}`}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileUp className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onFileRemove(index)}
                  className="p-1 hover:bg-danger/20 rounded transition-colors"
                  aria-label="Remove file"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
