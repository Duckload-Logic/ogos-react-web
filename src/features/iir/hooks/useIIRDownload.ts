import { useState } from "react";
import { DownloadIIRPDF } from "../services/service";
import { useToast } from "@/context/hooks";

/**
 * Hook to handle downloading the student's IIR as a PDF.
 */
export function useIIRDownload() {
  const [isDownloading, setIsDownloading] = useState(false);
  const { triggerToast } = useToast();

  const downloadPDF = async (iirID: string) => {
    if (!iirID) {
      triggerToast("Invalid IIR ID");
      return;
    }

    setIsDownloading(true);
    try {
      const { blob, fileName } = await DownloadIIRPDF(iirID, {
        handlerName: "useIIRDownload",
        stepName: "Download PDF",
      });

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      triggerToast("IIR PDF downloaded successfully");
    } catch (error) {
      console.error("Failed to download IIR PDF:", error);
      triggerToast("Failed to download IIR PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return {
    downloadPDF,
    isDownloading,
  };
}
