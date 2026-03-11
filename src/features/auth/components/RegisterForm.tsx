import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

interface RegisterFormProps {
  firstName: string;
  middleInitial: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  onFirstNameChange: (value: string) => void;
  onMiddleInitialChange: (value: string) => void;
  onSurnameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function RegisterForm({
  firstName,
  middleInitial,
  surname,
  email,
  password,
  confirmPassword,
  onFirstNameChange,
  onMiddleInitialChange,
  onSurnameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  isLoading,
}: RegisterFormProps) {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_110px_minmax(0,1fr)]">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
              First Name
            </Label>
            <Input
              id="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="John"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              disabled={isLoading}
              className="h-12 rounded-2xl border-[hsl(var(--border)/0.9)] bg-[hsl(var(--background)/0.78)] px-4 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur placeholder:text-muted-foreground focus-visible:ring-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="middleInitial" className="text-sm font-medium text-foreground">
              Middle Initial
            </Label>
            <Input
              id="middleInitial"
              type="text"
              placeholder="Q"
              maxLength={1}
              value={middleInitial}
              onChange={(e) =>
                onMiddleInitialChange(e.target.value.toUpperCase())
              }
              disabled={isLoading}
              className="h-12 rounded-2xl border-[hsl(var(--border)/0.9)] bg-[hsl(var(--background)/0.78)] px-4 text-center text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur placeholder:text-muted-foreground focus-visible:ring-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="surname" className="text-sm font-medium text-foreground">
              Surname
            </Label>
            <Input
              id="surname"
              type="text"
              autoComplete="family-name"
              placeholder="Doe"
              value={surname}
              onChange={(e) => onSurnameChange(e.target.value)}
              disabled={isLoading}
              className="h-12 rounded-2xl border-[hsl(var(--border)/0.9)] bg-[hsl(var(--background)/0.78)] px-4 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur placeholder:text-muted-foreground focus-visible:ring-2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={isLoading}
            className="h-12 rounded-2xl border-[hsl(var(--border)/0.9)] bg-[hsl(var(--background)/0.78)] px-4 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur placeholder:text-muted-foreground focus-visible:ring-2"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              disabled={isLoading}
              className="h-12 rounded-2xl border-[hsl(var(--border)/0.9)] bg-[hsl(var(--background)/0.78)] px-4 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur placeholder:text-muted-foreground focus-visible:ring-2"
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 6 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              disabled={isLoading}
              className="h-12 rounded-2xl border-[hsl(var(--border)/0.9)] bg-[hsl(var(--background)/0.78)] px-4 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur placeholder:text-muted-foreground focus-visible:ring-2"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-2 h-12 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-[0_14px_30px_-16px_rgba(220,38,38,0.55)] transition hover:bg-primary/90 sm:text-base"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary transition-colors hover:opacity-80"
        >
          Login
        </Link>
      </p>
    </>
  );
}