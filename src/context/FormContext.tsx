import React, { createContext, useContext, useState, ReactNode } from "react";

interface FormContextType {
  autoSaveStatus: "saving" | "saved" | "idle";
  lastSaved: string;
  setAutoSaveStatus: (status: "saving" | "saved" | "idle") => void;
  setLastSaved: (time: string) => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "saving" | "saved" | "idle"
  >("idle");
  const [lastSaved, setLastSaved] = useState<string>("");

  return (
    <FormContext.Provider
      value={{
        autoSaveStatus,
        lastSaved,
        setAutoSaveStatus,
        setLastSaved,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within FormProvider");
  }
  return context;
};
