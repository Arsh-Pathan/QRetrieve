import { z } from 'zod';

export const createItemSchema = z.object({
  body: z.object({
    itemName: z.string().min(1, 'Item name is required').max(200),
    description: z.string().max(1000).optional(),
  }),
});

export const updateItemSchema = z.object({
  body: z.object({
    itemName: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    status: z.enum(['safe', 'lost', 'found']).optional(),
  }),
});
