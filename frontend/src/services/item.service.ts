import { api } from './api';

export interface Item {
  _id: string;
  itemId: string;
  itemName: string;
  description?: string;
  photoUrl?: string;
  status: 'safe' | 'lost' | 'found';
  qrDataUrl?: string;
  createdAt: string;
}

interface ItemsResponse {
  items: Item[];
  total: number;
  page: number;
  totalPages: number;
}

export const itemService = {
  getMyItems: (page = 1, limit = 20) =>
    api.get<ItemsResponse>(`/items?page=${page}&limit=${limit}`),

  create: (data: FormData) => api.post<Item>('/items', data),

  update: (itemId: string, data: FormData) => api.put<Item>(`/items/${itemId}`, data),

  delete: (itemId: string) => api.delete(`/items/${itemId}`),

  getQrCode: (itemId: string) =>
    api.get<{ dataUrl: string; svg: string }>(`/items/${itemId}/qr`),
};
