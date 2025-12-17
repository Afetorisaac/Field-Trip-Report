import { defineStore } from 'pinia';
import { authAPI } from '@/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isProcurement: (state) => state.user?.role === 'procurement',
    isDeptHead: (state) => state.user?.role === 'dept_head',
    isRequester: (state) => state.user?.role === 'requester',
    userRole: (state) => state.user?.role || null
  },

  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authAPI.login(credentials);
        this.user = response.data.user;
        this.token = response.data.token;
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Login failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(userData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await authAPI.register(userData);
        this.user = response.data.user;
        this.token = response.data.token;
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.error || 'Registration failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchProfile() {
      try {
        const response = await authAPI.getProfile();
        this.user = response.data.user;
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to fetch profile';
        throw error;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }
});
