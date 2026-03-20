/**
 * Legal Consent Dialog for IIR Form Submission
 * Displays terms of use and privacy policy acknowledgment
 */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LegalConsentDialogProps {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function LegalConsentDialog({
  open,
  onAccept,
  onCancel,
  isSubmitting = false,
}: LegalConsentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !isSubmitting && onCancel()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Confirm Submission</DialogTitle>
          <DialogDescription className="text-base pt-4">
            I confirm that the information given is legitimate and accurate, and that this
            information will be processed in our system under the terms of use and privacy
            policy of the{' '}
            <a
              href="https://www.pup.edu.ph"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-primary/80 font-medium"
            >
              Polytechnic University of the Philippines
            </a>{' '}
            website.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="border border-border hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onAccept}
            disabled={isSubmitting}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Submitting...
              </>
            ) : (
              'I Agree & Submit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
