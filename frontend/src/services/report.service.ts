import { api } from './api';

export interface Report {
  _id: string;
  reportId: string;
  itemId: string;
  finderName: string;
  finderContact?: string;
  finderLocation: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  message?: string;
  createdAt: string;
}

interface ReportsResponse {
  reports: Report[];
  total: number;
  page: number;
  totalPages: number;
}

export const reportService = {
  getMyReports: (page = 1, limit = 20) =>
    api.get<ReportsResponse>(`/reports?page=${page}&limit=${limit}`),

  getForItem: (itemId: string) => api.get<Report[]>(`/reports/item/${itemId}`),
};

// Public finder API (no auth)
export const finderService = {
  getItemInfo: async (itemId: string) => {
    const res = await fetch(`/api/v1/finder/${itemId}`);
    if (!res.ok) throw new Error('Item not found');
    return res.json();
  },

  submitReport: async (itemId: string, data: FormData) => {
    const res = await fetch(`/api/v1/finder/${itemId}/report`, {
      method: 'POST',
      body: data,
    });
    if (!res.ok) throw new Error('Failed to submit report');
    return res.json();
  },
};
