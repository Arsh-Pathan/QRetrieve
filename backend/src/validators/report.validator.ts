import { z } from 'zod';

export const createReportSchema = z.object({
  body: z.object({
    finderName: z.string().min(1, 'Finder name is required').max(100),
    finderContact: z.string().max(200).optional(),
    finderLocation: z.string().min(1, 'Location is required').max(500),
    latitude: z.coerce.number().min(-90).max(90).optional(),
    longitude: z.coerce.number().min(-180).max(180).optional(),
    message: z.string().max(1000).optional(),
  }),
});
