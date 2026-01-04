import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Register() {
  const [role, setRole] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validation
    if (!role) {
      setError("Please select a role");
      setIsLoading(false);
      return;
    }

    if (!fullName.trim()) {
      setError("Please enter your full name");
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address or username");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate registration success
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
            <button
              onClick={() => navigate("/login")}
              className="pb-4 font-semibold text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              Login
            </button>
            <button className="pb-4 font-semibold text-primary border-b-2 border-primary text-sm transition-colors">
              Register
            </button>
          </div>

          {/* Success Alert */}
          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Role Dropdown */}
            <div className="space-y-2">
              <Label className="text-gray-700 font-medium text-sm">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-10 border-gray-300">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Full Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="fullName"
                className="text-gray-700 font-medium text-sm"
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                className="border-gray-300 h-10 text-sm"
                required
              />
            </div>

            {/* Email/Username Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-gray-700 font-medium text-sm"
              >
                Email Address or Username
              </Label>
              <Input
                id="email"
                type="text"
                placeholder="Enter your email address or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-gray-700 font-medium text-sm"
              >
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="border-gray-300 h-10 text-sm"
                required
              />
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded mt-2"
            >
              {isLoading ? "Creating Account..." : "Register"}
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm text-foreground pt-2">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary hover:text-primary/80 transition-colors font-semibold"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
