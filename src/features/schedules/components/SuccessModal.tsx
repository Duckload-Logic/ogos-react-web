/**
 * SuccessModal Component
 * Displays a success confirmation dialog
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export function SuccessModal({
  isOpen,
  title,
  message,
  onClose,
}: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <Card className="w-full max-w-sm border-0 shadow-xl">
        <div className="flex items-center gap-3 rounded-t-lg bg-green-600 px-6 py-4 text-white">
          <CheckCircle className="h-6 w-6" />
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <CardContent className="pb-6 pt-6 text-center">
          <p className="mb-6 text-gray-700">{message}</p>
          <Button
            onClick={onClose}
            className="w-full bg-green-600 font-semibold text-white hover:bg-green-700"
          >
            Done
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
