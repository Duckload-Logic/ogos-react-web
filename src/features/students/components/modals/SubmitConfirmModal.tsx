import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SubmitConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Confirmation modal before submitting the form
 */
export function SubmitConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
}: SubmitConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm border-0 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-t-lg">
          <CardTitle className="text-lg">Submit Form?</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-700 mb-6">
            Are you sure you want to submit this form? Once submitted, your data will be saved and you can view it in your profile.
          </p>
          <div className="flex gap-3">
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold"
            >
              Submit Form
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
