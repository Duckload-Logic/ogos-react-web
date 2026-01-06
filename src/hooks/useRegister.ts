import { useState } from "react";

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  birthDate: string;
  placeOfBirth: string;
  email: string;
  mobileNumber: string;
  password: string;
}

interface UseRegisterReturn {
  isLoading: boolean;
  error: string | null;
  register: (payload: RegisterPayload) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for registration logic
 */
export function useRegister(): UseRegisterReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (
    payload: RegisterPayload
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Implement API call to register user
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.message || "Registration failed"
        );
      }

      // Handle successful registration
      console.log("Registration successful");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "An error occurred during registration";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    register,
    clearError,
  };
}
