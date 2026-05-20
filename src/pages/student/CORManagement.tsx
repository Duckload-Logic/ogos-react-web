import { useState, useCallback, useMemo } from "react";
import { useAuth, useToast, usePageMetadata } from "@/context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  FileText,
  Eye,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { UploadCOR } from "@/features/student-core/services/corService";
import { cn } from "@/lib/utils";
import { validateCorFile } from "@/utils/corValidation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { getErrorMessage } from "@/lib/api";

export default function CORManagement() {
  const { user, refresh } = useAuth();
  const { triggerToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  usePageMetadata(
    useMemo(() => {
      return {
        title: "COR Management",
        showSubHeader: true,
        description:
          "Manage your current academic credentials and verification documents.",
        isLoading: false,
        badgeText: "Verified Student",
        badgeIcon: <ShieldCheck size={16} />,
      };
    }, [user]),
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateAndSelectCorFile = useCallback(
    async (file: File) => {
      const validation = await validateCorFile(file);

      if (!validation.isValid) {
        triggerToast(validation.error || "Please upload a valid COR file.");
        return false;
      }

      setSelectedFile(file);
      triggerToast("COR file verified. You may now confirm the upload.");
      return true;
    },
    [triggerToast],
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        await validateAndSelectCorFile(e.dataTransfer.files[0]);
      }
    },
    [validateAndSelectCorFile],
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const isValid = await validateAndSelectCorFile(e.target.files[0]);

      if (!isValid) {
        e.target.value = "";
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const validation = await validateCorFile(selectedFile);

      if (!validation.isValid) {
        triggerToast(validation.error || "Please upload a valid COR file.");
        setShowConfirm(false);
        return;
      }

      await UploadCOR(selectedFile);
      await refresh();
      setSelectedFile(null);
      triggerToast("COR uploaded and validated successfully!");
      setShowConfirm(false);
    } catch (error: any) {
      const errMsg = getErrorMessage(error);
      triggerToast(errMsg);
      setShowConfirm(false);
    } finally {
      setIsUploading(false);
    }
  };

  const corUrl = user?.studentCorUrl;
  const isPdf = corUrl?.toLowerCase().endsWith(".pdf");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto w-full max-w-[1400px] space-y-8 pb-12 duration-700">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Preview Section */}
        <div className="space-y-6 lg:col-span-2">
          <Card className="flex h-[750px] flex-col overflow-hidden rounded-[32px] border-white/20 bg-white/45 shadow-2xl backdrop-blur-xl dark:bg-white/[0.04]">
            <CardHeader className="shrink-0 border-b border-border/10 bg-white/20 p-8 dark:bg-white/[0.02]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                    <Eye size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-2xl font-bold">
                        Document Preview
                      </CardTitle>
                      {corUrl &&
                        (user?.isStudentCorValid ? (
                          <Badge className="flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-600">
                            <CheckCircle2 size={12} /> Valid COR
                          </Badge>
                        ) : (
                          <Badge
                            variant="destructive"
                            className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                          >
                            <AlertCircle size={12} /> Outdated COR
                          </Badge>
                        ))}
                    </div>
                    <CardDescription>
                      Visual inspection of your latest uploaded COR.
                    </CardDescription>
                  </div>
                </div>
                {corUrl && (
                  <Button
                    variant="outline"
                    className="gap-2 rounded-xl"
                    asChild
                  >
                    <a
                      href={`${import.meta.env.VITE_API_BASE_URL}${corUrl}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink size={16} /> Open Full View
                    </a>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="relative flex-1 overflow-hidden bg-muted/30 p-0">
              {corUrl ? (
                isPdf ? (
                  <iframe
                    src={`${import.meta.env.VITE_API_BASE_URL}${corUrl}#toolbar=0`}
                    className="h-full w-full border-none"
                    title="COR PDF Preview"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-8">
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}${corUrl}`}
                      alt="COR Preview"
                      className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                    />
                  </div>
                )
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-12 text-center text-muted-foreground">
                  <div className="rounded-full bg-muted p-8 opacity-20">
                    <FileText size={80} />
                  </div>
                  <div className="max-w-md">
                    <h3 className="mb-2 text-xl font-bold text-foreground">
                      No COR Uploaded Yet
                    </h3>
                    <p className="text-sm">
                      You haven't uploaded your Certificate of Registration for
                      the current term. Please use the upload zone to provide
                      one.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Upload and Info Section */}
        <div className="space-y-8">
          {/* Upload Card */}
          <Card className="overflow-hidden rounded-[32px] border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5 shadow-xl">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Upload
                  size={20}
                  className="text-primary"
                />
                Upload New COR
              </CardTitle>
              <CardDescription>
                Provide a scanned copy or clear photo of your latest COR.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div
                className={cn(
                  "group relative cursor-pointer rounded-[24px] border-2 border-dashed p-10 text-center transition-all duration-300",
                  dragActive
                    ? "scale-95 border-primary bg-primary/10"
                    : "border-border/30 hover:border-primary/50 hover:bg-primary/5",
                  selectedFile ? "border-green-500/50 bg-green-500/5" : "",
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("cor-upload")?.click()}
              >
                <input
                  id="cor-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                />

                <AnimatePresence mode="wait">
                  {selectedFile ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                        <CheckCircle2 size={32} />
                      </div>
                      <div>
                        <p className="mx-auto max-w-[200px] truncate font-bold text-foreground">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
                        <Upload size={32} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold">Click or drag file here</p>
                        <p className="text-xs text-muted-foreground">
                          PDF, JPG, or PNG (Max 5MB). Filename should include
                          "COR" or "Certificate of Registration".
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {selectedFile && (
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    disabled={isUploading}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 rounded-xl shadow-lg shadow-primary/20"
                    onClick={() => setShowConfirm(true)}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <ShieldCheck className="mr-2 h-4 w-4" />
                    )}
                    Confirm Upload
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guidelines Card */}
          <Card className="rounded-[32px] border-white/20 bg-white/45 shadow-xl backdrop-blur-xl dark:bg-white/[0.04]">
            <CardHeader className="p-8">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <AlertCircle
                  size={20}
                  className="text-amber-500"
                />
                Upload Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-8 pt-0">
              <ul className="space-y-3 text-sm font-medium text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    The file name must contain the words "COR" or "Certificate
                    of Registration"
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    Ensure all text is readable and the document is not blurry.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    The document must show your name, student number, and
                    current term.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    Uploads are verified by extension, file signature, and COR
                    keywords in the filename or PDF metadata.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  <span>
                    For PDF files, please ensure they are not password
                    protected.
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
      >
        <AlertDialogContent className="rounded-2xl backdrop-blur-xl dark:bg-slate-900/80">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">
              Confirm COR Upload
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to upload this Certificate of Registration?
              The system will automatically check if it is valid for the current
              academic term.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isUploading}
              className="rounded-xl"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isUploading}
              onClick={(e) => {
                e.preventDefault();
                handleUpload();
              }}
              className="rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95"
            >
              {isUploading ? "Uploading..." : "Upload COR"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AnimatePresence>
        {isUploading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/30 backdrop-blur-md"
          >
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/25 bg-white/45 p-10 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.045]">
              <div className="relative">
                <RefreshCw
                  size={48}
                  className="animate-spin text-primary"
                />
                <div className="absolute inset-0 animate-ping rounded-full border border-primary/20" />
              </div>
              <div className="space-y-1 text-center">
                <h3 className="text-lg font-bold text-foreground">
                  Processing COR
                </h3>
                <p className="max-w-[280px] text-sm text-muted-foreground">
                  Extracting document details and validating academic term.
                  Please wait...
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
