import { v4 as uuidv4 } from 'uuid';
import { itemRepository } from '../repositories/item.repository';
import { qrService } from './qr.service';
import { uploadService } from './upload.service';
import { ApiError } from '../utils/ApiError';

export const itemService = {
  create: async (ownerId: string, data: { itemName: string; description?: string }, file?: Express.Multer.File) => {
    const itemId = uuidv4();
    const qrDataUrl = await qrService.generateDataUrl(itemId);
    const photoUrl = file ? uploadService.getFileUrl(file.filename) : undefined;

    return itemRepository.create({
      itemId,
      owner: ownerId as any,
      itemName: data.itemName,
      description: data.description,
      photoUrl,
      qrDataUrl,
    });
  },

  getByOwner: async (ownerId: string, page: number, limit: number) => {
    const [items, total] = await Promise.all([
      itemRepository.findByOwner(ownerId, page, limit),
      itemRepository.countByOwner(ownerId),
    ]);
    return { items, total, page, totalPages: Math.ceil(total / limit) };
  },

  getByItemId: async (itemId: string) => {
    const item = await itemRepository.findByItemId(itemId);
    if (!item) throw new ApiError(404, 'Item not found');
    return item;
  },

  update: async (itemId: string, ownerId: string, data: { itemName?: string; description?: string; status?: string }, file?: Express.Multer.File) => {
    const item = await itemRepository.findByItemId(itemId);
    if (!item) throw new ApiError(404, 'Item not found');
    if (item.owner.toString() !== ownerId) throw new ApiError(403, 'Not authorized');

    const updateData: any = { ...data };
    if (file) updateData.photoUrl = uploadService.getFileUrl(file.filename);

    const updated = await itemRepository.updateByItemId(itemId, updateData);
    return updated;
  },

  delete: async (itemId: string, ownerId: string) => {
    const item = await itemRepository.deleteByItemId(itemId, ownerId);
    if (!item) throw new ApiError(404, 'Item not found or not authorized');
    return item;
  },

  getQrCode: async (itemId: string) => {
    const item = await itemRepository.findByItemId(itemId);
    if (!item) throw new ApiError(404, 'Item not found');
    return {
      dataUrl: await qrService.generateDataUrl(itemId),
      svg: await qrService.generateSvg(itemId),
    };
  },
};
