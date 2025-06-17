import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, FlatList, Text, ActivityIndicator, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { CarListItem } from '@/components/CarListItem';
import { Colors } from '@/constants/colors';
import { CarListing } from '@/types/car';
import { fetchListingsFromAllSources } from '@/services/dataAggregation';
import { Search, Filter, Bookmark, ChevronRight } from 'lucide-react-native';
import { useFiltersStore } from '@/store/filters';
import { useSavedSearchesStore } from '@/store/savedSearches';

export default function HomeScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [carListings, setCarListings] = useState<CarListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);
  const { filters, resetFilters } = useFiltersStore();
  const { savedSearches } = useSavedSearchesStore();
  
  // Count active filters
  const activeFiltersCount = Object.keys(filters).length;
  
  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      try {
        const listings = await fetchListingsFromAllSources();
        setCarListings(listings);
      } catch (error) {
        console.error('Error loading listings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadListings();
  }, []);

  const filteredCars = carListings.filter(car => 
    searchQuery ? (
      car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) : true
  );

  const focusSearch = () => {
    searchInputRef.current?.focus();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <FlatList
        data={filteredCars}
        renderItem={({ item }) => <CarListItem car={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <View style={styles.searchContainer}>
              <Pressable style={styles.searchBar} onPress={focusSearch}>
                <Search size={20} color={Colors.secondaryText} style={styles.searchIcon} />
                <TextInput
                  ref={searchInputRef}
                  style={styles.searchInput}
                  placeholder="Marke, Modell oder Stichwort"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  clearButtonMode="while-editing"
                />
              </Pressable>
              
              <Link href="/filter" asChild>
                <Pressable style={styles.filterButton}>
                  <Filter size={20} color={Colors.primary} />
                  {activeFiltersCount > 0 && (
                    <View style={styles.filterBadge}>
                      <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
                    </View>
                  )}
                </Pressable>
              </Link>
            </View>
            
            {activeFiltersCount > 0 && (
              <Pressable style={styles.resetButton} onPress={resetFilters}>
                <Text style={styles.resetText}>Filter zurücksetzen</Text>
              </Pressable>
            )}
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickFiltersContainer}
            >
              <FilterChip label="Preis" />
              <FilterChip label="Marke" />
              <FilterChip label="Kilometer" />
              <FilterChip label="Baujahr" />
              <FilterChip label="Kraftstoff" />
              <FilterChip label="Leistung" />
              <FilterChip label="Getriebe" />
              <FilterChip label="Farbe" />
            </ScrollView>
            
            <Link href="/saved-searches" asChild>
              <Pressable style={styles.savedSearchesButton}>
                <Bookmark size={20} color={Colors.primary} />
                <Text style={styles.savedSearchesText}>Gespeicherte Suchen ({savedSearches.length})</Text>
                <ChevronRight size={16} color={Colors.secondaryText} />
              </Pressable>
            </Link>
            
            <View style={styles.header}>
              <Text style={styles.title}>Aktuelle Angebote</Text>
              <Text style={styles.subtitle}>Entdecke die neuesten Fahrzeuge</Text>
            </View>
          </>
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Fahrzeuge werden geladen...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Keine Fahrzeuge gefunden</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <Link href={`/filter?section=${label.toLowerCase()}`} asChild>
      <Pressable style={styles.chip}>
        <Text style={styles.chipText}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    padding: 16,
    minHeight: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: Colors.text,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 6,
  },
  resetButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.card,
    borderRadius: 16,
  },
  resetText: {
    color: Colors.secondaryText,
    fontSize: 14,
  },
  quickFiltersContainer: {
    paddingBottom: 12,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipText: {
    fontSize: 12,
    color: Colors.text,
  },
  savedSearchesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  savedSearchesText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondaryText,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.secondaryText,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.secondaryText,
  },
});