import { v4 as uuidv4 } from 'uuid';
import { reportRepository } from '../repositories/report.repository';
import { itemRepository } from '../repositories/item.repository';
import { notificationService } from './notification.service';
import { uploadService } from './upload.service';
import { ApiError } from '../utils/ApiError';

export const reportService = {
  create: async (
    itemId: string,
    data: {
      finderName: string;
      finderContact?: string;
      finderLocation: string;
      latitude?: number;
      longitude?: number;
      message?: string;
    },
    file?: Express.Multer.File,
  ) => {
    const item = await itemRepository.findByItemId(itemId);
    if (!item) throw new ApiError(404, 'Item not found');

    const reportId = uuidv4();
    const photoUrl = file ? uploadService.getFileUrl(file.filename) : undefined;

    const report = await reportRepository.create({
      reportId,
      itemId,
      item: item._id as any,
      finderName: data.finderName,
      finderContact: data.finderContact,
      finderLocation: data.finderLocation,
      latitude: data.latitude,
      longitude: data.longitude,
      photoUrl,
      message: data.message,
    });

    await itemRepository.updateByItemId(itemId, { status: 'found' });

    await notificationService.create({
      userId: item.owner.toString(),
      title: 'Item Found!',
      body: `${data.finderName} found your "${item.itemName}" at ${data.finderLocation}`,
      type: 'report',
      relatedItem: (item._id as any).toString(),
      relatedReport: (report._id as any).toString(),
    });

    return report;
  },

  getForItem: (itemId: string) => reportRepository.findByItemId(itemId),

  getForOwner: async (ownerId: string, page: number, limit: number) => {
    const [reports, total] = await Promise.all([
      reportRepository.findForOwner(ownerId, page, limit),
      reportRepository.countForOwner(ownerId),
    ]);
    return { reports, total, page, totalPages: Math.ceil(total / limit) };
  },
};
