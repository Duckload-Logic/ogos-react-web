import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  LoaderCircle,
} from "lucide-react";
import { SlipAttachment } from "../types";
import { useDownloadAttachment } from "../hooks/useDownloadAttachment";
import { useGetAttachmentPreview } from "../hooks/useGetAttachmentPreview";

interface SlipAttachmentsGridProps {
  slipId: number;
  files: SlipAttachment[];
}

// Sub-component for preview modal with authorized image loading
function PreviewModal({
  file,
  slipId,
  isOpen,
  onOpenChange,
  onDownload,
  isDownloading,
  error,
  isImageFile,
  isPdfFile,
}: {
  file: SlipAttachment;
  slipId: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload: () => void;
  isDownloading: boolean;
  error: string | null;
  isImageFile: (url: string) => boolean;
  isPdfFile: (url: string) => boolean;
}) {
  const { previewUrl, isLoading } = useGetAttachmentPreview(slipId, file.id);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogDescription>
            File preview - Use download button to save the file
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-4">
          {isLoading ? (
            <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
              <LoaderCircle className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : isImageFile(file.fileName) && previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-96 rounded-lg"
            />
          ) : isPdfFile(file.fileName) ? (
            <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-12 h-12 text-red-500 mx-auto mb-2" />
                <p className="text-muted-foreground">
                  PDF Preview not available in browser
                </p>
                <span className="text-muted-foreground/85 text-xs">
                  Please download the file to view its contents.
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                <p className="text-muted-foreground">
                  Preview not available for this file type
                </p>
                <Button
                  onClick={onDownload}
                  className="w-full gap-2"
                  disabled={isDownloading}
                >
                  {isDownloading ? (
                    <span className="animate-spin">
                      <LoaderCircle className="w-4 h-4" />
                    </span>
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  {isDownloading ? "Downloading..." : "Download File"}
                </Button>
              </div>
            </div>
          )}

          <Button
            onClick={onDownload}
            className="w-full gap-2"
            disabled={isDownloading}
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Downloading..." : "Download File"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Sub-component for individual attachment with preview URL
function AttachmentItem({
  slipId,
  file,
  index,
  onPreview,
  isImageFile,
  getFileExtension,
  getFileName,
}: {
  slipId: number;
  file: SlipAttachment;
  index: number;
  onPreview: (file: SlipAttachment) => void;
  isImageFile: (url: string) => boolean;
  getFileExtension: (url: string) => string;
  getFileName: (url: string) => string;
}) {
  const { previewUrl, isLoading } = useGetAttachmentPreview(slipId, file.id);

  return (
    <div
      key={index}
      className="relative group rounded-lg border border-border bg-card hover:bg-accent transition-colors overflow-hidden"
    >
      <div
        className="aspect-square flex items-center justify-center bg-muted p-2 hover:cursor-pointer hover:brightness-50"
        onClick={() => onPreview(file)}
      >
        {isLoading ? (
          <div className="flex items-center justify-center w-full h-full">
            <LoaderCircle className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : isImageFile(file.fileName) && previewUrl ? (
          <img
            src={previewUrl}
            alt={`Attachment ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : isImageFile(file.fileName) ? (
          <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
            <ImageIcon className="w-10 h-10 text-muted-foreground" />
            <span className="text-xs text-center font-medium">
              Failed to load image
            </span>
          </div>
        ) : file.fileName.toLowerCase().endsWith(".pdf") ? (
          <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
            <FileText className="w-10 h-10 text-red-500" />
            <span className="text-xs text-center font-medium">PDF</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 w-full h-full">
            <FileText className="w-10 h-10 text-blue-500" />
            <span className="text-xs text-center font-medium">
              {getFileExtension(file.fileName).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* File name tooltip */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 hidden group-hover:block">
        <p className="text-xs text-white truncate">
          {getFileName(file.fileName)}
        </p>
      </div>
    </div>
  );
}

export function SlipAttachmentsGrid({
  slipId,
  files,
}: SlipAttachmentsGridProps) {
  const [selectedFile, setSelectedFile] = useState<SlipAttachment | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { downloadAttachment, isDownloading, error } = useDownloadAttachment();

  if (!files || files.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No attachments uploaded</p>
    );
  }

  const getFileExtension = (url: string) => {
    const parts = url.split(".");
    return parts[parts.length - 1].toLowerCase();
  };

  const isImageFile = (url: string) => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    return imageExtensions.includes(getFileExtension(url));
  };

  const isPdfFile = (url: string) => {
    return getFileExtension(url) === "pdf";
  };

  const getFileName = (url: string) => {
    const parts = url.split("/");
    return decodeURIComponent(parts[parts.length - 1]);
  };

  const handlePreview = (file: SlipAttachment) => {
    setSelectedFile(file);
    setIsPreviewOpen(true);
  };

  const handleDownload = (file: SlipAttachment) => {
    const fileName = getFileName(file.fileName);
    downloadAttachment(slipId, file.id, fileName);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {files.map((file, index) => (
          <AttachmentItem
            key={index}
            slipId={slipId}
            file={file}
            index={index}
            onPreview={handlePreview}
            isImageFile={isImageFile}
            getFileExtension={getFileExtension}
            getFileName={getFileName}
          />
        ))}
      </div>

      {/* Preview Modal */}
      {selectedFile && (
        <PreviewModal
          file={selectedFile}
          slipId={slipId}
          isOpen={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
          onDownload={() => handleDownload(selectedFile)}
          isDownloading={isDownloading}
          error={error}
          isImageFile={isImageFile}
          isPdfFile={isPdfFile}
        />
      )}
    </>
  );
}
