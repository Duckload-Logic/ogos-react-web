import { Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { STATUS_COLORS } from "@/config/constants";
import { format12HourTime } from "@/features/appointments/utils";

interface Props {
  appointments: any[];
  onView: (apt: any) => void;
  isLoading: boolean;
}

export default function QueueTable({
  appointments,
  onView,
  isLoading,
}: Props) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          Today's Queue
        </h2>

        <span className="text-xs text-muted-foreground">
          {appointments.length} entries
        </span>
      </div>

      <Card className="border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-muted/40 border-b border-border">
                <th className="p-4 text-xs font-bold text-muted-foreground">
                  Student
                </th>

                <th className="p-4 text-xs font-bold text-muted-foreground">
                  Appointment
                </th>

                <th className="p-4 text-xs font-bold text-muted-foreground">
                  Status
                </th>

                <th className="p-4 text-xs font-bold text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-sm">
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-sm italic text-muted-foreground">
                    No appointments today
                  </td>
                </tr>
              ) : (
                appointments.map((apt) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-muted/30 transition-all"
                  >
                    <td className="p-4 font-semibold">
                      {apt.user?.firstName} {apt.user?.lastName}
                    </td>

                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {format12HourTime(apt.timeSlot.time)}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {apt.appointmentCategory.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded-full border font-bold ${
                          STATUS_COLORS[apt.status?.colorKey || "info"]
                        }`}
                      >
                        {apt.status?.name}
                      </span>
                    </td>

                    <td className="p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onView(apt)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="size-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </Card>
    </section>
  );
}