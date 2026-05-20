import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { authService } from "@/features/dev-tools/services/auth-api";
import {
  Loader2,
  Lock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react";

const VerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const registrationId = searchParams.get("registration_id");
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    if (!registrationId) return 180;
    const storedExpiry = localStorage.getItem(
      `verify_expiry_${registrationId}`,
    );
    if (storedExpiry) {
      const remaining = Math.ceil((parseInt(storedExpiry) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }

    // First time arrival: set initial expiry
    const expiry = Date.now() + 180 * 1000;
    localStorage.setItem(`verify_expiry_${registrationId}`, expiry.toString());
    return 180;
  });

  useEffect(() => {
    if (!registrationId) {
      navigate("/register");
    }
  }, [registrationId, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const maskEmail = (emailStr: string) => {
    if (!emailStr) return "your email";
    const [user, domainPart] = emailStr.split("@");
    if (!user || !domainPart) return emailStr;

    // Mask user: keep first 2 chars
    const maskedUser =
      user.length > 2
        ? `${user.slice(0, 2)}${"*".repeat(Math.min(user.length - 2, 8))}`
        : `${user[0]}*`;

    // Mask domain: keep first char and TLD
    const domainDots = domainPart.split(".");
    const domainName = domainDots[0];
    const tld = domainDots.slice(1).join(".");

    const maskedDomain =
      domainName.length > 1
        ? `${domainName[0]}${"*".repeat(Math.min(domainName.length - 1, 4))}`
        : domainName;

    return `${maskedUser}@${maskedDomain}.${tld}`;
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationId || !otp) return;

    setLoading(true);
    setError(null);
    try {
      await authService.verify(registrationId, otp);
      if (registrationId) {
        localStorage.removeItem(`verify_expiry_${registrationId}`);
      }
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Verification failed. Please check your code.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timeLeft > 0 || !registrationId || resending) return;

    setResending(true);
    setError(null);
    try {
      await authService.resendVerify(registrationId);
      const newExpiry = Date.now() + 180 * 1000;
      localStorage.setItem(
        `verify_expiry_${registrationId}`,
        newExpiry.toString(),
      );
      setTimeLeft(180);
      // Optional: show a small toast or message that email was resent
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Failed to resend verification email.",
      );
    } finally {
      setResending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute -left-4 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -right-4 bottom-0 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

      <div className="animate-in fade-in slide-in-from-bottom-4 z-10 w-full max-w-md duration-700">
        <div className="glass-card relative space-y-8 overflow-hidden p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/5 blur-[50px]" />

          <div className="space-y-2 text-center">
            <div className="mb-4 inline-flex h-16 w-16 animate-bounce items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-3xl uppercase tracking-tighter">
              Verify Email
            </h1>
            <p className="font-medium text-muted-foreground">
              We sent an OTP to{" "}
              <span className="font-bold text-foreground">
                {maskEmail(email)}
              </span>
            </p>
          </div>

          {error && (
            <div className="bg-danger/10 border-danger/20 text-danger animate-in shake flex items-center gap-2 rounded-xl border p-4 text-sm duration-300">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-success/10 border-success/20 text-success flex items-center gap-2 rounded-xl border p-4 text-sm">
              <CheckCircle2 size={18} />
              Verification successful! Redirecting to login...
            </div>
          )}

          <form
            onSubmit={handleVerify}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">One-Time Password</label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-3 text-muted-foreground"
                  size={18}
                />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="flex h-12 w-full rounded-lg border border-input bg-background px-10 py-2 text-center text-2xl font-bold tracking-[0.5em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder=""
                />
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Enter the 6-digit code sent to your inbox
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || success || otp.length !== 6}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Verify Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="space-y-4 text-center">
            <div className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              {timeLeft > 0 ? (
                <span className="font-medium text-primary">
                  Resend in {formatTime(timeLeft)}
                </span>
              ) : (
                <button
                  onClick={handleResend}
                  disabled={resending}
                  className="inline-flex items-center gap-1 font-bold text-primary transition-all hover:underline"
                >
                  {resending ? (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <RefreshCcw size={14} />
                  )}
                  Resend Code
                </button>
              )}
            </div>

            <button
              onClick={() => navigate("/register")}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;
