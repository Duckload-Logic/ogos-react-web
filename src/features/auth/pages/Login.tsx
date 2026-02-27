import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AuthHeader,
  AuthMessages,
  LoginForm,
} from "@/features/auth/components";
import { Button } from "@/components/ui/button";
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
} from "@/utils/validation";
import { ROLE_ROUTES } from "@/config/constants";
import { useLogin } from "../hooks";
import { useMe } from "@/features/users/hooks/useMe";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoggingIn, loginError } = useLogin();
  const { data: me, isLoading: isLoadingMe, refetch } = useMe();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [idpError, setIdpError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Future refactor - consolidate error state management into a single error handler
    // instead of managing localError and idpError separately
    setLocalError("");
    setIdpError(false);

    // Client-side validation
    try {
      if (!username || !password) throw new Error("Credentials required");

      const isEmail = username.includes("@");
      if (isEmail && !isValidEmail(username)) throw new Error("Invalid email");
      if (!isEmail && !isValidUsername(username))
        throw new Error("Invalid username");
      if (!isValidPassword(password)) throw new Error("Password too short");

      // Login - tokens are automatically saved by authService
      console.log("🔐 Starting login...");
      await login({
        email: username,
        password,
      });
      console.log("✅ Login successful, tokens saved");

      // Fetch user data after successful login
      console.log("👤 Fetching user data...");
      const result = await refetch();
      console.log("📊 Refetch result:", result.data);

      // Navigate immediately after we have user data
      if (result.data) {
        const roleId = result.data.role?.id;
        const route = ROLE_ROUTES[roleId as keyof typeof ROLE_ROUTES];

        if (route) {
          console.log("✈️ Navigating to:", route);
          navigate(route, { replace: true });
        } else {
          console.error("❌ No route found for role:", roleId);
          setLocalError("Unauthorized role.");
        }
      } else {
        console.error("❌ No user data in result:", result);
        setLocalError("Failed to load user data.");
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : "Login failed");
    }
  };

  const handleIdpLogin = () => {
    setLocalError("");
    setIdpError(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-lg shadow-xl overflow-hidden">
          <AuthHeader title="PUPT OGOS" subtitle="Login to Your Account" />
          <div className="p-6 sm:p-8">
            {/* Combine local validation errors and server errors from the hook */}
            <AuthMessages error={localError || loginError?.message} />

            <LoginForm
              username={username}
              password={password}
              onUsernameChange={setUsername}
              onPasswordChange={setPassword}
              onSubmit={handleSubmit}
              isLoading={isLoggingIn}
              onIdpClick={handleIdpLogin}
              idpError={idpError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
