// API Key types
export interface APIKey {
  id: number;
  name: string;
  keyPrefix: string;
  scopes?: string[];
  isActive: boolean;
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface CreateAPIKeyRequest {
  name: string;
  scopes?: string[];
  expiresAt?: string;
}

export interface CreateAPIKeyResponse extends APIKey {
  key: string;
}

// System Log types
export interface SystemLog {
  id: number;
  category: string;
  action: string;
  message: string;
  userEmail?: string;
  targetEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface SystemLogsResponse {
  logs: SystemLog[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SystemLogsParams {
  page?: number;
  page_size?: number;
  category?: string;
  action?: string;
  search?: string;
  user_email?: string;
  start_date?: string;
  end_date?: string;
}

export interface LogStats {
  category: string;
  count: number;
}
