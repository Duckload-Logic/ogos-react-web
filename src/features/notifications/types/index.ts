export interface NotificationEntry {
  id: string;
  receiverId?: string | null;
  actorId?: string | null;
  targetId?: string | null;
  targetType?: string | null;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface ListNotificationsResponse {
  notifications: NotificationEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
