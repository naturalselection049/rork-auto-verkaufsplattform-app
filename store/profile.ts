import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserProfile } from '@/types/forum';

interface ProfileState {
  profile: UserProfile;
  updateProfile: (profile: UserProfile) => void;
  updateSettings: (settings: UserProfile['settings']) => void;
}

const defaultProfile: UserProfile = {
  id: 'currentUser',
  name: 'Max Mustermann',
  email: 'max.mustermann@example.com',
  avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  settings: {
    darkMode: false,
    pushNotifications: true,
    locationServices: true,
  },
  notifications: {
    messages: true,
    forumReplies: true,
    newListings: true,
  },
  privacy: {
    publicProfile: true,
    showActivity: true,
    dataForAds: false,
  },
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: defaultProfile,
      
      updateProfile: (profile: UserProfile) => {
        set({ profile });
      },
      
      updateSettings: (settings: UserProfile['settings']) => {
        set((state) => ({
          profile: {
            ...state.profile,
            settings,
          },
        }));
      },
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);