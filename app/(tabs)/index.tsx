import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, FlatList, Text, ActivityIndicator, TextInput, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { CarListItem } from '@/components/CarListItem';
import { useTheme } from '@/contexts/ThemeContext';
import { CarListing } from '@/types/car';
import { fetchListingsFromAllSources } from '@/services/dataAggregation';
import { Search, Filter, Bookmark, ChevronRight } from 'lucide-react-native';
import { useFiltersStore } from '@/store/filters';
import { useSavedSearchesStore } from '@/store/savedSearches';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const [isLoading, setIsLoading] = useState(true);
  const [carListings, setCarListings] = useState<CarListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<TextInput>(null);
  const { filters, resetFilters } = useFiltersStore();
  const { savedSearches } = useSavedSearchesStore();
  
  // Count active filters
  const activeFiltersCount = Object.keys(filters).filter(key => 
    filters[key as keyof typeof filters] !== undefined && 
    (Array.isArray(filters[key as keyof typeof filters]) ? 
      (filters[key as keyof typeof filters] as any[]).length > 0 : 
      true)
  ).length;
  
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <FlatList
        data={filteredCars}
        renderItem={({ item }) => <CarListItem car={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        numColumns={1}
        ListHeaderComponent={
          <>
            <View style={styles.searchContainer}>
              <Pressable style={styles.searchBar} onPress={focusSearch}>
                <Search size={18} color={colors.secondaryText} style={styles.searchIcon} />
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
                  <Filter size={18} color={colors.primary} />
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
                <Bookmark size={18} color={colors.primary} />
                <Text style={styles.savedSearchesText}>Gespeicherte Suchen ({savedSearches.length})</Text>
                <ChevronRight size={14} color={colors.secondaryText} />
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
              <ActivityIndicator size="large" color={colors.primary} />
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
  const { colors } = useTheme();
  const styles = createStyles(colors);
  
  return (
    <Link href={`/filter?section=${label.toLowerCase()}`} asChild>
      <Pressable style={styles.chip}>
        <Text style={styles.chipText}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    minHeight: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: colors.text,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 4,
  },
  resetButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: colors.card,
    borderRadius: 14,
  },
  resetText: {
    color: colors.secondaryText,
    fontSize: 12,
  },
  quickFiltersContainer: {
    paddingBottom: 10,
    gap: 6,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    fontSize: 11,
    color: colors.text,
  },
  savedSearchesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  savedSearchesText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: colors.secondaryText,
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
    color: colors.secondaryText,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: colors.secondaryText,
  },
});