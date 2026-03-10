import { Response } from 'express';
import { reportService } from '../services/report.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';

export const reportController = {
  getMyReports: asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await reportService.getForOwner(req.userId!, page, limit);
    res.json(result);
  }),

  getForItem: asyncHandler(async (req: AuthRequest, res: Response) => {
    const reports = await reportService.getForItem(req.params.itemId);
    res.json(reports);
  }),
};
