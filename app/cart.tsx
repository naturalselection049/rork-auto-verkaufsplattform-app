import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, FlatList, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useCartStore, CartItem } from '@/store/cart';

export default function CartScreen() {
  const { 
    items, 
    isLoading, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalPrice, 
    getTotalShipping, 
    getItemCount,
    loadCart 
  } = useCartStore();

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Artikel entfernen',
        'Möchtest du diesen Artikel aus dem Warenkorb entfernen?',
        [
          { text: 'Abbrechen', style: 'cancel' },
          { text: 'Entfernen', onPress: () => removeFromCart(itemId) }
        ]
      );
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Warenkorb leeren',
      'Möchtest du alle Artikel aus dem Warenkorb entfernen?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        { text: 'Leeren', onPress: clearCart }
      ]
    );
  };

  const handleCheckout = () => {
    Alert.alert(
      'Bestellung aufgeben',
      `Gesamtsumme: ${(getTotalPrice() + getTotalShipping()).toFixed(2)} €\n\nMöchtest du die Bestellung abschließen?`,
      [
        { text: 'Abbrechen', style: 'cancel' },
        { 
          text: 'Bestellen', 
          onPress: () => {
            clearCart();
            Alert.alert('Bestellung erfolgreich', 'Deine Bestellung wurde erfolgreich aufgegeben!');
            router.back();
          }
        }
      ]
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} contentFit="cover" />
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemBrand}>{item.brand}</Text>
        <Text style={styles.itemCompatibility}>{item.carCompatibility}</Text>
        
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
          <Text style={styles.itemPrice}>{item.price.toFixed(2)} €</Text>
        </View>
        
        <Text style={styles.sellerInfo}>Verkäufer: {item.seller.name}</Text>
        <Text style={styles.shippingInfo}>
          Versand: {item.shipping.cost === 0 ? 'Kostenlos' : `${item.shipping.cost.toFixed(2)} €`} • {item.shipping.time}
        </Text>
      </View>
      
      <View style={styles.quantityControls}>
        <Pressable 
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
        >
          <Minus size={16} color={Colors.text} />
        </Pressable>
        
        <Text style={styles.quantity}>{item.quantity}</Text>
        
        <Pressable 
          style={styles.quantityButton}
          onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
        >
          <Plus size={16} color={Colors.text} />
        </Pressable>
        
        <Pressable 
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Trash2 size={16} color={Colors.notification} />
        </Pressable>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <Stack.Screen 
          options={{
            title: 'Warenkorb',
            headerLeft: () => (
              <Pressable onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color={Colors.text} />
              </Pressable>
            ),
          }} 
        />
        
        <View style={styles.emptyContainer}>
          <ShoppingBag size={64} color={Colors.secondaryText} />
          <Text style={styles.emptyTitle}>Dein Warenkorb ist leer</Text>
          <Text style={styles.emptySubtitle}>
            Füge Ersatzteile hinzu, um sie hier zu sehen
          </Text>
          
          <Pressable 
            style={styles.continueShoppingButton}
            onPress={() => router.back()}
          >
            <Text style={styles.continueShoppingText}>Weiter einkaufen</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{
          title: `Warenkorb (${getItemCount()})`,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.text} />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={handleClearCart} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Leeren</Text>
            </Pressable>
          ),
        }} 
      />
      
      <FlatList
        data={items}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Zwischensumme:</Text>
          <Text style={styles.summaryValue}>{getTotalPrice().toFixed(2)} €</Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Versandkosten:</Text>
          <Text style={styles.summaryValue}>
            {getTotalShipping() === 0 ? 'Kostenlos' : `${getTotalShipping().toFixed(2)} €`}
          </Text>
        </View>
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Gesamtsumme:</Text>
          <Text style={styles.totalValue}>{(getTotalPrice() + getTotalShipping()).toFixed(2)} €</Text>
        </View>
        
        <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
          <CreditCard size={20} color={Colors.background} />
          <Text style={styles.checkoutButtonText}>Jetzt bestellen</Text>
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
  backButton: {
    padding: 8,
  },
  clearButton: {
    padding: 8,
  },
  clearButtonText: {
    color: Colors.notification,
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: Colors.placeholder,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 4,
  },
  itemCompatibility: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 8,
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
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.secondaryText,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.price,
  },
  sellerInfo: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 2,
  },
  shippingInfo: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  quantityControls: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.notification,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryContainer: {
    backgroundColor: Colors.card,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  summaryValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.price,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: 32,
  },
  continueShoppingButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  continueShoppingText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.background,
  },
});