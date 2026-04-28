import { AlertCircle, Check } from "lucide-react";

interface MessagesProps {
  error?: string | null;
  successMessage?: string | null;
}

export default function Messages({ error, successMessage }: MessagesProps) {
  return (
    <>
      {error && (
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 md:px-8">
          <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
            <div>
              <p className="font-semibold text-red-900">{error}</p>
            </div>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 md:px-8">
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <Check className="h-5 w-5 flex-shrink-0 text-green-600" />
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
