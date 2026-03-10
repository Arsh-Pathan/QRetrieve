import { Response } from 'express';
import { itemService } from '../services/item.service';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';

export const itemController = {
  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const item = await itemService.create(req.userId!, req.body, req.file);
    res.status(201).json(item);
  }),

  getMyItems: asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await itemService.getByOwner(req.userId!, page, limit);
    res.json(result);
  }),

  getByItemId: asyncHandler(async (req: AuthRequest, res: Response) => {
    const item = await itemService.getByItemId(req.params.itemId);
    res.json(item);
  }),

  update: asyncHandler(async (req: AuthRequest, res: Response) => {
    const item = await itemService.update(req.params.itemId, req.userId!, req.body, req.file);
    res.json(item);
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    await itemService.delete(req.params.itemId, req.userId!);
    res.json({ message: 'Item deleted' });
  }),

  getQrCode: asyncHandler(async (req: AuthRequest, res: Response) => {
    const qr = await itemService.getQrCode(req.params.itemId);
    res.json(qr);
  }),
};
