import { Report, IReport } from '../models/Report';

export const reportRepository = {
  findByItemId: (itemId: string) => Report.find({ itemId }).sort({ createdAt: -1 }),
  findByReportId: (reportId: string) => Report.findOne({ reportId }),
  findForOwner: async (ownerId: string, page: number, limit: number) => {
    const { Item } = await import('../models/Item');
    const items = await Item.find({ owner: ownerId }).select('itemId');
    const itemIds = items.map((i) => i.itemId);
    return Report.find({ itemId: { $in: itemIds } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
  },
  countForOwner: async (ownerId: string) => {
    const { Item } = await import('../models/Item');
    const items = await Item.find({ owner: ownerId }).select('itemId');
    const itemIds = items.map((i) => i.itemId);
    return Report.countDocuments({ itemId: { $in: itemIds } });
  },
  create: (data: Partial<IReport>) => Report.create(data),
};
