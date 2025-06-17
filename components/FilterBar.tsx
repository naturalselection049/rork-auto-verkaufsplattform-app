import React from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { Filter } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useFiltersStore } from '@/store/filters';

export function FilterBar() {
  const { filters, resetFilters } = useFiltersStore();
  
  // Count active filters
  const activeFiltersCount = Object.keys(filters).length;

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Link href="/filter" asChild>
          <Pressable style={styles.filterButton}>
            <Filter size={16} color={Colors.primary} />
            <Text style={styles.filterText}>
              Filter {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
            </Text>
          </Pressable>
        </Link>
        
        {activeFiltersCount > 0 && (
          <Pressable style={styles.resetButton} onPress={resetFilters}>
            <Text style={styles.resetText}>Zurücksetzen</Text>
          </Pressable>
        )}
        
        <FilterChip label="Preis" />
        <FilterChip label="Marke" />
        <FilterChip label="Kilometer" />
        <FilterChip label="Baujahr" />
        <FilterChip label="Kraftstoff" />
      </ScrollView>
    </View>
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
    backgroundColor: Colors.background,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    color: Colors.primary,
    fontWeight: '500',
    marginLeft: 4,
  },
  resetButton: {
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  resetText: {
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  chip: {
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipText: {
    color: Colors.text,
    fontSize: 13,
  },
});