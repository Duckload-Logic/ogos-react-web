import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  Ban,
  RefreshCw,
  Download,
  Eye,
  Clock,
} from "lucide-react";
import type { Slip } from "../types/slip";
import { SlipAttachmentsGrid } from "./SlipAttachmentsGrid";
import { STATUS_COLORS } from "@/config/constants";
import { useGetSlipAttachments } from "../hooks";

interface SlipViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  slip: Slip | null;
  isAdmin?: boolean;
  onApprove: (id: number) => void;
  onReject: (id: number, reason: string) => void;
  onForRevision: (id: number, reason: string) => void;
  isLoading?: boolean;
}

type ActionType = "approve" | "reject" | "revision" | null;

export function SlipViewModal({
  isOpen,
  onClose,
  slip,
  isAdmin = false,
  onApprove,
  onReject,
  onForRevision,
  isLoading = false,
}: SlipViewModalProps) {
  const [actionType, setActionType] = useState<ActionType>(null);
  const [reason, setReason] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const { data: attachments } = useGetSlipAttachments(Number(slip?.id));

  if (!slip) return null;

  const handleActionConfirm = () => {
    if (actionType === "approve") {
      onApprove(Number(slip.id));
    } else if (actionType === "reject") {
      if (!reason.trim()) {
        alert("Please provide a reason for rejection");
        return;
      }
      onReject(Number(slip.id), reason);
    } else if (actionType === "revision") {
      if (!reason.trim()) {
        alert("Please provide revision notes");
        return;
      }
      onForRevision(Number(slip.id), reason);
    }
    handleCloseModal();
  };

  const handleActionClick = (type: ActionType) => {
    setActionType(type);
    setIsConfirming(true);
  };

  const handleCloseModal = () => {
    setActionType(null);
    setReason("");
    setIsConfirming(false);
    onClose();
  };

  const getStatusColor = (colorKey?: string) => {
    if (!colorKey) return "bg-gray-100 text-gray-800";
    const key = colorKey as keyof typeof STATUS_COLORS;
    return STATUS_COLORS[key] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (colorKey?: string) => {
    switch (colorKey) {
      case "success":
        return <CheckCircle2 className="w-4 h-4" />;
      case "danger":
        return <Ban className="w-4 h-4" />;
      case "warning":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const isPending =
    slip.status?.name?.toLowerCase() === "pending" ||
    slip.status?.name?.toLowerCase() === "for revision";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto md:overflow-hidden flex flex-col w-[95vw] sm:w-full animate-in zoom-in-95 fade-in duration-200">
          <DialogHeader>
            <DialogTitle>Excuse Slip Details</DialogTitle>
            <DialogDescription>
              Review and manage excuse slip submission
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden animate-in fade-in duration-300">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 overflow-y-auto pr-4 space-y-6">
              {/* Student Info Card */}
              <Card className="transition-all duration-200 hover:shadow-md">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Student Name
                      </p>
                      <p className="text-lg font-semibold text-foreground mt-1">
                        {/* @ts-ignore */}
                        {slip.user?.firstName} {slip.user?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Status
                      </p>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(slip.status?.colorKey)} mt-1`}
                      >
                        {getStatusIcon(slip.status?.colorKey)}
                        {slip.status?.name}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Date of Absence
                      </p>
                      <p className="text-lg font-semibold text-foreground mt-1">
                        {new Date(slip.dateOfAbsence).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Date Needed
                      </p>
                      <p className="text-lg font-semibold text-foreground mt-1">
                        {new Date(slip.dateNeeded).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Submitted
                      </p>
                      <p className="text-lg font-semibold text-foreground mt-1">
                        {new Date(slip.createdAt || "").toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Reason Card */}
              <Card className="transition-all duration-200 hover:shadow-md">
                <CardContent className="pt-6">
                  <p className="text-sm font-medium text-muted-foreground">
                    Reason for Absence
                  </p>
                  <p className="text-foreground mt-2">{slip.reason}</p>
                </CardContent>
              </Card>

              {/* Admin Notes Card (if exists) */}
              {slip.adminNotes && (
                <Card className="border-info-foreground border-0 border-l-4 bg-muted/20 transition-all duration-200 hover:shadow-sm">
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium text-info-foreground">
                      Admin Notes
                    </p>
                    <p className="text-info-foreground mt-2">
                      {slip.adminNotes}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Admin Actions */}
              {isAdmin && isPending && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handleActionClick("approve")}
                    disabled={isLoading}
                    className="gap-2 bg-green-600 hover:bg-green-700 transition-all duration-200 hover:scale-105"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleActionClick("revision")}
                    disabled={isLoading}
                    variant="outline"
                    className="gap-2 transition-all duration-200 hover:scale-105"
                  >
                    <RefreshCw className="w-4 h-4" />
                    For Revision
                  </Button>
                  <Button
                    onClick={() => handleActionClick("reject")}
                    disabled={isLoading}
                    variant="destructive"
                    className="gap-2 transition-all duration-200 hover:scale-105"
                  >
                    <Ban className="w-4 h-4" />
                    Reject
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column - Attachments (Scrollable) */}
            <div className="lg:col-span-1 overflow-y-auto">
              {attachments && attachments.length > 0 && (
                <Card className="h-fit transition-all duration-200 hover:shadow-md">
                  <CardContent className="pt-6">
                    <p className="text-sm font-medium text-muted-foreground mb-4">
                      Attachments
                    </p>
                    <SlipAttachmentsGrid
                      slipId={slip.id || 0}
                      files={attachments}
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog
        open={isConfirming}
        onOpenChange={(open) => {
          if (!open) {
            setActionType(null);
            setReason("");
          }
          setIsConfirming(open);
        }}
      >
        <AlertDialogContent className="animate-in fade-in zoom-in-95 duration-200">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve"
                ? "Approve Excuse Slip"
                : actionType === "reject"
                  ? "Reject Excuse Slip"
                  : "Send for Revision"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "approve"
                ? "Are you sure you want to approve this excuse slip?"
                : "Please provide a reason for this action."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {(actionType === "reject" || actionType === "revision") && (
            <div className="py-4">
              <Textarea
                placeholder={
                  actionType === "reject"
                    ? "Reason for rejection..."
                    : "Revision notes for student..."
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-24"
              />
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleActionConfirm}
              disabled={isLoading}
              className={
                actionType === "reject"
                  ? "bg-red-600 hover:bg-red-700"
                  : actionType === "revision"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
              }
            >
              {actionType === "approve" ? "Approve" : "Confirm"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
