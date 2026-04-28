import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { UIContext, PageMetadata } from "./UIContext";
import { ToastContext } from "./ToastContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

/**
 * Hook for child pages to set layout metadata when using Shared Layout
 */
export function usePageMetadata(metadata: Partial<PageMetadata>) {
  const { setPageMetadata } = useUI();

  useEffect(() => {
    setPageMetadata((prev) => {
      // Shallow comparison of primitive metadata fields only
      // React nodes (like badgeIcon) should be skipped to prevent infinite loops
      const hasChanged = Object.entries(metadata).some(([key, value]) => {
        if (typeof value === "object" && value !== null) return false;
        return prev[key as keyof PageMetadata] !== value;
      });

      if (!hasChanged) return prev;
      return { ...prev, ...metadata };
    });

    // Clean up metadata when the component unmounts to prevent stale data
    // on the next page (e.g., persistent stats or actions)
    return () => {
      setPageMetadata({
        title: "",
        description: undefined,
        badgeText: undefined,
        badgeIcon: undefined,
        headerActions: undefined,
        headerStats: undefined,
        showDate: false,
        isLoading: false,
      });
    };
  }, [
    metadata.title,
    metadata.description,
    metadata.badgeText,
    metadata.showDate,
    metadata.isLoading,
    setPageMetadata,
  ]);
}
