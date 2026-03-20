/**
 * IDPLoginButton Component
 * Initiates OAuth 2.0 Authorization Code flow with IDP
 */

import { useState } from "react";
import { GetIDPAuthorize } from "../services";
import { IDP_BUTTON_TEXT, IDP_ERROR_MESSAGES } from "../types/idp";

/**
 * Props for IDPLoginButton component
 */
export interface IDPLoginButtonProps {
  /**
   * Optional callback when an error occurs
   * @param error - Error message to display
   */
  onError?: (error: string) => void;

  /**
   * Optional CSS class name for styling
   */
  className?: string;

  /**
   * Optional flag to disable the button
   */
  disabled?: boolean;
}

/**
 * Button component that initiates IDP OAuth 2.0 login flow
 * Fetches authorization URL and redirects user to IDP
 *
 * @param props - Component props
 * @returns JSX element
 */
export const IDPLoginButton: React.FC<IDPLoginButtonProps> = ({
  onError,
  className = "",
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handles button click to initiate OAuth flow
   * Fetches authorization URL and redirects to IDP
   */
  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const response = await GetIDPAuthorize();

      // Redirect to IDP authorization URL
      window.location.href = response.authorizationUrl;
    } catch (error) {
      setIsLoading(false);

      const errorMessage = error instanceof Error
        ? error.message
        : IDP_ERROR_MESSAGES.AUTHORIZATION_FAILED;

      console.error(
        `[IDPLoginButton] {Fetch Authorization URL}: ${error}`,
      );

      if (onError) {
        onError(errorMessage);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogin}
      disabled={disabled || isLoading}
      className={className}
      aria-busy={isLoading}
      aria-label={
        isLoading
          ? IDP_BUTTON_TEXT.LOADING
          : IDP_BUTTON_TEXT.LOGIN
      }
    >
      {isLoading ? IDP_BUTTON_TEXT.LOADING : IDP_BUTTON_TEXT.LOGIN}
    </button>
  );
};
