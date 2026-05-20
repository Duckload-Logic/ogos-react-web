import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink, FileText } from "lucide-react";

interface CORPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl?: string | null;
  studentName?: string;
}

export function CORPreviewDialog({
  isOpen,
  onClose,
  fileUrl,
  studentName = "Student",
}: CORPreviewDialogProps) {
  if (!fileUrl) return null;

  const fullUrl = `${import.meta.env.VITE_API_BASE_URL}${fileUrl}`;
  const isPdf = fileUrl.toLowerCase().endsWith(".pdf");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden border-none bg-background/95 backdrop-blur-md shadow-2xl rounded-[32px]">
        <DialogHeader className="p-6 border-b bg-card shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <FileText size={24} />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  COR Preview: {studentName}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Certificate of Registration verification document.
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 mr-8">
              <Button variant="outline" size="sm" className="rounded-xl gap-2" asChild>
                <a href={fullUrl} download target="_blank" rel="noreferrer">
                  <Download size={14} /> Download
                </a>
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl gap-2" asChild>
                <a href={fullUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={14} /> Full View
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 bg-muted/30 relative">
          {isPdf ? (
            <iframe
              src={`${fullUrl}#toolbar=0`}
              className="w-full h-full border-none"
              title="COR Preview"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8 overflow-auto">
              <img
                src={fullUrl}
                alt="COR Preview"
                className="max-w-full max-h-full object-contain rounded-lg shadow-xl"
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
