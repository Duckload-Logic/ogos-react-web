import { User } from "@/features/users/types/user";

export interface SlipCategory {
  id: number;
  name?: string;
}

export interface SlipStatus {
  id: string;
  name: string;
  colorKey: string;
}

export interface SlipStats {
  id: string;
  name: string;
  colorKey: string;
  count: number;
}

/**
 * Slip response from API
 * Includes iirId instead of userId
 */
export interface Slip {
  id?: string;
  iirId?: string;
  user?: User;
  reason: string;
  dateOfAbsence: string;
  dateNeeded: string;
  adminNotes?: string;
  category?: SlipCategory;
  status?: SlipStatus;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Request payload for creating a slip
 * userId is handled by middleware
 */
export interface CreateSlipRequest {
  reason: string;
  dateOfAbsence: string;
  dateNeeded: string;
  categoryId: number;
}

export interface SlipAttachment {
  id: string;
  slipId: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

/**
 * Paginated response for student slips
 */
export interface PaginatedSlipsResponse {
  slips: Slip[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
