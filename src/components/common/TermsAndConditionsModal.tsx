import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Role = "student" | "admin";

type TermsAndConditionsModalProps = {
  open: boolean;
  role: Role;
  loading?: boolean;
  onAccept: () => Promise<void> | void;
};

export default function TermsAndConditionsModal({
  open,
  role,
  loading = false,
  onAccept,
}: TermsAndConditionsModalProps) {
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (open) setAgreed(false);
  }, [open]);

  if (!open) return null;

  const accentClass = role === "admin" ? "bg-[#8f1113]" : "bg-[#c62828]";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/45 px-4 backdrop-blur-md">
      <div
        className="w-full max-w-[640px] rounded-[28px] bg-white p-7 shadow-2xl sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
      >
        <div className={`mb-6 rounded-2xl px-6 py-4 text-white ${accentClass}`}>
          <h2 id="terms-title" className="text-2xl font-bold">
            Terms and Conditions
          </h2>
        </div>

        <div className="space-y-5 text-[16px] leading-9 text-slate-700">
          <p>
            By clicking <span className="font-bold text-slate-900">“I Agree”</span>,
            you consent to the collection, use, and processing of your personal
            data for legitimate purposes related to this service.
          </p>

          <p>
            Your information will be handled in accordance with our{" "}
            <span className="font-bold text-slate-900">Privacy Policy</span> and
            in compliance with the{" "}
            <span className="font-bold text-slate-900">
              Data Privacy Act of 2012
            </span>.
          </p>
        </div>

        <div className="mt-7 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-5">
          <label
            htmlFor="terms-agree"
            className="flex cursor-pointer items-start gap-4"
          >
            <input
              id="terms-agree"
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="peer sr-only"
            />

            <span
              className="
                mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md
                border border-slate-400 bg-white transition
                peer-checked:border-[#8f1113] peer-checked:bg-[#8f1113]
              "
            >
              {agreed && (
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  className="h-4 w-4 text-white"
                  aria-hidden="true"
                >
                  <path
                    d="M5 10.5l3.2 3.2L15 7"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>

            <span className="text-base leading-7 text-slate-800">
              I agree and acknowledge the{" "}
              <span className="font-bold">Terms and Conditions</span>
            </span>
          </label>
        </div>

        <div className="mt-7 flex justify-end">
          <Button
            type="button"
            disabled={!agreed || loading}
            onClick={onAccept}
            className={`min-w-[160px] rounded-2xl px-6 py-6 text-base font-semibold text-white disabled:bg-slate-300 ${accentClass}`}
          >
            {loading ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}