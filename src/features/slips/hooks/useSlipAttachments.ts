import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { slipService, GetSlipAttachmentDownload } from "../services";
import { QUERY_KEYS } from "@/config/queryKeys";
import { CACHE_TIMING } from "@/config/constants";

/**
 * Hook to fetch metadata for all attachments of a specific slip
 */
export function useGetSlipAttachments(slipId?: string) {
  return useQuery({
    queryKey: [...QUERY_KEYS.slips.attachments(slipId || "")],
    queryFn: () => (slipId ? slipService.GetSlipAttachments(slipId) : []),
    enabled: !!slipId,
    staleTime: CACHE_TIMING.MEDIUM.staleTime,
    gcTime: CACHE_TIMING.MEDIUM.gcTime,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to handle downloading of attachments
 */
export function useDownloadAttachment() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadAttachment = async (
    slipId: string,
    attachmentId: string,
    fileName?: string,
  ) => {
    setIsDownloading(true);
    setError(null);
    try {
      const blob = await GetSlipAttachmentDownload(slipId, attachmentId, {
        handlerName: "useDownloadAttachment",
        stepName: "Download Attachment",
      });

      if (!blob) {
        throw new Error("Download failed: No response from server");
      }

      if (blob.size === 0) {
        try {
          const text = await blob.text();
          const errorData = JSON.parse(text);
          throw new Error(errorData.error || "Server returned empty file");
        } catch {
          throw new Error("Download failed: Empty file received");
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.body.appendChild(document.createElement("a"));
      link.href = url;
      link.setAttribute("download", fileName || `attachment-${attachmentId}`);
      link.click();

      setTimeout(() => {
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to download");
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadAttachment, isDownloading, error };
}

/**
 * Hook to fetch and provide a preview URL for an attachment
 */
export function useGetAttachmentPreview(slipId?: string, attachmentId?: string) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slipId || !attachmentId) {
      setPreviewUrl(null);
      return;
    }

    const fetchPreview = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const blob = await GetSlipAttachmentDownload(slipId, attachmentId, {
          handlerName: "useGetAttachmentPreview",
          stepName: "Download Attachment",
        });

        if (!blob || blob.size === 0) {
          throw new Error("Failed to load attachment");
        }

        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setPreviewUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreview();

    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [slipId, attachmentId]);

  return { previewUrl, isLoading, error };
}
