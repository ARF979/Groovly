import { create } from 'zustand';
import api, { handleApiError } from '@/lib/api';
import { User, AuthResponse } from '@/types';
import { API_ENDPOINTS, TOKEN_KEY } from '@/config/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      const { token, user } = response.data.data; // Token and user are inside data
      localStorage.setItem(TOKEN_KEY, token);
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, {
        name,
        email,
        password,
      });

      const { token, user } = response.data.data; // Token and user are inside data
      localStorage.setItem(TOKEN_KEY, token);
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },

  loadUser: async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      set({ isAuthenticated: false, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const response = await api.get(API_ENDPOINTS.GET_ME);
      set({
        user: response.data.data,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
