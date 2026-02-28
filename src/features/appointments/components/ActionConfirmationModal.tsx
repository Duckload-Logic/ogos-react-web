import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components";
import { Textarea } from "@/components/ui/textarea"; // adjust import

interface ActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (message?: string) => Promise<boolean>;
  action: string;
  requiresMessage: boolean;
}

export default function ActionConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  requiresMessage,
}: ActionConfirmModalProps) {
  const [message, setMessage] = useState("");

  const handleConfirm = async () => {
    const success = await onConfirm(requiresMessage ? message : undefined);
    if (success) {
      setMessage("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm {action}</DialogTitle>
          <DialogDescription>
            Are you sure you want to {action.toLowerCase()} this appointment?
            {requiresMessage && " Please provide a reason (optional)."}
          </DialogDescription>
        </DialogHeader>

        {requiresMessage && (
          <div className="py-4">
            <Textarea
              placeholder="Enter reason or message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
