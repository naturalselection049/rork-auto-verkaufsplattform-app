import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Heart } from 'lucide-react-native';
import { Link } from 'expo-router';
import { CarListing } from '@/types/car';
import { Colors } from '@/constants/colors';
import { useFavoritesStore } from '@/store/favorites';
import { SourceBadge } from '@/components/SourceBadge';

interface CarListItemProps {
  car: CarListing;
}

export function CarListItem({ car }: CarListItemProps) {
  const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore();
  const isFav = isFavorite(car.id);

  const toggleFavorite = (e: any) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(car.id);
    } else {
      addFavorite(car.id);
    }
  };

  return (
    <Link href={`/car/${car.id}`} asChild>
      <Pressable style={styles.container}>
        <View style={styles.imageContainer}>
          <SourceBadge source={car.source} />
          <Image
            source={{ uri: car.images[0] }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />
          <Pressable 
            style={styles.favoriteButton} 
            onPress={toggleFavorite}
          >
            <Heart 
              size={18} 
              color={isFav ? Colors.favorite : Colors.background} 
              fill={isFav ? Colors.favorite : 'transparent'} 
            />
          </Pressable>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>{car.title}</Text>
          <Text style={styles.price}>{car.price.toLocaleString()} €</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detail}>{car.year}</Text>
            <Text style={styles.detail}>{car.mileage.toLocaleString()} km</Text>
            <Text style={styles.detail}>{car.fuelType}</Text>
          </View>
          <Text style={styles.location}>{car.location}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  imageContainer: {
    position: 'relative',
    height: 120,
    width: '100%',
  },
  image: {
    flex: 1,
    backgroundColor: Colors.placeholder,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 14,
    padding: 5,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  infoContainer: {
    padding: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
    color: Colors.text,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.price,
    marginBottom: 3,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 3,
    gap: 6,
  },
  detail: {
    fontSize: 11,
    color: Colors.secondaryText,
  },
  location: {
    fontSize: 11,
    color: Colors.secondaryText,
  },
});