import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileUp, Trash2, CheckCircle2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface SlipDocumentUploadSectionProps {
  number?: number;
  title: string;
  description: string;
  files: File[];
  onFilesAdd: (files: FileList | null) => void;
  onFileRemove: (index: number) => void;
  optional?: boolean;
}

export function SlipDocumentUploadSection({
  number,
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
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        {/* Header with number and status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3 flex-1">
            {number !== undefined && (
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-semibold text-foreground shrink-0">
                {number}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground">{title}</h3>
                <Badge variant={optional ? "secondary" : "destructive"} className="text-xs">
                  {optional ? "Optional" : "Required"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
          </div>
          {files.length > 0 && (
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
          )}
        </div>

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
                : "border-border/60 hover:border-primary/50"
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
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, JPG, PNG, DOC up to 5MB
            </p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2 mt-3">
            {files.map((file: File, index: number) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-2.5 bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-900/40 rounded-md"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      {file.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onFileRemove(index)}
                  className="p-0.5 hover:bg-red-100/50 dark:hover:bg-red-950/30 rounded transition-colors shrink-0"
                  aria-label="Remove file"
                >
                  <X className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
