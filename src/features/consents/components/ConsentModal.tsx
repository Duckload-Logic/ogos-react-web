import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ConsentModalProps = {
  open: boolean;
  role: string;
  loading?: boolean;
  onAccept: () => Promise<void> | void;
};

export default function ConsentModal({
  open,
  role,
  loading = false,
  onAccept,
}: ConsentModalProps) {
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (open) setAgreed(false);
  }, [open]);

  if (!open) return null;

  const accentClass = role === "admin" ? "bg-[#8f1113]" : "bg-[#c62828]";

  return (
    <Dialog
      open={open}
      onOpenChange={() => {}}
    >
      <DialogContent
        className={cn(
          "max-h-[70vh] w-[95vw] max-w-[640px] overflow-y-auto",
          "rounded-3xl border-glass-border bg-card p-6 outline-none",
          "sm:w-full sm:p-8",
        )}
        hasCloseButton={false}
      >
        <div className={`mb-6 rounded-xl px-6 py-4 text-white ${accentClass}`}>
          <DialogTitle asChild>
            <h2
              id="terms-title"
              className="text-2xl font-bold"
            >
              Terms and Conditions
            </h2>
          </DialogTitle>
        </div>

        <div className="space-y-5 text-[16px] leading-9 text-foreground">
          <p>
            By clicking{" "}
            <span className="font-bold text-secondary">“I Agree”</span>, you
            consent to the collection, use, and processing of your personal data
            for legitimate purposes related to this service.
          </p>

          <p>
            Your information will be handled in accordance with our{" "}
            <a
              className={cn(
                "cursor-pointer font-bold text-primary transition-colors",
                "duration-200 hover:text-primary/70",
              )}
              target="_blank"
              href="https://www.pup.edu.ph/privacy"
            >
              Privacy Policy
            </a>{" "}
            and in compliance with the{" "}
            <span className="font-bold text-secondary">
              Data Privacy Act of 2012
            </span>
            .
          </p>
        </div>

        <div
          className={cn(
            "from-primary-50 via-primary-100 to-primary-50 mt-7",
            "rounded-2xl border border-glass-border",
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))]",
            "px-5 py-5",
          )}
        >
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
              className={cn(
                "mt-1 flex h-6 w-6 shrink-0 items-center justify-center",
                "rounded-md border border-slate-400 bg-glass-bg transition",
                "peer-checked:border-[#8f1113] peer-checked:bg-[#8f1113]",
              )}
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

            <span className="text-base leading-7 text-foreground">
              I agree and acknowledge the{" "}
              <a
                className={cn(
                  "cursor-pointer font-bold text-primary transition-colors",
                  "duration-200 hover:text-primary/60",
                )}
                target="_blank"
                href="https://www.pup.edu.ph/terms"
              >
                Terms of Service
              </a>
              .
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
      </DialogContent>
    </Dialog>
  );
}
