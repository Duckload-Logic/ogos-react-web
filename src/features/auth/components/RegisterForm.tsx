import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Name Fields - Responsive Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {/* First Name */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <Input
              type="text"
              placeholder="John"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              disabled={isLoading}
              className="w-full text-sm"
            />
          </div>

          {/* Middle Initial */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Middle Initial
            </label>
            <Input
              type="text"
              placeholder="Q"
              maxLength={1}
              value={middleInitial}
              onChange={(e) => onMiddleInitialChange(e.target.value.toUpperCase())}
              disabled={isLoading}
              className="w-full text-sm"
            />
          </div>

          {/* Surname */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Surname
            </label>
            <Input
              type="text"
              placeholder="Doe"
              value={surname}
              onChange={(e) => onSurnameChange(e.target.value)}
              disabled={isLoading}
              className="w-full text-sm"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Must be at least 6 characters
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <Input
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Register Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 sm:h-11 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold text-sm sm:text-base"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-primary hover:text-primary-dark font-medium"
        >
          Login
        </Link>
      </p>
    </>
  );
}
