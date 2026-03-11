import { Clock, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
  appointment: any;
  formatTime: (time: string) => string;
  onView: () => void;
}

export default function ActivityFeed({
  appointment,
  formatTime,
  onView,
}: Props) {
  return (
    <Card className="lg:col-span-3 rounded-md border-border shadow-sm bg-gradient-to-r from-card to-muted/20">
      <CardContent className="p-6 h-full flex flex-col justify-center">
        {appointment ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-4 rounded-full bg-primary animate-pulse" />

                <span className="text-sm font-medium text-primary flex items-center gap-1">
                  <Clock className="size-3" />
                  {formatTime(appointment.timeSlot.time)}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight">
                  {appointment.user?.firstName} {appointment.user?.lastName}
                </h3>

                <div className="flex gap-2 items-center">
                  <Tag className="size-3 text-muted-foreground" />

                  <p className="text-sm text-muted-foreground">
                    {appointment.appointmentCategory.name}
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={onView} className="rounded-md shadow-sm px-6">
              View Details
            </Button>
          </div>
        ) : (
          <div className="text-center md:text-left">
            <p className="text-muted-foreground italic font-medium">
              No upcoming appointments recorded for the current timeframe.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}