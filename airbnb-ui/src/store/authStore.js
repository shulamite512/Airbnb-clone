import { create } from 'zustand';
import { authApi } from '../lib/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  // Initialize auth state by checking current session
  initAuth: async () => {
    try {
      const resp = await authApi.getCurrentUser();
      // backend may return either { user: {...} } or the user object directly
      const user = resp?.user ? resp.user : resp;
      set({ user, isAuthenticated: !!user, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  // Login
  login: async (credentials) => {
    const data = await authApi.login(credentials);
    set({ user: data.user, isAuthenticated: true });
    return data;
  },

  // Signup
  signup: async (userData) => {
    const data = await authApi.signup(userData);
    set({ user: data.user, isAuthenticated: true });
    return data;
  },

  // Logout
  logout: async () => {
    await authApi.logout();
    set({ user: null, isAuthenticated: false });
  },

  // Update user profile
  updateUser: (userData) => {
    set({ user: { ...get().user, ...userData } });
  },

  // Check if user is owner
  isOwner: () => {
    return get().user?.user_type === 'owner';
  },

  // Check if user is traveler
  isTraveler: () => {
    return get().user?.user_type === 'traveler';
  },
}));
