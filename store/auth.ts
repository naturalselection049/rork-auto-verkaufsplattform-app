import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiService } from '@/services/api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  verified: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock successful login for demo purposes
          const mockUser = {
            id: Date.now().toString(),
            email: email,
            firstName: 'Demo',
            lastName: 'User',
            verified: true,
            createdAt: new Date().toISOString(),
          };
          
          // Store mock token and user
          await AsyncStorage.setItem('auth_token', 'mock_token_' + Date.now());
          await AsyncStorage.setItem('user', JSON.stringify(mockUser));
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed',
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock successful registration for demo purposes
          const mockUser = {
            id: Date.now().toString(),
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
            verified: false,
            createdAt: new Date().toISOString(),
          };
          
          // Store mock token and user
          await AsyncStorage.setItem('auth_token', 'mock_token_' + Date.now());
          await AsyncStorage.setItem('user', JSON.stringify(mockUser));
          
          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Registration failed',
            isLoading: false 
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        
        try {
          await apiService.logout();
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null
          });
        } catch (error) {
          // Even if logout fails on server, clear local state
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false,
            error: null
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        
        try {
          const updatedUser = await apiService.updateUserProfile(profileData);
          set({ 
            user: updatedUser, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Profile update failed',
            isLoading: false 
          });
          throw error;
        }
      },

      checkAuthStatus: async () => {
        const token = await AsyncStorage.getItem('auth_token');
        const userString = await AsyncStorage.getItem('user');
        
        if (token && userString) {
          try {
            const user = JSON.parse(userString);
            // Verify token is still valid
            await apiService.getUserProfile();
            set({ 
              user, 
              isAuthenticated: true 
            });
          } catch (error) {
            // Token is invalid, clear auth state
            await get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);