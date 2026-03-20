/**
 * TypeScript interfaces for Significant Notes feature
 * Matches backend SignificantNoteDTO structure
 */

export interface SignificantNote {
  id?: number;
  note: string;
  remarks: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNoteRequest {
  note: string;
  remarks: string;
}
