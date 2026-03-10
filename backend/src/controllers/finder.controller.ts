import { Request, Response } from 'express';
import { itemService } from '../services/item.service';
import { reportService } from '../services/report.service';
import { asyncHandler } from '../utils/asyncHandler';

export const finderController = {
  getItemInfo: asyncHandler(async (req: Request, res: Response) => {
    const item = await itemService.getByItemId(req.params.itemId);
    res.json({
      itemId: item.itemId,
      itemName: item.itemName,
      description: item.description,
      photoUrl: item.photoUrl,
      status: item.status,
    });
  }),

  submitReport: asyncHandler(async (req: Request, res: Response) => {
    const report = await reportService.create(req.params.itemId, req.body, req.file);
    res.status(201).json(report);
  }),
};
