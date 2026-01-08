import { FormField, LoadingSpinner } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface LoginFormProps {
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function LoginForm({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  isLoading,
}: LoginFormProps) {
  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <FormField
          label="Email or Username"
          type="text"
          placeholder="Enter your email or username"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          disabled={isLoading}
        />

        <FormField
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          disabled={isLoading}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" disabled={isLoading} />
            Remember me
          </label>
          <Link
            to="#"
            className="text-primary hover:text-primary-dark font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 sm:h-11 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold text-sm sm:text-base flex items-center justify-center"
        >
          {isLoading ? <LoadingSpinner size="sm" /> : "Login"}
        </Button>
      </form>

      <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-primary hover:text-primary-dark font-medium"
        >
          Register here
        </Link>
      </p>
    </>
  );
}
