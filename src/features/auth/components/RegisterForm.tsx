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
        {/* First Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name
          </label>
          <Input
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => onFirstNameChange(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Middle Initial */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Middle Initial
          </label>
          <Input
            type="text"
            placeholder="M"
            maxLength={1}
            value={middleInitial}
            onChange={(e) =>
              onMiddleInitialChange(e.target.value.toUpperCase())
            }
            disabled={isLoading}
            className="w-full"
          />
        </div>

        {/* Surname */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Surname
          </label>
          <Input
            type="text"
            placeholder="Enter your surname"
            value={surname}
            onChange={(e) => onSurnameChange(e.target.value)}
            disabled={isLoading}
            className="w-full"
          />
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
