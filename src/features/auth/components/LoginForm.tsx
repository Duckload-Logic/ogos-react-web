import { Checkbox } from "@/components/form";
import { FormField, LoadingSpinner } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface LoginFormProps {
  username: string;
  password: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onIdpClick: () => void;
  idpError: boolean;
}

export default function LoginForm({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  isLoading,
  onIdpClick,
  idpError,
}: LoginFormProps) {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <>
      {idpError && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">This service is currently not available</p>
        </div>
      )}
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
      </form>

      <Button
        type="button"
        onClick={onIdpClick}
        className="w-full mt-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg h-10 sm:h-11"
      >
        Login with PUPT-IDP
      </Button>

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
