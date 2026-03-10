import { notificationRepository } from '../repositories/notification.repository';
import { Types } from 'mongoose';

export const notificationService = {
  getForUser: (userId: string, page: number, limit: number) =>
    notificationRepository.findByUser(userId, page, limit),

  getUnreadCount: (userId: string) => notificationRepository.countUnread(userId),

  create: (data: {
    userId: string;
    title: string;
    body: string;
    type: 'report' | 'status_change' | 'info';
    relatedItem?: string;
    relatedReport?: string;
  }) =>
    notificationRepository.create({
      user: new Types.ObjectId(data.userId),
      title: data.title,
      body: data.body,
      type: data.type,
      relatedItem: data.relatedItem ? new Types.ObjectId(data.relatedItem) : undefined,
      relatedReport: data.relatedReport ? new Types.ObjectId(data.relatedReport) : undefined,
    }),

  markAllRead: (userId: string) => notificationRepository.markAllRead(userId),
  markRead: (id: string, userId: string) => notificationRepository.markRead(id, userId),
};
