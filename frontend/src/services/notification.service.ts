import { api } from './api';

export interface Notification {
  _id: string;
  title: string;
  body: string;
  type: 'report' | 'status_change' | 'info';
  read: boolean;
  createdAt: string;
}

interface NotificationsResponse {
  notifications: Notification[];
  unreadCount: number;
}

export const notificationService = {
  getNotifications: (page = 1, limit = 20) =>
    api.get<NotificationsResponse>(`/notifications?page=${page}&limit=${limit}`),
  markAllRead: () => api.put('/notifications/read-all'),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
};
