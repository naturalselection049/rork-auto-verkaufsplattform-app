import { create } from 'zustand';
import { CarListing } from '@/types/car';
import { apiService } from '@/services/api';

interface ListingsState {
  listings: CarListing[];
  currentListing: CarListing | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
  };
  
  // Actions
  fetchListings: (filters?: any, page?: number) => Promise<void>;
  fetchListing: (id: string) => Promise<void>;
  createListing: (listingData: Partial<CarListing>) => Promise<CarListing>;
  updateListing: (id: string, listingData: Partial<CarListing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;
  searchListings: (query: string, filters?: any) => Promise<void>;
  clearError: () => void;
  clearCurrentListing: () => void;
  loadMoreListings: () => Promise<void>;
}

export const useListingsStore = create<ListingsState>((set, get) => ({
  listings: [],
  currentListing: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 20,
  },

  fetchListings: async (filters = {}, page = 1) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiService.getCarListings({
        ...filters,
        page,
        limit: get().pagination.limit,
      });
      
      set({
        listings: page === 1 ? response.listings : [...get().listings, ...response.listings],
        pagination: {
          page: response.page,
          totalPages: response.totalPages,
          total: response.total,
          limit: get().pagination.limit,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch listings',
        isLoading: false,
      });
    }
  },

  fetchListing: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const listing = await apiService.getCarListing(id);
      set({
        currentListing: listing,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch listing',
        isLoading: false,
      });
    }
  },

  createListing: async (listingData: Partial<CarListing>) => {
    set({ isLoading: true, error: null });
    
    try {
      const newListing = await apiService.createListing(listingData);
      
      set((state) => ({
        listings: [newListing, ...state.listings],
        isLoading: false,
      }));
      
      return newListing;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create listing',
        isLoading: false,
      });
      throw error;
    }
  },

  updateListing: async (id: string, listingData: Partial<CarListing>) => {
    set({ isLoading: true, error: null });
    
    try {
      const updatedListing = await apiService.updateCarListing(id, listingData);
      
      set((state) => ({
        listings: state.listings.map(listing => 
          listing.id === id ? updatedListing : listing
        ),
        currentListing: state.currentListing?.id === id ? updatedListing : state.currentListing,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update listing',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteListing: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await apiService.deleteCarListing(id);
      
      set((state) => ({
        listings: state.listings.filter(listing => listing.id !== id),
        currentListing: state.currentListing?.id === id ? null : state.currentListing,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete listing',
        isLoading: false,
      });
      throw error;
    }
  },

  searchListings: async (query: string, filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await apiService.searchListings(query, filters);
      
      set({
        listings: response.listings,
        pagination: {
          page: 1,
          totalPages: Math.ceil(response.total / get().pagination.limit),
          total: response.total,
          limit: get().pagination.limit,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Search failed',
        isLoading: false,
      });
    }
  },

  loadMoreListings: async () => {
    const { pagination } = get();
    
    if (pagination.page < pagination.totalPages && !get().isLoading) {
      await get().fetchListings({}, pagination.page + 1);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentListing: () => {
    set({ currentListing: null });
  },
}));