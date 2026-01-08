/**
 * ScheduleErrorAlert Component
 * Displays error messages with a close button
 */

import { AlertCircle } from "lucide-react";

export interface ScheduleErrorAlertProps {
  error: string;
  onClose: () => void;
}

export function ScheduleErrorAlert({ error, onClose }: ScheduleErrorAlertProps) {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="font-semibold text-red-900">{error}</p>
        </div>
        <button
          onClick={onClose}
          className="text-red-600 hover:text-red-800 font-semibold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
