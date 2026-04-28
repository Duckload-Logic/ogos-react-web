/**
 * ScheduleErrorAlert Component
 * Displays error messages with a close button
 */

import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScheduleErrorAlertProps {
  error: string;
  onClose: () => void;
}

export function ScheduleErrorAlert({
  error,
  onClose,
}: ScheduleErrorAlertProps) {
  return (
    <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 md:px-8">
      <div
        className={cn(
          "flex items-center justify-between rounded-lg border",
          "border-red-200 bg-red-50 p-4",
        )}
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="font-semibold text-red-900">{error}</p>
        </div>
        <button
          onClick={onClose}
          className="font-semibold text-red-600 hover:text-red-800"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
