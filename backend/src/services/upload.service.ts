import { config } from '../config';

export const uploadService = {
  getFileUrl: (filename: string): string => {
    return `/uploads/${filename}`;
  },

  getFullUrl: (filename: string): string => {
    return `${config.baseUrl}/uploads/${filename}`;
  },
};
