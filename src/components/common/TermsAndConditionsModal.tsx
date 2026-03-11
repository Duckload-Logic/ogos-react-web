import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Role = "student" | "admin";

type TermsAndConditionsModalProps = {
  open: boolean;
  role: Role;
  onAccept: () => void;
};

export default function TermsAndConditionsModal({
  open,
  role,
  onAccept,
}: TermsAndConditionsModalProps) {
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (open) setAgreed(false);
  }, [open]);

  if (!open) return null;

  const accentClass =
    role === "admin"
      ? "bg-[#8f0d12] focus-visible:ring-[#8f0d12]"
      : "bg-[#cf2e2e] focus-visible:ring-[#cf2e2e]";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 backdrop-blur-sm">
      <div
        className="w-full max-w-[540px] rounded-[28px] bg-white p-6 shadow-2xl sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
      >
        <div className="mb-5">
          <div
            className={`mx-auto flex h-14 w-full items-center justify-center rounded-2xl text-center text-xl font-bold text-white ${accentClass}`}
          >
            <h2 id="terms-title">Terms and Conditions</h2>
          </div>
        </div>

        <div className="space-y-4 text-[15px] leading-8 text-slate-600">
          <p>
            By clicking <span className="font-semibold text-slate-800">“I Agree”</span>,
            you consent to the collection, use, and processing of your personal
            data for legitimate purposes related to this service.
          </p>

          <p>
            Your information will be handled in accordance with our Privacy Policy
            and in compliance with the Data Privacy Act of 2012.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-slate-300 text-primary focus:ring-2 focus:ring-primary/30"
            />
            <div>
              <div className="text-sm font-medium text-slate-800">
                I agree and acknowledge the Terms and Conditions.
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                You must accept before continuing to the dashboard.
              </p>
            </div>
          </label>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            disabled={!agreed}
            onClick={onAccept}
            className={`min-w-[140px] rounded-2xl px-6 py-6 text-base font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300 ${accentClass}`}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}