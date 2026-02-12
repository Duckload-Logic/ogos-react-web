import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

interface SubmitSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Success modal after form submission
 */
export function SubmitSuccessModal({
  isOpen,
  onClose,
}: SubmitSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-500 text-white rounded-t-lg">
          <CardTitle className="text-lg flex items-center gap-2">
            <Check className="w-6 h-6" />
            Form Submitted Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-700 mb-2">
            Your Personal Data Sheet has been successfully submitted.
          </p>
          <p className="text-gray-600 text-sm mb-6">
            Your data is now saved in your profile and can be viewed at any time. Thank you for completing the form.
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
