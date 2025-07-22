import AsyncStorage from '@react-native-async-storage/async-storage';
import { CarListing, SavedSearch, Message } from '@/types/car';
import { ForumPost } from '@/types/forum';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: any }> {
    const response = await this.makeRequest<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    await AsyncStorage.setItem('auth_token', response.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }): Promise<{ token: string; user: any }> {
    const response = await this.makeRequest<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    await AsyncStorage.setItem('auth_token', response.token);
    await AsyncStorage.setItem('user', JSON.stringify(response.user));
    
    return response;
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user');
  }

  // Car Listings
  async getCarListings(filters?: {
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    minYear?: number;
    maxYear?: number;
    fuelType?: string[];
    transmission?: string[];
    location?: string;
    keyword?: string;
    page?: number;
    limit?: number;
  }): Promise<{ listings: CarListing[]; total: number; page: number; totalPages: number }> {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v.toString()));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }

    return this.makeRequest<{ listings: CarListing[]; total: number; page: number; totalPages: number }>(
      `/listings?${queryParams.toString()}`
    );
  }

  async getCarListing(id: string): Promise<CarListing> {
    return this.makeRequest<CarListing>(`/listings/${id}`);
  }

  async createCarListing(listingData: Partial<CarListing>): Promise<CarListing> {
    return this.makeRequest<CarListing>('/listings', {
      method: 'POST',
      body: JSON.stringify(listingData),
    });
  }

  async updateCarListing(id: string, listingData: Partial<CarListing>): Promise<CarListing> {
    return this.makeRequest<CarListing>(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listingData),
    });
  }

  async deleteCarListing(id: string): Promise<void> {
    await this.makeRequest(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  async uploadCarImages(listingId: string, images: string[]): Promise<string[]> {
    const formData = new FormData();
    
    images.forEach((imageUri, index) => {
      formData.append('images', {
        uri: imageUri,
        type: 'image/jpeg',
        name: `image_${index}.jpg`,
      } as any);
    });

    const response = await fetch(`${API_BASE_URL}/listings/${listingId}/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${await this.getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload images');
    }

    const result = await response.json();
    return result.imageUrls;
  }

  // VIN Lookup
  async lookupVin(vin: string): Promise<{
    success: boolean;
    data?: Partial<CarListing>;
    message?: string;
  }> {
    return this.makeRequest<{
      success: boolean;
      data?: Partial<CarListing>;
      message?: string;
    }>('/vin/lookup', {
      method: 'POST',
      body: JSON.stringify({ vin }),
    });
  }

  // Favorites
  async getFavorites(): Promise<string[]> {
    const response = await this.makeRequest<{ favorites: string[] }>('/favorites');
    return response.favorites;
  }

  async addToFavorites(listingId: string): Promise<void> {
    await this.makeRequest('/favorites', {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    });
  }

  async removeFromFavorites(listingId: string): Promise<void> {
    await this.makeRequest(`/favorites/${listingId}`, {
      method: 'DELETE',
    });
  }

  // Saved Searches
  async getSavedSearches(): Promise<SavedSearch[]> {
    const response = await this.makeRequest<{ searches: SavedSearch[] }>('/saved-searches');
    return response.searches;
  }

  async createSavedSearch(searchData: Omit<SavedSearch, 'id' | 'createdAt'>): Promise<SavedSearch> {
    return this.makeRequest<SavedSearch>('/saved-searches', {
      method: 'POST',
      body: JSON.stringify(searchData),
    });
  }

  async deleteSavedSearch(searchId: string): Promise<void> {
    await this.makeRequest(`/saved-searches/${searchId}`, {
      method: 'DELETE',
    });
  }

  // Forum
  async getForumPosts(category?: string, page = 1, limit = 20): Promise<{
    posts: ForumPost[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(category && { category }),
    });

    return this.makeRequest<{
      posts: ForumPost[];
      total: number;
      page: number;
      totalPages: number;
    }>(`/forum/posts?${queryParams.toString()}`);
  }

  async getForumPost(postId: string): Promise<ForumPost> {
    return this.makeRequest<ForumPost>(`/forum/posts/${postId}`);
  }

  async createForumPost(postData: Omit<ForumPost, 'id' | 'createdAt' | 'updatedAt' | 'likesCount' | 'repliesCount'>): Promise<ForumPost> {
    return this.makeRequest<ForumPost>('/forum/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async likeForumPost(postId: string): Promise<void> {
    await this.makeRequest(`/forum/posts/${postId}/like`, {
      method: 'POST',
    });
  }

  async unlikeForumPost(postId: string): Promise<void> {
    await this.makeRequest(`/forum/posts/${postId}/like`, {
      method: 'DELETE',
    });
  }

  // Messages
  async getConversations(): Promise<any[]> {
    const response = await this.makeRequest<{ conversations: any[] }>('/messages/conversations');
    return response.conversations;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await this.makeRequest<{ messages: Message[] }>(`/messages/conversations/${conversationId}`);
    return response.messages;
  }

  async sendMessage(recipientId: string, content: string, listingId?: string): Promise<Message> {
    return this.makeRequest<Message>('/messages', {
      method: 'POST',
      body: JSON.stringify({
        recipientId,
        content,
        listingId,
      }),
    });
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    await this.makeRequest(`/messages/${messageId}/read`, {
      method: 'PUT',
    });
  }

  // External Data Integration
  async syncExternalListings(): Promise<{ synced: number; errors: string[] }> {
    return this.makeRequest<{ synced: number; errors: string[] }>('/admin/sync-external', {
      method: 'POST',
    });
  }

  // Search
  async searchListings(query: string, filters?: any): Promise<{
    listings: CarListing[];
    total: number;
    suggestions: string[];
  }> {
    return this.makeRequest<{
      listings: CarListing[];
      total: number;
      suggestions: string[];
    }>('/search', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
  }

  // Analytics
  async trackEvent(event: string, properties?: Record<string, any>): Promise<void> {
    try {
      await this.makeRequest('/analytics/track', {
        method: 'POST',
        body: JSON.stringify({ event, properties }),
      });
    } catch (error) {
      // Analytics errors shouldn't break the app
      console.warn('Analytics tracking failed:', error);
    }
  }

  // User Profile
  async getUserProfile(): Promise<any> {
    return this.makeRequest<any>('/user/profile');
  }

  async updateUserProfile(profileData: any): Promise<any> {
    return this.makeRequest<any>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUserListings(): Promise<CarListing[]> {
    const response = await this.makeRequest<{ listings: CarListing[] }>('/user/listings');
    return response.listings;
  }

  async getUserForumPosts(): Promise<ForumPost[]> {
    const response = await this.makeRequest<{ posts: ForumPost[] }>('/user/forum-posts');
    return response.posts;
  }
}

export const apiService = new ApiService();