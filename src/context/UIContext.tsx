import React, { createContext, useContext, useState, useCallback } from "react";

export interface PageMetadata {
  title: string;
  description?: string;
  badgeText?: string;
  badgeIcon?: React.ReactNode;
  headerActions?: React.ReactNode;
  headerStats?: React.ReactNode;
  showDate?: boolean;
  isLoading?: boolean;
}

interface UIContextType {
  sidebarExpanded: boolean;
  setSidebarExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  toggleSidebar: () => void;
  pageMetadata: PageMetadata;
  setPageMetadata: React.Dispatch<React.SetStateAction<PageMetadata>>;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [pageMetadata, setPageMetadata] = useState<PageMetadata>({
    title: "",
  });

  const toggleSidebar = useCallback(() => {
    setSidebarExpanded((prev) => !prev);
  }, []);

  return (
    <UIContext.Provider
      value={{
        sidebarExpanded,
        setSidebarExpanded,
        toggleSidebar,
        pageMetadata,
        setPageMetadata,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
