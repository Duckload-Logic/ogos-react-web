import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface ClearSuccessModalProps {
  isOpen: boolean;
  currentSectionTitle: string;
  onClose: () => void;
}

/**
 * Success confirmation modal after clearing section data
 */
export function ClearSuccessModal({
  isOpen,
  currentSectionTitle,
  onClose,
}: ClearSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <Check className="w-6 h-6" />
            Section Cleared Successfully
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-700 mb-6">
            All data in the "{currentSectionTitle}" section has been cleared.
          </p>
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
