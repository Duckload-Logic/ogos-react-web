import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle, Calendar as CalendarIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Register() {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    // Auto-populate role from authenticated user's session
    if (userRole) {
      setRole(userRole);
    }
  }, [userRole]);
  const [gender, setGender] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$|^[a-zA-Z0-9_.-]+$/;
    return emailRegex.test(email);
  };

  const validateMobileNumber = (number: string): boolean => {
    const phoneRegex = /^[0-9\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(number.replace(/\s/g, ""));
  };

  const validateBirthDate = (dateString: string): boolean => {
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(\d{4})$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }

    const [day, month, year] = dateString.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    const isValidDate = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isNotFuture = date <= today;
    
    const isReasonableAge = year >= 1900;

    return isValidDate && isNotFuture && isReasonableAge;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validation
    if (!role) {
      setError("Role is required. Please ensure you're logged in.");
      setIsLoading(false);
      return;
    }

    if (!gender) {
      setError("Please select your gender");
      setIsLoading(false);
      return;
    }

    if (!firstName.trim()) {
      setError("Please enter your first name");
      setIsLoading(false);
      return;
    }

    if (!lastName.trim()) {
      setError("Please enter your last name");
      setIsLoading(false);
      return;
    }

    if (!birthDate.trim()) {
      setError("Please enter your birth date (dd/mm/yyyy)");
      setIsLoading(false);
      return;
    }

    if (!validateBirthDate(birthDate)) {
      setError("Please enter a valid birth date in dd/mm/yyyy format");
      setIsLoading(false);
      return;
    }

    if (!placeOfBirth.trim()) {
      setError("Please enter your place of birth");
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address or username");
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address or username");
      setIsLoading(false);
      return;
    }

    if (!mobileNumber.trim()) {
      setError("Please enter your mobile number");
      setIsLoading(false);
      return;
    }

    if (!validateMobileNumber(mobileNumber)) {
      setError("Please enter a valid mobile number");
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
      <div className="w-full max-w-2xl">
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

          <form onSubmit={handleRegister} className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
            {/* Role Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700 font-medium text-sm">Role</Label>
                {userRole && <span className="text-xs text-gray-500">Auto-assigned</span>}
              </div>
              <Select value={role} onValueChange={setRole} disabled={Boolean(userRole) || isLoading}>
                <SelectTrigger className="h-10 border-gray-300">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="frontdesk">Front Desk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Personal Information
              </h3>

              {/* Name Fields */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-gray-700 font-medium text-sm"
                  >
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isLoading}
                    className="border-gray-300 h-10 text-sm mb-3"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="middleName"
                    className="text-gray-700 font-medium text-sm"
                  >
                    Middle Name
                  </Label>
                  <Input
                    id="middleName"
                    type="text"
                    placeholder="Middle name"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    disabled={isLoading}
                    className="border-gray-300 h-10 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-gray-700 font-medium text-sm"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isLoading}
                    className="border-gray-300 h-10 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Gender Section */}
              <div className="space-y-3">
                <Label className="text-gray-700 font-medium text-sm">Gender</Label>
                <RadioGroup value={gender} onValueChange={setGender} disabled={isLoading}>
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="font-normal cursor-pointer text-sm">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="font-normal cursor-pointer text-sm">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other" className="font-normal cursor-pointer text-sm">Other</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Birth Date and Place of Birth */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium text-sm">
                    Birth Date <span className="text-red-500">*</span>
                  </Label>
                  <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <div className="relative">
                      <Input
                        id="birthDate"
                        type="text"
                        placeholder="dd/mm/yyyy"
                        value={birthDate}
                        onChange={(e) => {
                          setBirthDate(e.target.value);
                          // Parse the input to update selectedDate
                          const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(\d{4})$/;
                          if (dateRegex.test(e.target.value)) {
                            const [day, month, year] = e.target.value.split("/").map(Number);
                            const date = new Date(year, month - 1, day);
                            // Validate the date
                            if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
                              setSelectedDate(date);
                            }
                          }
                        }}
                        disabled={isLoading}
                        className="border-gray-300 h-10 text-sm pr-10"
                        required
                      />
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          disabled={isLoading}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          <CalendarIcon className="h-4 w-4" />
                        </button>
                      </PopoverTrigger>
                    </div>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          if (date) {
                            const day = String(date.getDate()).padStart(2, '0');
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const year = date.getFullYear();
                            setBirthDate(`${day}/${month}/${year}`);
                            setIsCalendarOpen(false);
                          }
                        }}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date > today || date.getFullYear() < 1900;
                        }}
                        initialFocus
                      />
                      <div className="flex justify-between px-4 py-3 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDate(undefined);
                            setBirthDate("");
                            setIsCalendarOpen(false);
                          }}
                          className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            setSelectedDate(today);
                            const day = String(today.getDate()).padStart(2, '0');
                            const month = String(today.getMonth() + 1).padStart(2, '0');
                            const year = today.getFullYear();
                            setBirthDate(`${day}/${month}/${year}`);
                            setIsCalendarOpen(false);
                          }}
                          className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                        >
                          Today
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="placeOfBirth"
                    className="text-gray-700 font-medium text-sm"
                  >
                    Place of Birth <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="placeOfBirth"
                    type="text"
                    placeholder="Enter place of birth"
                    value={placeOfBirth}
                    onChange={(e) => setPlaceOfBirth(e.target.value)}
                    disabled={isLoading}
                    className="border-gray-300 h-10 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Contact Information
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-gray-700 font-medium text-sm"
                  >
                    Email Address <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="border-gray-300 h-10 text-sm"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="mobileNumber"
                    className="text-gray-700 font-medium text-sm"
                  >
                    Mobile Number <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={isLoading}
                    className="border-gray-300 h-10 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Password
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium text-sm"
                  >
                    Password <span className="text-red-500">*</span>
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

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-gray-700 font-medium text-sm"
                  >
                    Confirm Password <span className="text-red-500">*</span>
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
              </div>
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded mt-4"
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