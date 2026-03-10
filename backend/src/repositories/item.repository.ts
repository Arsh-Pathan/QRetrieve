import { Item, IItem } from '../models/Item';

export const itemRepository = {
  findByItemId: (itemId: string) => Item.findOne({ itemId }),
  findByOwner: (ownerId: string, page: number, limit: number) =>
    Item.find({ owner: ownerId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
  countByOwner: (ownerId: string) => Item.countDocuments({ owner: ownerId }),
  create: (data: Partial<IItem>) => Item.create(data),
  updateByItemId: (itemId: string, data: Partial<IItem>) =>
    Item.findOneAndUpdate({ itemId }, data, { new: true }),
  deleteByItemId: (itemId: string, ownerId: string) =>
    Item.findOneAndDelete({ itemId, owner: ownerId }),
};
