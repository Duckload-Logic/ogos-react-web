import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetSlipById,
  useGetSlipAttachments,
  useDownloadAttachment,
  useGetAttachmentPreview,
} from "@/features/slips/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  FileText,
  Download,
  ArrowLeft,
  AlertCircle,
  MessageSquare,
  FileCheck,
  Edit2,
  Clock,
  ExternalLink,
  Eye,
  LoaderCircle,
} from "lucide-react";
import { usePageMetadata } from "@/context";
import { AnimationStyles } from "@/components/ui/animations";
import { useToast } from "@/context";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

function PreviewModal({
  slipId,
  file,
  isOpen,
  onOpenChange,
  isImage,
  isPdf,
  onDownload,
}: {
  slipId: string;
  file: any;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isImage: boolean;
  isPdf: boolean;
  onDownload: () => void;
}) {
  const { previewUrl, isLoading } = useGetAttachmentPreview(slipId, file?.id);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-2xl border-border/40 bg-background/95 shadow-2xl backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {file?.fileName}
          </DialogTitle>
          <DialogDescription className="text-xs">
            Authorized Preview - Use download for full file
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-[300px] flex-col items-center justify-center py-4">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3">
              <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
              <p className="text-xs text-muted-foreground">
                Fetching file secure link...
              </p>
            </div>
          ) : isImage && previewUrl ? (
            <div className="group relative">
              <img
                src={previewUrl}
                alt="Preview"
                className={cn(
                  "max-h-[60vh] max-w-full rounded-lg border border-border/40",
                  "object-contain shadow-md transition-transform duration-300",
                  "group-hover:scale-[1.01]",
                )}
              />
            </div>
          ) : isPdf ? (
            <div
              className={cn(
                "flex w-full flex-col items-center gap-4 rounded-2xl border",
                "border-dashed border-border/60 bg-muted/30 p-8 text-center",
              )}
            >
              <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
                <FileText className="h-10 w-10 text-red-600 dark:text-red-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">PDF Preview Not Available</p>
                <p className="text-xs text-muted-foreground">
                  Highly secure PDF files must be downloaded to be viewed
                  correctly.
                </p>
              </div>
              <Button
                onClick={onDownload}
                variant="secondary"
                size="sm"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          ) : (
            <div
              className={cn(
                "flex w-full flex-col items-center gap-4 rounded-2xl border",
                "border-dashed border-border/60 bg-muted/30 p-8 text-center",
              )}
            >
              <div className="rounded-full bg-primary/10 p-4">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Preview Unavailable</p>
                <p className="text-xs text-muted-foreground">
                  This file type cannot be previewed in the browser.
                </p>
              </div>
              <Button
                onClick={onDownload}
                variant="secondary"
                size="sm"
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download File
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function SlipDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { triggerToast } = useToast();

  const { data: slip, isLoading, isError } = useGetSlipById(id || "");
  const { data: attachments = [] } = useGetSlipAttachments(id || "");
  const { downloadAttachment } = useDownloadAttachment();

  const [previewFile, setPreviewFile] = useState<any>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  usePageMetadata({
    title: "Admission Slip Details",
    description:
      "Detailed view of your submitted admission slip and counselor feedback.",
    badgeText: slip?.status?.name || "Loading",
    badgeIcon: <FileCheck className="h-4 w-4" />,
    isLoading: isLoading,
  });

  const handleDownload = (attachmentId: string, fileName: string) => {
    if (!id) return;
    downloadAttachment(id, attachmentId, fileName);
  };

  const handleEdit = () => {
    if (!id) return;
    navigate(`/student/slips/edit/${id}`);
  };

  const handlePreview = (file: any) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  const getFileExtension = (filename: string) => {
    return filename.split(".").pop()?.toLowerCase() || "";
  };

  const isImageFile = (filename: string) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    return imageExtensions.includes(getFileExtension(filename));
  };

  const isPdfFile = (filename: string) => {
    return getFileExtension(filename) === "pdf";
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold">Admission slip not found</h2>
        <Button
          variant="link"
          onClick={() => navigate("/student/slips")}
        >
          Back to list
        </Button>
      </div>
    );
  }

  const isEditable = slip?.status?.name === "For Revision";

  return (
    <>
      <AnimationStyles />
      <div className="min-h-full bg-background">
        <div className="py-6 pb-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Left Column: Essential Info */}
            <div className="space-y-6 md:col-span-2">
              <Card className="border-0 bg-card/60 shadow-lg backdrop-blur-md">
                <CardHeader className="border-b border-border/60 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-xl">Slip Overview</CardTitle>
                    </div>
                    <Badge
                      className={`px-3 py-1 ${
                        slip?.status?.colorKey ||
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {slip?.status?.name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Date of Absence
                      </p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {slip?.dateOfAbsence
                            ? format(
                                new Date(slip.dateOfAbsence),
                                "MMMM d, yyyy",
                              )
                            : "---"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Date Needed
                      </p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {slip?.dateNeeded
                            ? format(new Date(slip.dateNeeded), "MMMM d, yyyy")
                            : "---"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Category
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {slip?.category?.name || "General"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/40 pt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Reason provided
                    </p>
                    <div className="rounded-lg border border-border/40 bg-muted/50 p-4">
                      <p className="whitespace-pre-wrap text-sm italic leading-relaxed text-foreground/80">
                        "{slip?.reason}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {slip?.adminNotes && (
                <Card className="border-border/60 bg-amber-50/10 shadow-md dark:bg-amber-950/5">
                  <CardHeader className="border-b border-border/30 py-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-amber-500" />
                      <CardTitle className="text-sm">
                        Guidance Feedback
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="py-5">
                    <p className="text-sm font-medium leading-relaxed text-foreground/90">
                      {slip.adminNotes}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Card className="border-0 bg-muted/20 shadow-md">
                <CardHeader className="border-b border-border/40 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm">
                        Supporting Documents
                      </CardTitle>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {attachments.length} files attached
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {attachments.map((file: any) => (
                      <div
                        key={file.id}
                        className={cn(
                          "flex items-center justify-between rounded-lg border",
                          "border-border/60 bg-background/50 p-3 transition-colors",
                          "hover:bg-muted/40",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="max-w-[200px] truncate text-sm font-medium">
                            {file.fileName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handlePreview(file)}
                          >
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-2"
                            onClick={() =>
                              handleDownload(file.id, file.fileName)
                            }
                          >
                            <Download className="h-3.5 w-3.5" />
                            <span className="text-xs">Download</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                    {attachments.length === 0 && (
                      <p className="py-4 text-center text-sm italic text-muted-foreground">
                        No attachments found.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Status & Timeline */}
            <div className="space-y-6">
              {isEditable && (
                <Card className="border-primary/20 bg-primary/5 shadow-md">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 text-primary">
                      <Edit2 className="h-4 w-4" />
                      <CardTitle className="text-sm">Action Required</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Councilors requested changes to this slip. You can update
                      the reason or re-upload documents to resolve technical
                      issues.
                    </p>
                    <Button
                      className="w-full gap-2"
                      onClick={handleEdit}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      Edit and Resubmit
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card className="border-0 bg-muted/40 shadow-md backdrop-blur-sm">
                <CardHeader className="border-b border-border/40 pb-3">
                  <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-4">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div className="h-10 w-0.5 bg-border" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium">Submitted</p>
                      <p className="text-[10px] text-muted-foreground">
                        {slip?.createdAt
                          ? format(
                              new Date(slip.createdAt),
                              "MMM d, yyyy · h:mm a",
                            )
                          : "---"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-2 w-2 rounded-full ${slip?.updatedAt !== slip?.createdAt ? "bg-primary" : "bg-muted"}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium">Last Activity</p>
                      <p className="text-[10px] text-muted-foreground">
                        {slip?.updatedAt
                          ? format(
                              new Date(slip.updatedAt),
                              "MMM d, yyyy · h:mm a",
                            )
                          : "---"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="px-2">
                <p className="text-[10px] text-muted-foreground">
                  Reference ID
                </p>
                <p className="break-all font-mono text-[10px]">{slip?.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PreviewModal
        slipId={id || ""}
        file={previewFile}
        isOpen={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        isImage={previewFile ? isImageFile(previewFile.fileName) : false}
        isPdf={previewFile ? isPdfFile(previewFile.fileName) : false}
        onDownload={() =>
          previewFile && handleDownload(previewFile.id, previewFile.fileName)
        }
      />
    </>
  );
}
