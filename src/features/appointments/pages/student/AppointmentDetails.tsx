import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppointment, useCancelAppointment } from "@/features/appointments/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  X,
  FileCheck,
  AlertCircle,
  MessageSquare,
  User,
  ExternalLink
} from "lucide-react";
import { usePageMetadata } from "@/components/layout/Layout";
import { AnimationStyles } from "@/components/ui/animations";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/context";
import { format } from "date-fns";

export default function AppointmentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { triggerToast } = useToast();

  const { data: appointment, isLoading, isError } = useAppointment(id || "");
  const { mutate: cancelAppointment, isPending: isCancelling } = useCancelAppointment();
  
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  usePageMetadata({
    title: "Appointment Details",
    description: "View and manage your scheduled counseling appointment.",
    badgeText: appointment?.status?.name || "Loading",
    badgeIcon: appointment?.status?.name === "Approved" ? <FileCheck className="h-4 w-4" /> : <Calendar className="h-4 w-4" />,
    isLoading: isLoading,
  });

  const handleCancel = () => {
    if (!id || !cancelReason.trim()) return;
    
    cancelAppointment({ id, reason: cancelReason }, {
      onSuccess: () => {
        triggerToast("Appointment cancelled successfully");
        setIsCancelModalOpen(false);
        navigate("/student/appointments");
      },
      onError: (error: any) => {
        triggerToast(error.message || "Failed to cancel appointment");
      }
    });
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold">Appointment not found</h2>
        <Button variant="link" onClick={() => navigate("/student/appointments")}>
          Back to list
        </Button>
      </div>
    );
  }

  const isCancellable =
    appointment?.status?.name === "Pending" ||
    appointment?.status?.name === "Scheduled";

  return (
    <>
      <AnimationStyles />
      <div className="min-h-full bg-background">
        <div className="max-w-full py-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Left Column: Primary Details */}
            <div className="md:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg bg-card/60 backdrop-blur-md">
                <CardHeader className="border-b border-border/60 pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-xl">Appointment Information</CardTitle>
                    </div>
                    <Badge
                      className={`px-3 py-1 ${appointment?.status?.colorKey || "bg-muted text-muted-foreground"
                        }`}
                    >
                      {appointment?.status?.name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {appointment?.whenDate ? format(new Date(appointment.whenDate), "MMMM d, yyyy") : "---"}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Time</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{appointment?.timeSlot.time || "---"}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{appointment?.appointmentCategory.name}</Badge>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</p>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Guidance Office (Main Bldg)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/40">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">My Reason / Concern</p>
                    <div className="p-4 rounded-lg bg-muted/50 border border-border/40">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap italic">
                        "{appointment?.reason}"
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {appointment?.adminNotes && (
                <Card className="border-border/60 shadow-md bg-amber-50/10 dark:bg-amber-950/5">
                  <CardHeader className="py-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-amber-500" />
                      <CardTitle className="text-sm">Counselor Remarks</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-5 pt-0">
                    <p className="text-sm text-foreground/90 leading-relaxed italic">
                      {appointment.adminNotes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column: Actions & Metadata */}
            <div className="space-y-6">
              <Card className="border-0 shadow-md bg-muted/30">
                <CardHeader className="pb-3 border-b border-border/40">
                  <CardTitle className="text-sm font-semibold uppercase">Management</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {isCancellable ? (
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">
                        Changed your mind? You can cancel your appointment if it is still pending or scheduled.
                      </p>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => setIsCancelModalOpen(true)}
                        disabled={isCancelling}
                      >
                        {isCancelling ? "Processing..." : "Cancel Appointment"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/30">
                      <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700 dark:text-blue-300">
                        This appointment is already {appointment?.status?.name?.toLowerCase()} and cannot be modified.
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <p className="text-[10px] text-center text-muted-foreground">
                      ID: {appointment?.id}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Please provide a reason for cancelling your appointment. This helps our counselors understand your situation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Cancellation</Label>
              <Textarea
                id="reason"
                placeholder="e.g., I have a class conflict, I'm feeling better, etc."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="min-h-[100px]"
              />
              <p className="text-[10px] text-muted-foreground italic">
                * This reason will be shared with the Guidance Office.
</p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => setIsCancelModalOpen(false)}
              disabled={isCancelling}
            >
              Go Back
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={!cancelReason.trim() || isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
