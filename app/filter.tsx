import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { X, Save, Sliders } from 'lucide-react-native';
import { carBrands, fuelTypes, transmissionTypes, sellerTypes } from '@/mocks/cars';
import { useFiltersStore } from '@/store/filters';
import { useSavedSearchesStore } from '@/store/savedSearches';
import { Colors } from '@/constants/colors';
import { ListingSource } from '@/services/dataAggregation';

export default function FilterScreen() {
  const router = useRouter();
  const { section } = useLocalSearchParams<{ section?: string }>();
  const { filters, setFilter, resetFilters } = useFiltersStore();
  const { addSavedSearch } = useSavedSearchesStore();
  
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() || '');
  const [minYear, setMinYear] = useState(filters.minYear?.toString() || '');
  const [maxYear, setMaxYear] = useState(filters.maxYear?.toString() || '');
  const [minPower, setMinPower] = useState(filters.minPower?.toString() || '');
  const [maxPower, setMaxPower] = useState(filters.maxPower?.toString() || '');
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>(filters.brand);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>(
    filters.fuelType as string[] || []
  );
  const [selectedTransmission, setSelectedTransmission] = useState<string[]>(
    filters.transmission as string[] || []
  );
  const [selectedSellerTypes, setSelectedSellerTypes] = useState<string[]>(
    filters.sellerType as string[] || []
  );
  const [selectedSources, setSelectedSources] = useState<string[]>(
    filters.source as string[] || []
  );
  const [keyword, setKeyword] = useState(filters.keyword || '');
  const [saveSearchName, setSaveSearchName] = useState('');
  const [showSaveSearch, setShowSaveSearch] = useState(false);

  const applyFilters = () => {
    if (minPrice) setFilter('minPrice', parseInt(minPrice));
    if (maxPrice) setFilter('maxPrice', parseInt(maxPrice));
    if (minYear) setFilter('minYear', parseInt(minYear));
    if (maxYear) setFilter('maxYear', parseInt(maxYear));
    if (minPower) setFilter('minPower', parseInt(minPower));
    if (maxPower) setFilter('maxPower', parseInt(maxPower));
    if (selectedBrand) setFilter('brand', selectedBrand);
    if (selectedFuelTypes.length > 0) setFilter('fuelType', selectedFuelTypes);
    if (selectedTransmission.length > 0) setFilter('transmission', selectedTransmission);
    if (selectedSellerTypes.length > 0) setFilter('sellerType', selectedSellerTypes);
    if (selectedSources.length > 0) setFilter('source', selectedSources);
    if (keyword) setFilter('keyword', keyword);
    
    router.back();
  };

  const toggleFuelType = (type: string) => {
    if (selectedFuelTypes.includes(type)) {
      setSelectedFuelTypes(selectedFuelTypes.filter(t => t !== type));
    } else {
      setSelectedFuelTypes([...selectedFuelTypes, type]);
    }
  };

  const toggleTransmission = (type: string) => {
    if (selectedTransmission.includes(type)) {
      setSelectedTransmission(selectedTransmission.filter(t => t !== type));
    } else {
      setSelectedTransmission([...selectedTransmission, type]);
    }
  };

  const toggleSellerType = (type: string) => {
    if (selectedSellerTypes.includes(type)) {
      setSelectedSellerTypes(selectedSellerTypes.filter(t => t !== type));
    } else {
      setSelectedSellerTypes([...selectedSellerTypes, type]);
    }
  };
  
  const toggleSource = (source: string) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter(s => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };
  
  const saveSearch = () => {
    if (!saveSearchName.trim()) return;
    
    const currentFilters = {
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      minYear: minYear ? parseInt(minYear) : undefined,
      maxYear: maxYear ? parseInt(maxYear) : undefined,
      minPower: minPower ? parseInt(minPower) : undefined,
      maxPower: maxPower ? parseInt(maxPower) : undefined,
      brand: selectedBrand,
      fuelType: selectedFuelTypes.length > 0 ? selectedFuelTypes : undefined,
      transmission: selectedTransmission.length > 0 ? selectedTransmission : undefined,
      sellerType: selectedSellerTypes.length > 0 ? selectedSellerTypes : undefined,
      source: selectedSources.length > 0 ? selectedSources : undefined,
      keyword: keyword || undefined,
    };
    
    addSavedSearch(saveSearchName, currentFilters);
    setSaveSearchName('');
    setShowSaveSearch(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suchbegriff</Text>
          <TextInput
            style={styles.fullWidthInput}
            placeholder="Marke, Modell oder Stichwort"
            value={keyword}
            onChangeText={setKeyword}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preis (€)</Text>
          <View style={styles.rangeInputs}>
            <TextInput
              style={styles.input}
              placeholder="Min"
              keyboardType="numeric"
              value={minPrice}
              onChangeText={setMinPrice}
            />
            <Text style={styles.rangeSeparator}>-</Text>
            <TextInput
              style={styles.input}
              placeholder="Max"
              keyboardType="numeric"
              value={maxPrice}
              onChangeText={setMaxPrice}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Marke</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsContainer}
          >
            {carBrands.map((brand) => (
              <Pressable
                key={brand}
                style={[
                  styles.chip,
                  selectedBrand === brand && styles.chipSelected
                ]}
                onPress={() => setSelectedBrand(selectedBrand === brand ? undefined : brand)}
              >
                <Text 
                  style={[
                    styles.chipText,
                    selectedBrand === brand && styles.chipTextSelected
                  ]}
                >
                  {brand}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Baujahr</Text>
          <View style={styles.rangeInputs}>
            <TextInput
              style={styles.input}
              placeholder="Min"
              keyboardType="numeric"
              value={minYear}
              onChangeText={setMinYear}
            />
            <Text style={styles.rangeSeparator}>-</Text>
            <TextInput
              style={styles.input}
              placeholder="Max"
              keyboardType="numeric"
              value={maxYear}
              onChangeText={setMaxYear}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leistung (PS)</Text>
          <View style={styles.rangeInputs}>
            <TextInput
              style={styles.input}
              placeholder="Min"
              keyboardType="numeric"
              value={minPower}
              onChangeText={setMinPower}
            />
            <Text style={styles.rangeSeparator}>-</Text>
            <TextInput
              style={styles.input}
              placeholder="Max"
              keyboardType="numeric"
              value={maxPower}
              onChangeText={setMaxPower}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kraftstoffart</Text>
          <View style={styles.optionsContainer}>
            {fuelTypes.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.chip,
                  selectedFuelTypes.includes(type) && styles.chipSelected
                ]}
                onPress={() => toggleFuelType(type)}
              >
                <Text 
                  style={[
                    styles.chipText,
                    selectedFuelTypes.includes(type) && styles.chipTextSelected
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Getriebe</Text>
          <View style={styles.optionsContainer}>
            {transmissionTypes.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.chip,
                  selectedTransmission.includes(type) && styles.chipSelected
                ]}
                onPress={() => toggleTransmission(type)}
              >
                <Text 
                  style={[
                    styles.chipText,
                    selectedTransmission.includes(type) && styles.chipTextSelected
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Anbieter</Text>
          <View style={styles.optionsContainer}>
            {sellerTypes.map((type) => (
              <Pressable
                key={type}
                style={[
                  styles.chip,
                  selectedSellerTypes.includes(type) && styles.chipSelected
                ]}
                onPress={() => toggleSellerType(type)}
              >
                <Text 
                  style={[
                    styles.chipText,
                    selectedSellerTypes.includes(type) && styles.chipTextSelected
                  ]}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quelle</Text>
          <View style={styles.optionsContainer}>
            {Object.values(ListingSource).map((source) => (
              <Pressable
                key={source}
                style={[
                  styles.chip,
                  selectedSources.includes(source) && styles.chipSelected
                ]}
                onPress={() => toggleSource(source)}
              >
                <Text 
                  style={[
                    styles.chipText,
                    selectedSources.includes(source) && styles.chipTextSelected
                  ]}
                >
                  {source === ListingSource.INTERNAL ? 'Intern' : source}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        
        {showSaveSearch && (
          <View style={styles.saveSearchSection}>
            <Text style={styles.sectionTitle}>Suche speichern</Text>
            <TextInput
              style={styles.fullWidthInput}
              placeholder="Name der gespeicherten Suche"
              value={saveSearchName}
              onChangeText={setSaveSearchName}
            />
            <Pressable style={styles.saveSearchButton} onPress={saveSearch}>
              <Text style={styles.saveSearchButtonText}>Speichern</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.footer}>
        <Pressable 
          style={styles.resetButton} 
          onPress={() => {
            resetFilters();
            router.back();
          }}
        >
          <X size={20} color={Colors.secondaryText} />
          <Text style={styles.resetButtonText}>Zurücksetzen</Text>
        </Pressable>
        
        <Pressable 
          style={styles.saveButton} 
          onPress={() => setShowSaveSearch(!showSaveSearch)}
        >
          <Save size={20} color={Colors.secondaryText} />
        </Pressable>
        
        <Pressable style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Filter anwenden</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 20, // Reduced spacing between sections
  },
  sectionTitle: {
    fontSize: 16, // Reduced font size
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12, // Reduced spacing
  },
  rangeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44, // Reduced height
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14, // Reduced font size
  },
  fullWidthInput: {
    height: 44, // Reduced height
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14, // Reduced font size
  },
  rangeSeparator: {
    marginHorizontal: 12,
    fontSize: 14, // Reduced font size
    color: Colors.secondaryText,
  },
  chipsContainer: {
    paddingRight: 16,
    gap: 6, // Reduced gap
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6, // Reduced gap
  },
  chip: {
    paddingHorizontal: 12, // Reduced padding
    paddingVertical: 8, // Reduced padding
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 6, // Added margin bottom for wrapped items
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13, // Reduced font size
    color: Colors.text,
  },
  chipTextSelected: {
    color: Colors.background,
  },
  saveSearchSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
  },
  saveSearchButton: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveSearchButtonText: {
    color: Colors.background,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.card,
    marginRight: 12,
  },
  resetButtonText: {
    marginLeft: 8,
    fontSize: 14, // Reduced font size
    color: Colors.secondaryText,
  },
  saveButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  applyButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
});