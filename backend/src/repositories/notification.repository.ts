import { Notification, INotification } from '../models/Notification';

export const notificationRepository = {
  findByUser: (userId: string, page: number, limit: number) =>
    Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  countUnread: (userId: string) => Notification.countDocuments({ user: userId, read: false }),
  create: (data: Partial<INotification>) => Notification.create(data),
  markAllRead: (userId: string) =>
    Notification.updateMany({ user: userId, read: false }, { read: true }),
  markRead: (id: string, userId: string) =>
    Notification.findOneAndUpdate({ _id: id, user: userId }, { read: true }, { new: true }),
};
