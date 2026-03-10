import { api } from './api';

export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  register: (data: { email: string; password: string; name: string; phone?: string }) =>
    api.post<AuthResponse>('/auth/register', data),
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
  getProfile: () => api.get<User>('/auth/me'),
};
