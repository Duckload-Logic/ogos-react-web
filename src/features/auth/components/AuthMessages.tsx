import { AlertCircle, CheckCircle } from "lucide-react";

interface AuthMessagesProps {
  error?: string | null;
  success?: string | null;
}

export default function AuthMessages({ error, success }: AuthMessagesProps) {
  return (
    <>
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-800">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </>
  );
}
