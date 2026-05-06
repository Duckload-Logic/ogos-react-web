import { useState } from "react";
import { DownloadIIRPDF } from "../services/service";
import { useToast } from "@/context/hooks";

/**
 * Hook to handle downloading the student's IIR as a PDF.
 */
export function useIIRDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { triggerToast } = useToast();

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string>("");

  const generatePreview = async (iirID: string) => {
    if (!iirID) {
      triggerToast("Invalid IIR ID");
      return;
    }

    setIsDownloading(true);
    try {
      const { blob, fileName } = await DownloadIIRPDF(iirID, {
        handlerName: "useIIRDownload",
        stepName: "Generate PDF Preview",
      });

      const pdfBlob = new Blob([blob], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      setCurrentFileName(fileName);
    } catch (error) {
      console.error("Failed to generate IIR PDF preview:", error);
      triggerToast("Failed to generate IIR PDF preview. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadFromPreview = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.setAttribute("download", currentFileName || "iir_record.pdf");
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    triggerToast("IIR PDF downloaded successfully");
  };

  const clearPreview = () => {
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
      setCurrentFileName("");
    }
  };

  return {
    generatePreview,
    downloadFromPreview,
    clearPreview,
    pdfUrl,
    isDownloading,
  };
}
