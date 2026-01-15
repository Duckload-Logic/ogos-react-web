import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context";
import { AuthHeader, AuthMessages, LoginForm } from "@/features/auth/components";
import { isValidEmail, isValidPassword, isValidUsername } from "@/utils/validation";
import { ROLE_ROUTES } from "@/config/constants";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validation
      if (!username || !password) {
        throw new Error("Please enter both email/username and password");
      }

      const isEmail = username.includes("@");
      
      if (isEmail && !isValidEmail(username)) {
        throw new Error("Please enter a valid email address");
      }

      if (!isEmail && !isValidUsername(username)) {
        throw new Error("Username must be 3-50 characters");
      }

      if (!isValidPassword(password)) {
        throw new Error("Password must be at least 6 characters");
      }

      // Call API
      const result = await login(username, password);
   
      if (result.success) {
        const roleId = result?.roleId;
        if (!roleId) {
          throw new Error("User role not found");
        }

        const route = ROLE_ROUTES[roleId as keyof typeof ROLE_ROUTES];
        if (!route) {
          throw new Error("Unknown user role");
        }

        navigate(route, { replace: true });
      } else {
        throw new Error(result.error || "Invalid credentials");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 sm:px-4 py-6 sm:py-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <AuthHeader
            title="PUPT OGOS"
            subtitle="Login to Your Account"
          />

          {/* Form Content */}
          <div className="px-4 sm:px-6 py-6 sm:py-8">
            {/* Messages */}
            <AuthMessages error={error} />

            {/* Form */}
            <LoginForm
              username={username}
              password={password}
              onUsernameChange={setUsername}
              onPasswordChange={setPassword}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Support Text */}
        <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6">
          Need help? Contact the guidance office
        </p>
      </div>
    </div>
  );
}
