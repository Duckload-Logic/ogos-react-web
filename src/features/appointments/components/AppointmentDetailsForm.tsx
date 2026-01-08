import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AppointmentDetailsFormProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  reason: string;
  onReasonChange: (reason: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  isSubmitting: boolean;
}

export default function AppointmentDetailsForm({
  selectedDate,
  selectedTime,
  reason,
  onReasonChange,
  onSubmit,
  isLoading,
  isSubmitting,
}: AppointmentDetailsFormProps) {
  const isFormValid = selectedDate && selectedTime && reason.trim();

  return (
    <Card className="border-0 shadow-sm mt-8">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <CardTitle className="text-lg">Appointment Details</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Reason/Concern Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Concern Category
            </label>
            <textarea
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              className="w-full border rounded p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="Enter your concern or reason for appointment"
              aria-label="Appointment reason or concern"
            />
          </div>

          {/* Appointment Summary */}
          {selectedDate && selectedTime && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Appointment Summary:</span>
              </p>
              <p className="text-sm text-blue-800 mt-1">
                Date: {selectedDate.toDateString()}
              </p>
              <p className="text-sm text-blue-800">Time: {selectedTime}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            onClick={onSubmit}
            disabled={!isFormValid || isSubmitting || isLoading}
            className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 text-base"
          >
            {isSubmitting ? "Scheduling..." : "Confirm Appointment"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
