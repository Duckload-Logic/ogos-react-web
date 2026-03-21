/**
 * IDP (Identity Provider) OAuth 2.0 Type Definitions
 * Types for OAuth 2.0 Authorization Code flow with PKCE
 */

/**
 * Response from GET /auth/idp/authorize-url endpoint
 * Contains the authorization URL to redirect user to IDP
 */
export interface IDPAuthorizeResponse {
  authorizationUrl: string;
}

/**
 * Request payload for POST /auth/idp/token endpoint
 * Contains authorization code and state from IDP callback
 */
export interface IDPTokenExchangeRequest {
  code: string;
}

/**
 * Response from POST /auth/idp/token endpoint
 * Tokens are set as HTTP-only cookies by the server
 */
export interface IDPTokenExchangeResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

/**
 * Role-based dashboard route mapping
 * Maps role_id to corresponding dashboard path
 */
export const ROLE_ROUTES_INTERNAL = Object.freeze({
  student: "/student/home",
  admin: "/admin/home",
  superadmin: "/superadmin/home",
} as const);

/**
 * User-facing error messages for IDP authentication
 */
export const IDP_ERROR_MESSAGES = Object.freeze({
  AUTHORIZATION_FAILED: "Failed to get authorization URL",
  TOKEN_EXCHANGE_FAILED: "Authentication failed",
  INVALID_STATE: "Invalid authentication state",
  MISSING_CODE: "Authentication code missing",
  UNKNOWN_ROLE: "Unauthorized role",
} as const);

/**
 * Error auto-dismiss timeout in milliseconds
 */
export const ERROR_DISMISS_TIMEOUT = 10000;

/**
 * Button text constants
 */
export const IDP_BUTTON_TEXT = Object.freeze({
  LOGIN: "Login with IDP",
  LOADING: "Redirecting...",
} as const);
