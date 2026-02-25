/**
 * LoadingSpinner Component
 * Reusable loading indicator
 */

import { Label } from "@radix-ui/react-label";
import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text,
}) => {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-32 h-32",
    lg: "w-38 h-38",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 h-full w-full">
      <div
        className={`${sizeClasses[size]} border-8 aspect-square border-border border-t-primary rounded-full animate-spin`}
      />
      <Label className="text-sm font-semibold text-muted-foreground">
        Loading...
      </Label>
    </div>
  );
};
