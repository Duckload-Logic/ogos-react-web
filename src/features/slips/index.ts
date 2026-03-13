/**
 * Slips Feature - Public API
 * Use this file to export public components, hooks, and services.
 */

// Types
export type {
  Slip,
  SlipStatus,
  SlipAttachment,
} from "./types";

// Query Hooks
export {
  useGetAllSlips,
  useGetMySlips,
  useGetSlipAttachments,
  useGetSlipStatuses,
  useSlipLogs,
} from "./hooks";

// Mutation Hooks
export {
  useSubmitSlip,
  useUpdateSlipStatus,
} from "./hooks";

// Services (re-export for legacy imports)
export * from "./services";

// Pages
export { default as ReviewSlips } from "./pages/admin/ReviewSlips";
export { default as SlipLogs } from "./pages/admin/SlipLogs";
