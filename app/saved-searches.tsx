import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Bookmark, X, Search, Heart } from 'lucide-react-native';
import { useSavedSearchesStore } from '@/store/savedSearches';
import { useFavoritesStore } from '@/store/favorites';
import { useFiltersStore } from '@/store/filters';
import { Colors } from '@/constants/colors';
import { EmptyState } from '@/components/EmptyState';
import { SavedSearch, CarListing } from '@/types/car';
import { carListings } from '@/mocks/cars';

export default function SavedSearchesScreen() {
  const router = useRouter();
  const { savedSearches, removeSavedSearch } = useSavedSearchesStore();
  const { favorites, removeFavorite } = useFavoritesStore();
  const { setFilter, resetFilters } = useFiltersStore();
  const [activeTab, setActiveTab] = useState<'searches' | 'favorites'>('favorites');
  const [favoriteCars, setFavoriteCars] = useState<CarListing[]>([]);
  
  useEffect(() => {
    // Get all favorite cars
    const cars = carListings.filter(car => favorites.includes(car.id));
    setFavoriteCars(cars);
  }, [favorites]);
  
  const applySearch = (searchId: string) => {
    const search = savedSearches.find(s => s.id === searchId);
    if (!search) return;
    
    // Reset current filters and apply saved ones
    resetFilters();
    
    // Apply each filter
    Object.entries(search.filters).forEach(([key, value]) => {
      if (value !== undefined) {
        setFilter(key as any, value as any);
      }
    });
    
    // Navigate back to home screen
    router.push('/');
  };

  const renderSearchItem = ({ item }: { item: SavedSearch }) => (
    <Pressable 
      style={styles.searchItem} 
      onPress={() => applySearch(item.id)}
    >
      <View style={styles.searchItemContent}>
        <View style={styles.searchItemHeader}>
          <View style={styles.searchItemTitleContainer}>
            <Bookmark size={16} color={Colors.primary} style={styles.searchItemIcon} />
            <Text style={styles.searchItemTitle}>{item.name}</Text>
          </View>
          <Pressable 
            style={styles.deleteButton}
            onPress={() => removeSavedSearch(item.id)}
          >
            <X size={16} color={Colors.secondaryText} />
          </Pressable>
        </View>
        
        <View style={styles.filterTags}>
          {Object.entries(item.filters).map(([key, value], index) => {
            if (!value) return null;
            
            let displayText = '';
            
            switch (key) {
              case 'brand':
                displayText = `Marke: ${value}`;
                break;
              case 'minPrice':
                displayText = `Preis ab: ${value}€`;
                break;
              case 'maxPrice':
                displayText = `Preis bis: ${value}€`;
                break;
              case 'minYear':
                displayText = `Baujahr ab: ${value}`;
                break;
              case 'maxYear':
                displayText = `Baujahr bis: ${value}`;
                break;
              case 'fuelType':
                if (Array.isArray(value) && value.length > 0) {
                  displayText = `Kraftstoff: ${value.join(', ')}`;
                }
                break;
              case 'transmission':
                if (Array.isArray(value) && value.length > 0) {
                  displayText = `Getriebe: ${value.join(', ')}`;
                }
                break;
              case 'keyword':
                displayText = `Suchbegriff: ${value}`;
                break;
              default:
                return null;
            }
            
            return displayText ? (
              <View key={index} style={styles.filterTag}>
                <Text style={styles.filterTagText}>{displayText}</Text>
              </View>
            ) : null;
          })}
        </View>
        
        <Text style={styles.searchDate}>
          Gespeichert am {new Date(item.createdAt).toLocaleDateString('de-DE')}
        </Text>
      </View>
    </Pressable>
  );

  const renderFavoriteItem = ({ item }: { item: CarListing }) => (
    <Pressable 
      style={styles.favoriteItem}
      onPress={() => router.push(`/car/${item.id}`)}
    >
      <Image 
        source={{ uri: item.images[0] }}
        style={styles.favoriteImage}
        contentFit="cover"
      />
      <View style={styles.favoriteContent}>
        <Text style={styles.favoriteTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.favoritePrice}>{item.price.toLocaleString()} €</Text>
        <View style={styles.favoriteSpecs}>
          <Text style={styles.favoriteSpecText}>{item.year}</Text>
          <Text style={styles.favoriteSpecText}>{item.mileage.toLocaleString()} km</Text>
          <Text style={styles.favoriteSpecText}>{item.fuelType}</Text>
        </View>
      </View>
      <Pressable 
        style={styles.removeFavoriteButton}
        onPress={() => removeFavorite(item.id)}
      >
        <Heart size={20} color={Colors.favorite} fill={Colors.favorite} />
      </Pressable>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Gespeicherte Inhalte</Text>
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
            onPress={() => setActiveTab('favorites')}
          >
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
              Favoriten
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'searches' && styles.activeTab]}
            onPress={() => setActiveTab('searches')}
          >
            <Text style={[styles.tabText, activeTab === 'searches' && styles.activeTabText]}>
              Suchen
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'searches' ? (
        <FlatList
          data={savedSearches}
          renderItem={renderSearchItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState 
              title="Keine gespeicherten Suchen"
              message="Speichere deine Suchfilter, um schnell auf sie zugreifen zu können."
              icon={<Search size={48} color={Colors.secondaryText} />}
            />
          }
        />
      ) : (
        <FlatList
          data={favoriteCars}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState 
              title="Keine Favoriten"
              message="Markiere Fahrzeuge als Favoriten, um sie hier zu sehen."
              icon={<Heart size={48} color={Colors.secondaryText} />}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  activeTabText: {
    color: Colors.background,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  searchItem: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  searchItemContent: {
    padding: 16,
  },
  searchItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchItemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchItemIcon: {
    marginRight: 8,
  },
  searchItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  deleteButton: {
    padding: 4,
  },
  filterTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterTag: {
    backgroundColor: Colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  filterTagText: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  searchDate: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  favoriteImage: {
    width: 100,
    height: 100,
  },
  favoriteContent: {
    flex: 1,
    padding: 12,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  favoritePrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.price,
    marginBottom: 8,
  },
  favoriteSpecs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  favoriteSpecText: {
    fontSize: 12,
    color: Colors.secondaryText,
    backgroundColor: Colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  removeFavoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});