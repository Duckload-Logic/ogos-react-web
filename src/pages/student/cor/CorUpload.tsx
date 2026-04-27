import { useState } from "react";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast, useAuth } from "@/context";
import { UploadIIRCor } from "@/features/iir/services/service";
import { useUserIIR } from "@/features/iir/hooks";
import { cn } from "@/lib/utils";

export default function CorUpload() {
  const { triggerToast } = useToast();
  const { user } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // GET IIR DATA
  const { data: studentIIR } = useUserIIR(user?.id);

  const iirId =
    (studentIIR as any)?.id ||
    (studentIIR as any)?.iirId ||
    (studentIIR as any)?.student?.personalInfo?.id;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(selectedFile.type)) {
      triggerToast("Please upload COR as PDF, JPG, or PNG.");
      e.target.value = "";
      return;
    }

    if (selectedFile.size > maxSize) {
      triggerToast("COR file must be 5MB or smaller.");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;

    if (!iirId) {
      triggerToast("Please complete your IIR profile first.");
      return;
    }

    setIsUploading(true);

    try {
      await UploadIIRCor(String(iirId), file);
      triggerToast("COR uploaded successfully.");
      setFile(null);
    } catch (error) {
      console.error("COR upload failed:", error);
      triggerToast("Unable to upload COR. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="mx-auto mt-6 w-full max-w-5xl rounded-[28px] border border-border bg-card shadow-sm">
      <CardContent className="p-7">
        <div className="mb-6 flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText size={22} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Certificate of Registration (COR)
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload your current COR as PDF, JPG, or PNG. Maximum file size is 5MB.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
          <label
            className={cn(
              "flex min-h-[84px] flex-1 cursor-pointer flex-col justify-center",
              "rounded-2xl border border-dashed border-primary/30 bg-background",
              "px-6 transition hover:border-primary/50 hover:bg-primary/5",
            )}
          >
            <span className="text-sm font-bold text-foreground">
              {file ? file.name : "Choose COR file"}
            </span>
            <span className="mt-1 text-sm text-muted-foreground">
              PDF, JPG, or PNG up to 5MB
            </span>

            <input
              type="file"
              className="hidden"
              accept="application/pdf,image/jpeg,image/png"
              onChange={handleFileChange}
            />
          </label>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="h-[84px] rounded-2xl px-8 text-sm font-bold lg:min-w-[180px]"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload COR"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}