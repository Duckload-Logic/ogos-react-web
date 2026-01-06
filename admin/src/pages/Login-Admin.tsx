import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        navigate("/");
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header Card */}
        <div className="bg-primary text-primary-foreground py-12 px-8 text-center rounded-t-lg">
          <div className="flex justify-center mb-4">
            <img
              src="/PUPLogo.png"
              alt="PUP Logo"
              className="w-12 h-12 rounded-full border-2 border-white"
            />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">PUPT OGOS</h1>
          <p className="opacity-90 mt-2 text-sm">Guidance Services Portal</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-b-lg shadow-lg p-8 border border-gray-200">
          {/* Tabs */}
          <div className="flex gap-12 mb-6 border-b border-border -mx-8 px-8">
            <button className="pb-4 font-semibold text-primary border-b-2 border-primary text-sm transition-colors">
              Login
            </button>
            <button
              onClick={handleRegisterClick}
              className="pb-4 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Register
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-gray-700 font-medium text-sm"
              >
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="border-gray-300 h-10 text-sm"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-gray-700 font-medium text-sm"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="border-gray-300 h-10 text-sm"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-gray-700 cursor-pointer font-normal"
                >
                  Remember me
                </Label>
              </div>
              <a
                href="#"
                className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>

            {/* Register Link */}
            <div className="text-center text-sm text-foreground pt-2">
              Don't have an account?{" "}
              <button
                onClick={handleRegisterClick}
                className="text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
