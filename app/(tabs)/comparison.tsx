import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { X, ChevronRight, AlertTriangle } from 'lucide-react-native';
import { useFavoritesStore } from '@/store/favorites';
import { carListings } from '@/mocks/cars';
import { Colors } from '@/constants/colors';
import { EmptyState } from '@/components/EmptyState';
import { CarListing } from '@/types/car';

export default function ComparisonScreen() {
  const router = useRouter();
  const { favorites } = useFavoritesStore();
  const [selectedCars, setSelectedCars] = useState<CarListing[]>([]);
  const [comparisonCars, setComparisonCars] = useState<CarListing[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    // Get all favorite cars
    const favoriteCars = carListings.filter(car => favorites.includes(car.id));
    setSelectedCars(favoriteCars);
  }, [favorites]);

  const startComparison = () => {
    if (comparisonCars.length < 2) {
      alert('Bitte wähle mindestens 2 Fahrzeuge zum Vergleichen aus.');
      return;
    }
    setIsSelecting(false);
  };

  const toggleCarSelection = (car: CarListing) => {
    if (comparisonCars.some(c => c.id === car.id)) {
      setComparisonCars(comparisonCars.filter(c => c.id !== car.id));
    } else {
      if (comparisonCars.length < 3) {
        setComparisonCars([...comparisonCars, car]);
      } else {
        alert('Du kannst maximal 3 Fahrzeuge gleichzeitig vergleichen.');
      }
    }
  };

  const removeFromComparison = (carId: string) => {
    setComparisonCars(comparisonCars.filter(car => car.id !== carId));
  };

  const renderCarItem = ({ item }: { item: CarListing }) => (
    <Pressable 
      style={[
        styles.carItem,
        comparisonCars.some(car => car.id === item.id) && styles.carItemSelected
      ]}
      onPress={() => toggleCarSelection(item)}
    >
      <Image 
        source={{ uri: item.images[0] }}
        style={styles.carImage}
        contentFit="cover"
      />
      <View style={styles.carInfo}>
        <Text style={styles.carTitle}>{item.title}</Text>
        <Text style={styles.carPrice}>{item.price.toLocaleString()} €</Text>
        <View style={styles.carSpecs}>
          <Text style={styles.carSpecText}>{item.year}</Text>
          <Text style={styles.carSpecText}>{item.mileage.toLocaleString()} km</Text>
          <Text style={styles.carSpecText}>{item.fuelType}</Text>
        </View>
      </View>
      {comparisonCars.some(car => car.id === item.id) && (
        <View style={styles.selectedIndicator} />
      )}
    </Pressable>
  );

  const renderComparisonTable = () => {
    if (comparisonCars.length === 0) {
      return (
        <EmptyState 
          title="Keine Fahrzeuge zum Vergleichen"
          message="Wähle Fahrzeuge aus deinen Favoriten aus, um sie zu vergleichen."
          icon={<AlertTriangle size={48} color={Colors.secondaryText} />}
        />
      );
    }

    return (
      <ScrollView horizontal style={styles.comparisonTable}>
        <View>
          {/* Header row with car images and remove buttons */}
          <View style={styles.headerRow}>
            <View style={styles.propertyCell}>
              <Text style={styles.propertyLabel}></Text>
            </View>
            {comparisonCars.map(car => (
              <View key={car.id} style={styles.carHeaderCell}>
                <Pressable 
                  style={styles.removeButton}
                  onPress={() => removeFromComparison(car.id)}
                >
                  <X size={16} color={Colors.background} />
                </Pressable>
                <Image 
                  source={{ uri: car.images[0] }}
                  style={styles.comparisonCarImage}
                  contentFit="cover"
                />
                <Text style={styles.comparisonCarTitle} numberOfLines={2}>{car.title}</Text>
              </View>
            ))}
          </View>

          {/* Price row */}
          <View style={styles.dataRow}>
            <View style={styles.propertyCell}>
              <Text style={styles.propertyLabel}>Preis</Text>
            </View>
            {comparisonCars.map(car => (
              <View key={car.id} style={styles.dataCell}>
                <Text style={styles.dataCellText}>{car.price.toLocaleString()} €</Text>
              </View>
            ))}
          </View>

          {/* Year row */}
          <View style={styles.dataRow}>
            <View style={styles.propertyCell}>
              <Text style={styles.propertyLabel}>Baujahr</Text>
            </View>
            {comparisonCars.map(car => (
              <View key={car.id} style={styles.dataCell}>
                <Text style={styles.dataCellText}>{car.year}</Text>
              </View>
            ))}
          </View>

          {/* Mileage row */}
          <View style={styles.dataRow}>
            <View style={styles.propertyCell}>
              <Text style={styles.propertyLabel}>Kilometerstand</Text>
            </View>
            {comparisonCars.map(car => (
              <View key={car.id} style={styles.dataCell}>
                <Text style={styles.dataCellText}>{car.mileage.toLocaleString()} km</Text>
              </View>
            ))}
          </View>

          {/* Fuel type row */}
          <View style={styles.dataRow}>
            <View style={styles.propertyCell}>
              <Text style={styles.propertyLabel}>Kraftstoff</Text>
            </View>
            {comparisonCars.map(car => (
              <View key={car.id} style={styles.dataCell}>
                <Text style={styles.dataCellText}>{car.fuelType}</Text>
              </View>
            ))}
          </View>

          {/* Transmission row */}
          <View style={styles.dataRow}>
            <View style={styles.propertyCell}>
              <Text style={styles.propertyLabel}>Getriebe</Text>
            </View>
            {comparisonCars.map(car => (
              <View key={car.id} style={styles.dataCell}>
                <Text style={styles.dataCellText}>{car.transmission}</Text>
              </View>
            ))}
          </View>

          {/* Power row */}
          <View style={styles.dataRow}>
            <View style={styles.propertyCell}>
              <Text style={styles.propertyLabel}>Leistung</Text>
            </View>
            {comparisonCars.map(car => (
              <View key={car.id} style={styles.dataCell}>
                <Text style={styles.dataCellText}>{car.power} PS</Text>
              </View>
            ))}
          </View>

          {/* Location row */}
          <View style={styles.dataRow}>
            <View style={styles.propertyCell}>
              <Text style={styles.propertyLabel}>Standort</Text>
            </View>
            {comparisonCars.map(car => (
              <View key={car.id} style={styles.dataCell}>
                <Text style={styles.dataCellText}>{car.location}</Text>
              </View>
            ))}
          </View>

          {/* Seller type row */}
          <View style={styles.dataRow}>
            <View style={styles.propertyCell}>
              <Text style={styles.propertyLabel}>Anbieter</Text>
            </View>
            {comparisonCars.map(car => (
              <View key={car.id} style={styles.dataCell}>
                <Text style={styles.dataCellText}>{car.sellerType}</Text>
              </View>
            ))}
          </View>

          {/* Features row */}
          <View style={[styles.dataRow, styles.featuresRow]}>
            <View style={styles.propertyCell}>
              <Text style={styles.propertyLabel}>Ausstattung</Text>
            </View>
            {comparisonCars.map(car => (
              <View key={car.id} style={[styles.dataCell, styles.featuresCell]}>
                {car.features.map((feature, index) => (
                  <Text key={index} style={styles.featureText}>• {feature}</Text>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {isSelecting ? (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Fahrzeuge auswählen</Text>
            <Text style={styles.subtitle}>Wähle bis zu 3 Fahrzeuge zum Vergleichen aus</Text>
          </View>
          
          {selectedCars.length === 0 ? (
            <EmptyState 
              title="Keine Favoriten"
              message="Füge Fahrzeuge zu deinen Favoriten hinzu, um sie zu vergleichen."
              icon={<AlertTriangle size={48} color={Colors.secondaryText} />}
            />
          ) : (
            <FlatList
              data={selectedCars}
              renderItem={renderCarItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.carList}
            />
          )}
          
          <View style={styles.footer}>
            <Pressable 
              style={styles.cancelButton}
              onPress={() => setIsSelecting(false)}
            >
              <Text style={styles.cancelButtonText}>Abbrechen</Text>
            </Pressable>
            
            <Pressable 
              style={[
                styles.compareButton,
                comparisonCars.length < 2 && styles.compareButtonDisabled
              ]}
              onPress={startComparison}
              disabled={comparisonCars.length < 2}
            >
              <Text style={styles.compareButtonText}>
                {comparisonCars.length} Fahrzeuge vergleichen
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>Fahrzeugvergleich</Text>
            <Text style={styles.subtitle}>Vergleiche deine favorisierten Fahrzeuge</Text>
          </View>
          
          {renderComparisonTable()}
          
          <View style={styles.footer}>
            <Pressable 
              style={styles.selectButton}
              onPress={() => setIsSelecting(true)}
            >
              <Text style={styles.selectButtonText}>Fahrzeuge auswählen</Text>
              <ChevronRight size={20} color={Colors.primary} />
            </Pressable>
          </View>
        </>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondaryText,
  },
  carList: {
    padding: 16,
  },
  carItem: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  carItemSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  carImage: {
    width: 100,
    height: 100,
  },
  carInfo: {
    flex: 1,
    padding: 12,
  },
  carTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  carPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.price,
    marginBottom: 8,
  },
  carSpecs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  carSpecText: {
    fontSize: 12,
    color: Colors.secondaryText,
    backgroundColor: Colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  cancelButton: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.secondaryText,
  },
  compareButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareButtonDisabled: {
    backgroundColor: Colors.secondaryText,
  },
  compareButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
  selectButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  comparisonTable: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  featuresRow: {
    minHeight: 120,
  },
  propertyCell: {
    width: 120,
    padding: 12,
    justifyContent: 'center',
    backgroundColor: Colors.card,
  },
  propertyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  carHeaderCell: {
    width: 150,
    padding: 12,
    alignItems: 'center',
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.secondaryText,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  comparisonCarImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  comparisonCarTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
    textAlign: 'center',
  },
  dataCell: {
    width: 150,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataCellText: {
    fontSize: 14,
    color: Colors.text,
    textAlign: 'center',
  },
  featuresCell: {
    alignItems: 'flex-start',
  },
  featureText: {
    fontSize: 12,
    color: Colors.text,
    marginBottom: 4,
  },
});