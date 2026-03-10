import { Response } from 'express';
import { notificationService } from '../services/notification.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';

export const notificationController = {
  getNotifications: asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const [notifications, unreadCount] = await Promise.all([
      notificationService.getForUser(req.userId!, page, limit),
      notificationService.getUnreadCount(req.userId!),
    ]);
    res.json({ notifications, unreadCount });
  }),

  markAllRead: asyncHandler(async (req: AuthRequest, res: Response) => {
    await notificationService.markAllRead(req.userId!);
    res.json({ message: 'All notifications marked as read' });
  }),

  markRead: asyncHandler(async (req: AuthRequest, res: Response) => {
    const notification = await notificationService.markRead(req.params.id, req.userId!);
    res.json(notification);
  }),
};
