import { useEffect, useState } from "react";
import { GetSlipAttachmentDownload } from "../services";

export function useGetAttachmentPreview(
  slipId?: number,
  attachmentId?: number,
) {
  const [previewUrl, setPreviewUrl] = useState<
    string | null
  >(null);
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
        const blob = await GetSlipAttachmentDownload(
          slipId,
          attachmentId,
          {
            handlerName: 'useGetAttachmentPreview',
            stepName: 'Download Attachment',
          },
        );

        if (!blob || blob.size === 0) {
          throw new Error("Failed to load attachment");
        }

        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      } catch (err) {
        const msg = err instanceof Error
          ? err.message
          : "Unknown error";
        setError(msg);
        setPreviewUrl(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreview();

    // Cleanup: revoke the object URL when unmounts
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [slipId, attachmentId]);

  return { previewUrl, isLoading, error };
}
