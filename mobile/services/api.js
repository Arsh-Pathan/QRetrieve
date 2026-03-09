import { API_BASE } from '../constants/config';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  return response.json();
};

export const createItem = async (data) => {
  const res = await fetch(`${API_BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const getItems = async () => {
  const res = await fetch(`${API_BASE}/items`);
  return handleResponse(res);
};

export const getItemByItemId = async (itemId) => {
  const res = await fetch(`${API_BASE}/items/${itemId}`);
  return handleResponse(res);
};

export const getQRCode = async (itemId, format = 'dataurl') => {
  const res = await fetch(`${API_BASE}/items/${itemId}/qr?format=${format}`);
  return handleResponse(res);
};

export const submitReport = async (data) => {
  const res = await fetch(`${API_BASE}/report-found`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const getReports = async () => {
  const res = await fetch(`${API_BASE}/reports`);
  return handleResponse(res);
};

export const getReportsByItemId = async (itemId) => {
  const res = await fetch(`${API_BASE}/reports/${itemId}`);
  return handleResponse(res);
};
