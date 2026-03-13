import { useState } from "react";
import { GetSlipAttachmentDownload } from "../services";

export function useDownloadAttachment() {
  const [isDownloading, setIsDownloading] = useState(
    false,
  );
  const [error, setError] = useState<string | null>(null);

  const downloadAttachment = async (
    slipId: number,
    attachmentId: number,
    fileName?: string,
  ) => {
    setIsDownloading(true);
    setError(null);
    try {
      const blob = await GetSlipAttachmentDownload(
        slipId,
        attachmentId,
        {
          handlerName: 'useDownloadAttachment',
          stepName: 'Download Attachment',
        },
      );

      if (!blob) {
        const errorMsg =
          "Download failed: No response from server";
        setError(errorMsg);
        return;
      }

      if (blob.size === 0) {
        try {
          const text = await blob.text();
          const errorData = JSON.parse(text);
          const errorMsg =
            errorData.error ||
            "Download failed: Server returned empty";
          setError(errorMsg);
        } catch {
          const errorMsg =
            "Download failed: Empty file received";
          setError(errorMsg);
        }
        return;
      }
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        fileName || `attachment-${attachmentId}`,
      );

      document.body.appendChild(link);
      console.log(
        "[useDownloadAttachment] Triggering download",
      );
      link.click();

      // Cleanup: remove link and revoke URL
      setTimeout(() => {
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log(
          "[useDownloadAttachment] Cleanup completed",
        );
      }, 100);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to download attachment";
      setError(errorMessage);
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadAttachment, isDownloading, error };
}
