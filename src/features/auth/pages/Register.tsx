import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthHeader, AuthMessages, RegisterForm } from "@/features/auth/components";

export default function Register() {
  const navigate = useNavigate();
  // const { register } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [middleInitial, setMiddleInitial] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validation
    if (!firstName.trim()) {
      setError("Please enter your first name");
      setIsLoading(false);
      return;
    }

    if (!surname.trim()) {
      setError("Please enter your surname");
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address");
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter a password");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Combine name parts for registration
    const fullName = `${firstName.trim()} ${middleInitial.trim()} ${surname.trim()}`.trim();

    // Register user
    // const result = register(fullName, email, password);
    // if (result.success) {
    //   setSuccess("Account created successfully! Redirecting...");
    //   setTimeout(() => {
    //     navigate("/");
    //   }, 1500);
    // } else {
    //   setError(result.error || "Registration failed");
    // }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 sm:px-4 py-6 sm:py-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <AuthHeader
            title="PUPT OGOS"
            subtitle="Create Your Account"
          />

          {/* Form Content */}
          <div className="px-4 sm:px-6 py-6 sm:py-8">
            {/* Messages */}
            <AuthMessages error={error} success={success} />

            {/* Form */}
            <RegisterForm
              firstName={firstName}
              middleInitial={middleInitial}
              surname={surname}
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              onFirstNameChange={setFirstName}
              onMiddleInitialChange={setMiddleInitial}
              onSurnameChange={setSurname}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onConfirmPasswordChange={setConfirmPassword}
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
