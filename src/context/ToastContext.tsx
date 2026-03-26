import React, { createContext, useContext, useState, useCallback } from "react";

interface ToastContextType {
  toasts: string[];
  triggerToast: (message: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<string[]>([]);

  const triggerToast = useCallback((message: string) => {
    setToasts((prev) => [...prev, message]);

    setTimeout(() => {
      setToasts((prev) => prev.slice(1));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, triggerToast }}>
      {children}
    </ToastContext.Provider>
  );
};

