import { AlertCircle, CheckCircle } from "lucide-react";

interface AuthMessagesProps {
  error?: string | null;
  success?: string | null;
}

export default function AuthMessages({
  error,
  success,
}: AuthMessagesProps) {
  return (
    <>
      {success && (
        <div className="mb-4 flex gap-3 rounded-2xl border border-emerald-200/70 bg-white/65 p-3 text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:shadow-none">
          <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{success}</p>
        </div>
      )}

      {error && (
        <div className="mb-4 flex gap-3 rounded-2xl border border-red-200/70 bg-white/65 p-3 text-red-700 shadow-sm backdrop-blur dark:border-red-400/20 dark:bg-red-500/10 dark:text-red-300 dark:shadow-none">
          <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </>
  );
}