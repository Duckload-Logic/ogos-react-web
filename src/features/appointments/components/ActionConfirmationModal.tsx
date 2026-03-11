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
      <DialogContent className="sm:max-w-md animate-in fade-in zoom-in-95 duration-200">
        <DialogHeader>
          <DialogTitle>Confirm {action}</DialogTitle>
          <DialogDescription className="text-sm leading-relaxed">
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
              className="resize-none transition-all focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" 
          onClick={onClose}
              className="transition-all duration-200 hover:scale-105"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            className="transition-all duration-200 hover:scale-105"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
