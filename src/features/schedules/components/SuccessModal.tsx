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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-sm w-full border-0 shadow-xl">
        <div className="bg-green-600 text-white px-6 py-4 flex items-center gap-3 rounded-t-lg">
          <CheckCircle className="w-6 h-6" />
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <CardContent className="pt-6 pb-6 text-center">
          <p className="text-gray-700 mb-6">{message}</p>
          <Button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            Done
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
