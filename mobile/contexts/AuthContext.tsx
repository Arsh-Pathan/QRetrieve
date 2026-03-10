import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { authService, User } from '../services/auth.service';
import { setToken, removeToken } from '../services/api';
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      if (token) {
        authService.getProfile().then(setUser).catch(() => removeToken()).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    await setToken(res.token);
    setUser(res.user);
  };

  const register = async (data: { email: string; password: string; name: string; phone?: string }) => {
    const res = await authService.register(data);
    await setToken(res.token);
    setUser(res.user);
  };

  const logout = async () => {
    await removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
