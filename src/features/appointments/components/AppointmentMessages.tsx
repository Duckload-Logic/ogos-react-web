import { AlertCircle, Check } from "lucide-react";

interface AppointmentMessagesProps {
  error?: string | null;
  successMessage?: string | null;
}

export default function AppointmentMessages({
  error,
  successMessage,
}: AppointmentMessagesProps) {
  return (
    <>
      {error && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-900">{error}</p>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-8 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-900">{successMessage}</p>
              <p className="text-sm text-green-700">
                You will receive a confirmation email shortly.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
