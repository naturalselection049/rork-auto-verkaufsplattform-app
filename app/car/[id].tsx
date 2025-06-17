import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Share2, MapPin, Calendar, Gauge, Fuel, Zap, MessageCircle, Calculator } from 'lucide-react-native';
import { carListings } from '@/mocks/cars';
import { useFavoritesStore } from '@/store/favorites';
import { Colors } from '@/constants/colors';
import { SourceBadge } from '@/components/SourceBadge';
import { CarListing } from '@/types/car';
import { ListingSource } from '@/services/dataAggregation';

// Mock function to simulate API calls
const fetchMobileDeListings = async (): Promise<CarListing[]> => {
  return [
    {
      id: 'mobile-1',
      title: 'Porsche 911 Carrera S',
      brand: 'Porsche',
      model: '911',
      year: 2021,
      price: 129900,
      mileage: 15000,
      fuelType: 'Benzin',
      transmission: 'Automatik',
      power: 450,
      description: 'Porsche 911 Carrera S in ausgezeichnetem Zustand. Sportabgasanlage, Sportchrono-Paket, LED-Matrix-Scheinwerfer.',
      location: 'Stuttgart',
      sellerType: 'Händler',
      sellerName: 'Premium Sports Cars GmbH',
      sellerPhone: '+49123456789',
      images: [
        'https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      features: ['Sport Chrono Paket', 'Sportabgasanlage', 'LED-Matrix', 'Sportsitze Plus', 'BOSE Soundsystem'],
      createdAt: '2023-06-10T08:30:00Z',
      updatedAt: '2023-06-10T08:30:00Z',
      source: ListingSource.MOBILE_DE
    }
  ];
};

// Mock function to simulate API calls
const fetchKleinanzeigenListings = async (): Promise<CarListing[]> => {
  return [
    {
      id: 'kleinanzeigen-1',
      title: 'VW Golf 7 GTI Performance',
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2019,
      price: 28500,
      mileage: 45000,
      fuelType: 'Benzin',
      transmission: 'Manuell',
      power: 245,
      description: 'VW Golf 7 GTI Performance mit 6-Gang-Schaltgetriebe. Scheckheftgepflegt, unfallfrei, Nichtraucherfahrzeug.',
      location: 'Hamburg',
      sellerType: 'Privat',
      sellerName: 'Michael Schmidt',
      sellerPhone: '+49123987456',
      images: [
        'https://images.unsplash.com/photo-1624551349356-9c1f1aaeb344?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1624551349356-9c1f1aaeb344?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      features: ['Navigationssystem', 'Sitzheizung', 'Einparkhilfe', 'Klimaautomatik', 'Bluetooth'],
      createdAt: '2023-06-20T14:45:00Z',
      updatedAt: '2023-06-20T14:45:00Z',
      source: ListingSource.KLEINANZEIGEN
    }
  ];
};

const { width } = Dimensions.get('window');

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [externalCar, setExternalCar] = useState<CarListing | null>(null);
  
  // In a real app, we would fetch this car from an API
  // For now, we'll use our mock data
  const car = carListings.find(car => car.id === id);
  
  useEffect(() => {
    // Fetch external listings
    const fetchExternalCar = async () => {
      try {
        // If not found in internal listings, check external sources
        if (!car) {
          const mobileDeListings = await fetchMobileDeListings();
          const kleinanzeigenListings = await fetchKleinanzeigenListings();
          
          const foundCar = mobileDeListings.find(car => car.id === id) || 
                          kleinanzeigenListings.find(car => car.id === id);
          
          if (foundCar) {
            setExternalCar(foundCar);
          }
        }
      } catch (error) {
        console.error('Error fetching external car:', error);
      }
    };
    
    fetchExternalCar();
  }, [id, car]);
  
  const foundCar = car || externalCar;
  
  if (!foundCar) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Fahrzeug nicht gefunden</Text>
      </SafeAreaView>
    );
  }
  
  const isFav = isFavorite(foundCar.id);
  
  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(foundCar.id);
    } else {
      addFavorite(foundCar.id);
    }
  };
  
  const handleScroll = (event: any) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentImageIndex(index);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <SourceBadge source={foundCar.source} />
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            style={styles.imageSlider}
          >
            {foundCar.images.map((image: string, index: number) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.image}
                contentFit="cover"
              />
            ))}
          </ScrollView>
          
          {foundCar.images.length > 1 && (
            <View style={styles.pagination}>
              {foundCar.images.map((_: string, index: number) => (
                <View 
                  key={index} 
                  style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.paginationDotActive
                  ]} 
                />
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{foundCar.title}</Text>
            <Text style={styles.price}>{foundCar.price.toLocaleString()} €</Text>
          </View>
          
          <View style={styles.location}>
            <MapPin size={16} color={Colors.secondaryText} />
            <Text style={styles.locationText}>{foundCar.location}</Text>
          </View>
          
          <View style={styles.specs}>
            <View style={styles.specItem}>
              <Calendar size={18} color={Colors.primary} />
              <Text style={styles.specValue}>{foundCar.year}</Text>
              <Text style={styles.specLabel}>Baujahr</Text>
            </View>
            
            <View style={styles.specItem}>
              <Gauge size={18} color={Colors.primary} />
              <Text style={styles.specValue}>{foundCar.mileage.toLocaleString()} km</Text>
              <Text style={styles.specLabel}>Kilometer</Text>
            </View>
            
            <View style={styles.specItem}>
              <Fuel size={18} color={Colors.primary} />
              <Text style={styles.specValue}>{foundCar.fuelType}</Text>
              <Text style={styles.specLabel}>Kraftstoff</Text>
            </View>
            
            <View style={styles.specItem}>
              <Zap size={18} color={Colors.primary} />
              <Text style={styles.specValue}>{foundCar.power} PS</Text>
              <Text style={styles.specLabel}>Leistung</Text>
            </View>
          </View>
          
          <Link href={`/cost-calculator?price=${foundCar.price}&fuel=${foundCar.fuelType}&year=${foundCar.year}`} asChild>
            <Pressable style={styles.calculatorButton}>
              <Calculator size={20} color={Colors.primary} />
              <Text style={styles.calculatorButtonText}>Kostenrechner öffnen</Text>
            </Pressable>
          </Link>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Beschreibung</Text>
            <Text style={styles.description}>{foundCar.description}</Text>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ausstattung</Text>
            <View style={styles.features}>
              {foundCar.features.map((feature: string, index: number) => (
                <View key={index} style={styles.featureItem}>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Verkäufer</Text>
            <View style={styles.seller}>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{foundCar.sellerName}</Text>
                <Text style={styles.sellerType}>{foundCar.sellerType}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Pressable style={styles.favoriteButton} onPress={toggleFavorite}>
          <Heart 
            size={24} 
            color={isFav ? Colors.favorite : Colors.text} 
            fill={isFav ? Colors.favorite : 'transparent'} 
          />
        </Pressable>
        
        <Pressable style={styles.shareButton}>
          <Share2 size={24} color={Colors.text} />
        </Pressable>
        
        <Link href={`/messages/new?carId=${foundCar.id}&receiverId=${foundCar.sellerName}`} asChild>
          <Pressable style={styles.contactButton}>
            <MessageCircle size={20} color={Colors.background} style={styles.contactButtonIcon} />
            <Text style={styles.contactButtonText}>Kontakt aufnehmen</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 24,
    color: Colors.text,
  },
  imageContainer: {
    position: 'relative',
    height: 250,
  },
  imageSlider: {
    height: 250,
  },
  image: {
    width,
    height: 250,
    backgroundColor: Colors.placeholder,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.price,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  locationText: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginLeft: 4,
  },
  specs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  specItem: {
    alignItems: 'center',
    width: '23%', // Adjusted to give more space between items
  },
  specValue: {
    fontSize: 14, // Reduced font size
    fontWeight: '600',
    color: Colors.text,
    marginTop: 6,
    marginBottom: 2,
    textAlign: 'center', // Center text for better appearance
  },
  specLabel: {
    fontSize: 11, // Reduced font size
    color: Colors.secondaryText,
    textAlign: 'center', // Center text for better appearance
  },
  calculatorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  calculatorButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureItem: {
    backgroundColor: Colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text,
  },
  seller: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
  },
  sellerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  sellerType: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactButton: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactButtonIcon: {
    marginRight: 8,
  },
  contactButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});