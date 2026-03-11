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

export interface Slip {
  id?: number;
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

export interface SlipAttachment {
  id: number;
  slipId: number;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}
