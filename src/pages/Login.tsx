import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PUPLogo from "@/assets/images/PUPLogo.png";
import { AlertCircle } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string): boolean => {
    return username.length >= 3 && username.length <= 50;
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (!username || !password) {
      setError("Please enter both email/username and password");
      setIsLoading(false);
      return;
    }

    const isEmail = username.includes("@");
    
    if (isEmail && !validateEmail(username)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    // Call API
    const result = await login(username, password);
 
    if (result.success) {
      const roleMap: { [key: number]: string } = {
        1: "student",
        2: "admin",
        3: "frontdesk",
      };
      const roleId = result?.roleId;
      if (!roleId) {
        setError("User role not found");
        setIsLoading(false);
        return;
      }

      const role = roleMap[roleId];
      if (role === undefined) {
        setError("Unknown user role");
        setIsLoading(false);
        return;
      }

      if (role === "admin") {
        navigate("/admin", { replace: true });
      } else if (role === "frontdesk") {
        navigate("/frontdesk", { replace: true });
      } else if (role === "student") {
        navigate("/", { replace: true });
      }
    } else {
      setError(result.error || "Invalid credentials");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 sm:px-4 py-6 sm:py-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-4 sm:px-6 py-6 sm:py-8 text-primary-foreground">
            <div className="flex items-center justify-center mb-3 sm:mb-4">
              <img
                src={PUPLogo}
                alt="PUPT Logo"
                className="h-14 sm:h-16 w-14 sm:w-16 object-contain"
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-center">PUPT OGOS</h1>
            <p className="text-center text-xs sm:text-sm opacity-90 mt-2">
              Login to Your Account
            </p>
          </div>

          {/* Form Content */}
          <div className="px-4 sm:px-6 py-6 sm:py-8">
            {/* Error Alert */}
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Username
                </label>
                <Input
                  type="text"
                  placeholder="Enter your email or username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
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
                className="w-full h-10 sm:h-11 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold text-sm sm:text-base"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </form>

            {/* Footer */}
            <p className="text-center text-xs sm:text-sm text-muted-foreground mt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-primary-dark font-medium"
              >
                Register here
              </Link>
            </p>
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
