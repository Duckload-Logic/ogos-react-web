import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Form state interface
interface RegisterFormState {
  firstName: string;
  lastName: string;
  birthDate: string;
  placeOfBirth: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  [key: string]: string;
}

export function RegisterForm() {
  const [formState, setFormState] = useState<RegisterFormState>({
    firstName: "",
    lastName: "",
    birthDate: "",
    placeOfBirth: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.currentTarget;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formState.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formState.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formState.birthDate) {
      newErrors.birthDate = "Birth date is required";
    }

    if (!formState.placeOfBirth.trim()) {
      newErrors.placeOfBirth = "Place of birth is required";
    }

    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formState.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    }

    if (!formState.password) {
      newErrors.password = "Password is required";
    } else if (formState.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (formState.confirmPassword !== formState.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Implement API call to create account
      console.log("Form submitted:", formState);
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formState),
      // });
    } catch (error) {
      console.error("Registration error:", error);
      setErrors({ form: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      id="register_form"
      onSubmit={handleSubmit}
      className="register-form"
    >
      {/* Personal Information Section */}
      <div className="register-form__section">
        <h2 className="register-form__title">
          Personal Information
        </h2>

        {/* Name Fields */}
        <div className="register-form__field-row">
          <div className="register-form__field">
            <Label htmlFor="first_name">First Name *</Label>
            <Input
              id="first_name"
              name="firstName"
              type="text"
              placeholder="Enter your first name"
              value={formState.firstName}
              onChange={handleChange}
              className={cn(
                "register-form__input",
                errors.firstName && "register-form__input--error"
              )}
              aria-invalid={!!errors.firstName}
              aria-describedby={
                errors.firstName
                  ? "first_name_error"
                  : undefined
              }
            />
            {errors.firstName && (
              <span
                id="first_name_error"
                className="register-form__error"
              >
                {errors.firstName}
              </span>
            )}
          </div>

          <div className="register-form__field">
            <Label htmlFor="last_name">Last Name *</Label>
            <Input
              id="last_name"
              name="lastName"
              type="text"
              placeholder="Enter your last name"
              value={formState.lastName}
              onChange={handleChange}
              className={cn(
                "register-form__input",
                errors.lastName && "register-form__input--error"
              )}
              aria-invalid={!!errors.lastName}
              aria-describedby={
                errors.lastName ? "last_name_error" : undefined
              }
            />
            {errors.lastName && (
              <span id="last_name_error" className="register-form__error">
                {errors.lastName}
              </span>
            )}
          </div>
        </div>

        {/* Birth Information */}
        <div className="register-form__field-row">
          <div className="register-form__field">
            <Label htmlFor="birth_date">Birth Date *</Label>
            <Input
              id="birth_date"
              name="birthDate"
              type="date"
              placeholder="dd/mm/yyyy"
              value={formState.birthDate}
              onChange={handleChange}
              className={cn(
                "register-form__input",
                errors.birthDate &&
                  "register-form__input--error"
              )}
              aria-invalid={!!errors.birthDate}
              aria-describedby={
                errors.birthDate
                  ? "birth_date_error"
                  : undefined
              }
            />
            {errors.birthDate && (
              <span
                id="birth_date_error"
                className="register-form__error"
              >
                {errors.birthDate}
              </span>
            )}
          </div>

          <div className="register-form__field">
            <Label htmlFor="place_of_birth">
              Place of Birth *
            </Label>
            <Input
              id="place_of_birth"
              name="placeOfBirth"
              type="text"
              placeholder="Enter place of birth"
              value={formState.placeOfBirth}
              onChange={handleChange}
              className={cn(
                "register-form__input",
                errors.placeOfBirth &&
                  "register-form__input--error"
              )}
              aria-invalid={!!errors.placeOfBirth}
              aria-describedby={
                errors.placeOfBirth
                  ? "place_of_birth_error"
                  : undefined
              }
            />
            {errors.placeOfBirth && (
              <span
                id="place_of_birth_error"
                className="register-form__error"
              >
                {errors.placeOfBirth}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="register-form__section">
        <h2 className="register-form__title">
          Contact Information
        </h2>

        <div className="register-form__field-row">
          <div className="register-form__field">
            <Label htmlFor="email_address">Email Address *</Label>
            <Input
              id="email_address"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formState.email}
              onChange={handleChange}
              className={cn(
                "register-form__input",
                errors.email && "register-form__input--error"
              )}
              aria-invalid={!!errors.email}
              aria-describedby={
                errors.email ? "email_address_error" : undefined
              }
            />
            {errors.email && (
              <span
                id="email_address_error"
                className="register-form__error"
              >
                {errors.email}
              </span>
            )}
          </div>

          <div className="register-form__field">
            <Label htmlFor="mobile_number">
              Mobile Number *
            </Label>
            <Input
              id="mobile_number"
              name="mobileNumber"
              type="tel"
              placeholder="Enter your mobile number"
              value={formState.mobileNumber}
              onChange={handleChange}
              className={cn(
                "register-form__input",
                errors.mobileNumber &&
                  "register-form__input--error"
              )}
              aria-invalid={!!errors.mobileNumber}
              aria-describedby={
                errors.mobileNumber
                  ? "mobile_number_error"
                  : undefined
              }
            />
            {errors.mobileNumber && (
              <span
                id="mobile_number_error"
                className="register-form__error"
              >
                {errors.mobileNumber}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="register-form__section">
        <h2 className="register-form__title">Password</h2>

        <div className="register-form__field-row">
          <div className="register-form__field">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formState.password}
              onChange={handleChange}
              className={cn(
                "register-form__input",
                errors.password && "register-form__input--error"
              )}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? "password_error" : undefined
              }
            />
            {errors.password && (
              <span
                id="password_error"
                className="register-form__error"
              >
                {errors.password}
              </span>
            )}
            <p className="register-form__hint">
              Must be at least 6 characters
            </p>
          </div>

          <div className="register-form__field">
            <Label htmlFor="confirm_password">
              Confirm Password *
            </Label>
            <Input
              id="confirm_password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formState.confirmPassword}
              onChange={handleChange}
              className={cn(
                "register-form__input",
                errors.confirmPassword &&
                  "register-form__input--error"
              )}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword
                  ? "confirm_password_error"
                  : undefined
              }
            />
            {errors.confirmPassword && (
              <span
                id="confirm_password_error"
                className="register-form__error"
              >
                {errors.confirmPassword}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Form Level Error */}
      {errors.form && (
        <div className="register-form__alert">
          {errors.form}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="register-form__submit"
        disabled={isLoading}
        size="lg"
      >
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
