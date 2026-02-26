import { Checkbox } from "@/components/form";
import { FormField, LoadingSpinner } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

interface LoginFormProps {
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onPUPTIDPClick: () => void;
  isLoading: boolean;
}

export default function LoginForm({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  onPUPTIDPClick,
  isLoading,
}: LoginFormProps) {
  const [rememberMe, setRememberMe] = useState(false);

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
          <Checkbox
            label="Remember me"
            id="remember"
            name="Remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
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

        <Button
          type="button"
          onClick={onPUPTIDPClick}
          disabled={isLoading}
          className="w-full h-10 sm:h-11 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold text-sm sm:text-base flex items-center justify-center"
        >
          Login with PUPT-IDP
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
