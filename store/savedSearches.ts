import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SavedSearch, FilterOptions } from '@/types/car';

interface SavedSearchesState {
  savedSearches: SavedSearch[];
  addSavedSearch: (name: string, filters: FilterOptions) => void;
  removeSavedSearch: (id: string) => void;
  updateSavedSearch: (id: string, name: string, filters: FilterOptions) => void;
}

export const useSavedSearchesStore = create<SavedSearchesState>()(
  persist(
    (set) => ({
      savedSearches: [],
      addSavedSearch: (name: string, filters: FilterOptions) => {
        const newSearch: SavedSearch = {
          id: Date.now().toString(),
          name,
          filters,
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          savedSearches: [...state.savedSearches, newSearch],
        }));
      },
      removeSavedSearch: (id: string) => {
        set((state) => ({
          savedSearches: state.savedSearches.filter((search) => search.id !== id),
        }));
      },
      updateSavedSearch: (id: string, name: string, filters: FilterOptions) => {
        set((state) => ({
          savedSearches: state.savedSearches.map((search) => 
            search.id === id 
              ? { ...search, name, filters, createdAt: new Date().toISOString() } 
              : search
          ),
        }));
      },
    }),
    {
      name: 'saved-searches-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);