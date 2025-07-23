import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, FlatList, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Star, ShoppingCart, ArrowLeft, Package, Truck, Shield, Plus, Minus } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useCartStore } from '@/store/cart';

interface CarPart {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  brand: string;
  condition: 'Neu' | 'Gebraucht' | 'Generalüberholt';
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  compatibility: string[];
  seller: {
    name: string;
    rating: number;
    location: string;
  };
  shipping: {
    cost: number;
    time: string;
  };
  warranty: string;
}

const generatePartsForCar = (brand: string, model: string, year: number): CarPart[] => {
  const categories = [
    'Motor & Getriebe',
    'Bremsen & Fahrwerk',
    'Karosserie & Exterieur',
    'Innenausstattung',
    'Elektrik & Beleuchtung',
    'Auspuff & Abgasanlage',
    'Reifen & Felgen',
    'Wartung & Service'
  ];

  const parts: CarPart[] = [];
  
  // Motor & Getriebe
  parts.push({
    id: '1',
    name: 'Motoröl 5W-30',
    category: 'Motor & Getriebe',
    price: 45.99,
    originalPrice: 59.99,
    brand: 'Castrol',
    condition: 'Neu',
    rating: 4.8,
    reviewCount: 234,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    description: 'Hochwertiges Vollsynthetik-Motoröl für optimalen Motorschutz',
    compatibility: [`${brand} ${model} ${year}`],
    seller: { name: 'AutoTeile24', rating: 4.9, location: 'Hamburg' },
    shipping: { cost: 4.99, time: '1-2 Werktage' },
    warranty: '2 Jahre Garantie'
  });

  parts.push({
    id: '2',
    name: 'Bremsbeläge Vorderachse',
    category: 'Bremsen & Fahrwerk',
    price: 89.99,
    brand: 'Bosch',
    condition: 'Neu',
    rating: 4.7,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    description: 'Original Bosch Bremsbeläge für sicheres Bremsen',
    compatibility: [`${brand} ${model} ${year}`],
    seller: { name: 'Bosch Service', rating: 4.8, location: 'Stuttgart' },
    shipping: { cost: 0, time: '2-3 Werktage' },
    warranty: '3 Jahre Garantie'
  });

  parts.push({
    id: '3',
    name: 'LED Scheinwerfer Set',
    category: 'Elektrik & Beleuchtung',
    price: 299.99,
    originalPrice: 399.99,
    brand: 'Philips',
    condition: 'Neu',
    rating: 4.9,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    description: 'Hochwertige LED Scheinwerfer für bessere Sicht',
    compatibility: [`${brand} ${model} ${year}`],
    seller: { name: 'LichtProfi', rating: 4.6, location: 'München' },
    shipping: { cost: 9.99, time: '3-5 Werktage' },
    warranty: '5 Jahre Garantie'
  });

  parts.push({
    id: '4',
    name: 'Luftfilter',
    category: 'Wartung & Service',
    price: 24.99,
    brand: 'Mann Filter',
    condition: 'Neu',
    rating: 4.5,
    reviewCount: 312,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    description: 'Hochwertiger Luftfilter für optimale Motorleistung',
    compatibility: [`${brand} ${model} ${year}`],
    seller: { name: 'FilterExperte', rating: 4.7, location: 'Berlin' },
    shipping: { cost: 3.99, time: '1-2 Werktage' },
    warranty: '1 Jahr Garantie'
  });

  parts.push({
    id: '5',
    name: 'Stoßdämpfer Hinten',
    category: 'Bremsen & Fahrwerk',
    price: 159.99,
    brand: 'Sachs',
    condition: 'Neu',
    rating: 4.6,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    description: 'Original Sachs Stoßdämpfer für optimalen Fahrkomfort',
    compatibility: [`${brand} ${model} ${year}`],
    seller: { name: 'Fahrwerk24', rating: 4.8, location: 'Köln' },
    shipping: { cost: 7.99, time: '2-4 Werktage' },
    warranty: '2 Jahre Garantie'
  });

  parts.push({
    id: '6',
    name: 'Winterreifen Set 205/55 R16',
    category: 'Reifen & Felgen',
    price: 399.99,
    originalPrice: 499.99,
    brand: 'Continental',
    condition: 'Neu',
    rating: 4.8,
    reviewCount: 145,
    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80',
    description: 'Premium Winterreifen für sicheres Fahren bei Schnee und Eis',
    compatibility: [`${brand} ${model} ${year}`],
    seller: { name: 'ReifenDirekt', rating: 4.9, location: 'Hannover' },
    shipping: { cost: 0, time: '3-5 Werktage' },
    warranty: '4 Jahre Garantie'
  });

  return parts;
};

export default function PartsMarketScreen() {
  const { brand, model, year } = useLocalSearchParams<{ brand: string; model: string; year: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [parts, setParts] = useState<CarPart[]>([]);
  const [filteredParts, setFilteredParts] = useState<CarPart[]>([]);
  const { addToCart, items: cartItems, getItemCount } = useCartStore();

  const categories = [
    'Alle',
    'Motor & Getriebe',
    'Bremsen & Fahrwerk',
    'Karosserie & Exterieur',
    'Innenausstattung',
    'Elektrik & Beleuchtung',
    'Auspuff & Abgasanlage',
    'Reifen & Felgen',
    'Wartung & Service'
  ];

  useEffect(() => {
    if (brand && model && year) {
      const generatedParts = generatePartsForCar(brand, model, parseInt(year));
      setParts(generatedParts);
      setFilteredParts(generatedParts);
    }
  }, [brand, model, year]);

  const handleAddToCart = (part: CarPart) => {
    const cartItem = {
      id: part.id,
      name: part.name,
      price: part.price,
      originalPrice: part.originalPrice,
      brand: part.brand,
      condition: part.condition,
      image: part.image,
      seller: part.seller,
      shipping: part.shipping,
      warranty: part.warranty,
      carCompatibility: `${brand} ${model} ${year}`
    };
    
    addToCart(cartItem);
    Alert.alert(
      'Zum Warenkorb hinzugefügt',
      `${part.name} wurde erfolgreich zum Warenkorb hinzugefügt.`,
      [{ text: 'OK' }]
    );
  };

  const getCartQuantity = (partId: string) => {
    const cartItem = cartItems.find(item => item.id === partId);
    return cartItem ? cartItem.quantity : 0;
  };

  useEffect(() => {
    let filtered = parts;

    if (selectedCategory !== 'Alle') {
      filtered = filtered.filter(part => part.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(part => 
        part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        part.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredParts(filtered);
  }, [parts, selectedCategory, searchQuery]);

  const renderPartItem = ({ item }: { item: CarPart }) => {
    const cartQuantity = getCartQuantity(item.id);
    
    return (
      <Pressable style={styles.partCard}>
        <Image source={{ uri: item.image }} style={styles.partImage} contentFit="cover" />
        
        <View style={styles.partInfo}>
          <Text style={styles.partName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.partBrand}>{item.brand}</Text>
          
          <View style={styles.ratingContainer}>
            <Star size={14} color={Colors.favorite} fill={Colors.favorite} />
            <Text style={styles.rating}>{item.rating}</Text>
            <Text style={styles.reviewCount}>({item.reviewCount})</Text>
          </View>
          
          <View style={styles.conditionContainer}>
            <View style={[styles.conditionBadge, 
              item.condition === 'Neu' ? styles.newBadge : 
              item.condition === 'Gebraucht' ? styles.usedBadge : styles.refurbishedBadge
            ]}>
              <Text style={[styles.conditionText,
                item.condition === 'Neu' ? styles.newText : 
                item.condition === 'Gebraucht' ? styles.usedText : styles.refurbishedText
              ]}>{item.condition}</Text>
            </View>
          </View>
          
          <View style={styles.priceContainer}>
            {item.originalPrice && (
              <Text style={styles.originalPrice}>{item.originalPrice.toFixed(2)} €</Text>
            )}
            <Text style={styles.price}>{item.price.toFixed(2)} €</Text>
          </View>
          
          <View style={styles.shippingInfo}>
            <Truck size={12} color={Colors.secondaryText} />
            <Text style={styles.shippingText}>
              {item.shipping.cost === 0 ? 'Kostenloser Versand' : `${item.shipping.cost.toFixed(2)} € Versand`}
            </Text>
          </View>
          
          <View style={styles.warrantyInfo}>
            <Shield size={12} color={Colors.primary} />
            <Text style={styles.warrantyText}>{item.warranty}</Text>
          </View>
          
          {cartQuantity > 0 ? (
            <View style={styles.quantityContainer}>
              <Text style={styles.inCartText}>Im Warenkorb: {cartQuantity}</Text>
            </View>
          ) : null}
          
          <Pressable 
            style={styles.addToCartButton}
            onPress={() => handleAddToCart(item)}
          >
            <ShoppingCart size={16} color={Colors.background} />
            <Text style={styles.addToCartText}>In den Warenkorb</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: 'Ersatzteilmarkt',
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.text} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable 
              onPress={() => router.push('/cart')} 
              style={styles.cartButton}
            >
              <ShoppingCart size={24} color={Colors.text} />
              {getItemCount() > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{getItemCount()}</Text>
                </View>
              )}
            </Pressable>
          ),
        }} 
      />
      
      <View style={styles.header}>
        <Text style={styles.carInfo}>
          Ersatzteile für {brand} {model} ({year})
        </Text>
        
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ersatzteile suchen..."
            placeholderTextColor={Colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((category) => (
          <Pressable
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.selectedCategoryButton
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === category && styles.selectedCategoryText
            ]}>
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      
      <View style={styles.resultsHeader}>
        <Package size={16} color={Colors.text} />
        <Text style={styles.resultsCount}>
          {filteredParts.length} Ersatzteile gefunden
        </Text>
      </View>
      
      <FlatList
        data={filteredParts}
        renderItem={renderPartItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: 8,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  carInfo: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  categoryScroll: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    backgroundColor: Colors.card,
    borderRadius: 20,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: Colors.background,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  resultsCount: {
    fontSize: 16,
    color: Colors.text,
    marginLeft: 8,
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  partCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 16,
    width: '48%',
    overflow: 'hidden',
  },
  partImage: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.placeholder,
  },
  partInfo: {
    padding: 12,
  },
  partName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  partBrand: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    color: Colors.text,
    marginLeft: 4,
    fontWeight: '500',
  },
  reviewCount: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginLeft: 4,
  },
  conditionContainer: {
    marginBottom: 8,
  },
  conditionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  newBadge: {
    backgroundColor: '#E8F5E8',
  },
  usedBadge: {
    backgroundColor: '#FFF3E0',
  },
  refurbishedBadge: {
    backgroundColor: '#E3F2FD',
  },
  conditionText: {
    fontSize: 10,
    fontWeight: '600',
  },
  newText: {
    color: '#2E7D32',
  },
  usedText: {
    color: '#F57C00',
  },
  refurbishedText: {
    color: '#1976D2',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.secondaryText,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.price,
  },
  shippingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  shippingText: {
    fontSize: 10,
    color: Colors.secondaryText,
    marginLeft: 4,
  },
  warrantyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  warrantyText: {
    fontSize: 10,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  addToCartText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.background,
    marginLeft: 6,
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.notification,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '600',
  },
  quantityContainer: {
    marginBottom: 8,
  },
  inCartText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
  },
});