import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, Trash2 } from "lucide-react";

export interface SlipDocumentUploadSectionProps {
  title: string;
  description: string;
  files: File[];
  onFilesAdd: (files: FileList | null) => void;
  onFileRemove: (index: number) => void;
  optional?: boolean;
}

export function SlipDocumentUploadSection({
  title,
  description,
  files,
  onFilesAdd,
  onFileRemove,
  optional = false,
}: SlipDocumentUploadSectionProps) {
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
            {files.map((file: File, index: number) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
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
                  className="p-1 hover:bg-destructive/20 rounded transition-colors shrink-0"
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
