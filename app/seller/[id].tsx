import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { useLocalSearchParams, Link } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, MapPin, Phone, Mail, Clock, Shield, MessageCircle } from 'lucide-react-native';
import { mockSellerProfiles } from '@/mocks/users';
import { carListings } from '@/mocks/cars';
import { Colors } from '@/constants/colors';
import { CarListItem } from '@/components/CarListItem';

export default function SellerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'info' | 'reviews' | 'listings'>('info');
  
  const seller = mockSellerProfiles.find(seller => seller.id === id);
  const sellerListings = carListings.filter(car => car.sellerId === id);
  
  if (!seller) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Verkäuferprofil nicht gefunden</Text>
      </SafeAreaView>
    );
  }
  
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          color={i <= rating ? Colors.favorite : Colors.border}
          fill={i <= rating ? Colors.favorite : 'transparent'}
        />
      );
    }
    return stars;
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long'
    });
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <View style={styles.tabContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Kontaktinformationen</Text>
              <View style={styles.contactInfo}>
                <View style={styles.contactItem}>
                  <MapPin size={20} color={Colors.primary} />
                  <View style={styles.contactText}>
                    <Text style={styles.contactLabel}>Adresse</Text>
                    <Text style={styles.contactValue}>
                      {seller.address.street}{"\n"}
                      {seller.address.postalCode} {seller.address.city}
                    </Text>
                  </View>
                </View>
                
                {seller.phone && (
                  <View style={styles.contactItem}>
                    <Phone size={20} color={Colors.primary} />
                    <View style={styles.contactText}>
                      <Text style={styles.contactLabel}>Telefon</Text>
                      <Text style={styles.contactValue}>{seller.phone}</Text>
                    </View>
                  </View>
                )}
                
                {seller.email && (
                  <View style={styles.contactItem}>
                    <Mail size={20} color={Colors.primary} />
                    <View style={styles.contactText}>
                      <Text style={styles.contactLabel}>E-Mail</Text>
                      <Text style={styles.contactValue}>{seller.email}</Text>
                    </View>
                  </View>
                )}
                
                {seller.responseTime && (
                  <View style={styles.contactItem}>
                    <Clock size={20} color={Colors.primary} />
                    <View style={styles.contactText}>
                      <Text style={styles.contactLabel}>Antwortzeit</Text>
                      <Text style={styles.contactValue}>{seller.responseTime}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
            
            {seller.description && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Über den Verkäufer</Text>
                <Text style={styles.description}>{seller.description}</Text>
              </View>
            )}
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Statistiken</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{seller.activeListings}</Text>
                  <Text style={styles.statLabel}>Aktive Anzeigen</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{seller.totalSold}</Text>
                  <Text style={styles.statLabel}>Verkauft</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{formatDate(seller.memberSince)}</Text>
                  <Text style={styles.statLabel}>Mitglied seit</Text>
                </View>
              </View>
            </View>
          </View>
        );
        
      case 'reviews':
        return (
          <View style={styles.tabContent}>
            {seller.reviews.length > 0 ? (
              seller.reviews.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewerInfo}>
                      {review.reviewerAvatar && (
                        <Image
                          source={{ uri: review.reviewerAvatar }}
                          style={styles.reviewerAvatar}
                        />
                      )}
                      <View>
                        <Text style={styles.reviewerName}>{review.reviewerName}</Text>
                        <Text style={styles.reviewDate}>
                          {new Date(review.createdAt).toLocaleDateString('de-DE')}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.reviewRating}>
                      {renderStars(review.rating)}
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{review.comment}</Text>
                  {review.carTitle && (
                    <Text style={styles.reviewCarTitle}>Fahrzeug: {review.carTitle}</Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noReviewsText}>Noch keine Bewertungen vorhanden</Text>
            )}
          </View>
        );
        
      case 'listings':
        return (
          <View style={styles.tabContent}>
            {sellerListings.length > 0 ? (
              <FlatList
                data={sellerListings}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <CarListItem car={item} />}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.noListingsText}>Keine aktiven Anzeigen vorhanden</Text>
            )}
          </View>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            {seller.avatar && (
              <Image
                source={{ uri: seller.avatar }}
                style={styles.avatar}
              />
            )}
            <View style={styles.profileDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{seller.name}</Text>
                {seller.verified && (
                  <Shield size={20} color={Colors.primary} />
                )}
              </View>
              <Text style={styles.type}>{seller.type}</Text>
              
              <View style={styles.ratingRow}>
                <View style={styles.stars}>
                  {renderStars(Math.round(seller.rating.average))}
                </View>
                <Text style={styles.ratingText}>
                  {seller.rating.average.toFixed(1)} ({seller.rating.count} Bewertungen)
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.tabs}>
          <Pressable
            style={[styles.tab, activeTab === 'info' && styles.activeTab]}
            onPress={() => setActiveTab('info')}
          >
            <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
              Info
            </Text>
          </Pressable>
          
          <Pressable
            style={[styles.tab, activeTab === 'reviews' && styles.activeTab]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabText, activeTab === 'reviews' && styles.activeTabText]}>
              Bewertungen ({seller.reviews.length})
            </Text>
          </Pressable>
          
          <Pressable
            style={[styles.tab, activeTab === 'listings' && styles.activeTab]}
            onPress={() => setActiveTab('listings')}
          >
            <Text style={[styles.tabText, activeTab === 'listings' && styles.activeTabText]}>
              Anzeigen ({sellerListings.length})
            </Text>
          </Pressable>
        </View>
        
        {renderTabContent()}
      </ScrollView>
      
      <View style={styles.footer}>
        <Link href={`/messages/new?receiverId=${seller.id}`} asChild>
          <Pressable style={styles.contactButton}>
            <MessageCircle size={20} color={Colors.background} style={styles.contactButtonIcon} />
            <Text style={styles.contactButtonText}>Nachricht senden</Text>
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
  header: {
    padding: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
    backgroundColor: Colors.placeholder,
  },
  profileDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginRight: 8,
  },
  type: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondaryText,
  },
  activeTabText: {
    color: Colors.primary,
  },
  tabContent: {
    padding: 16,
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
  contactInfo: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  contactText: {
    marginLeft: 12,
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
  reviewItem: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: Colors.placeholder,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  reviewDate: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
    marginBottom: 8,
  },
  reviewCarTitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    fontStyle: 'italic',
  },
  noReviewsText: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: 24,
  },
  noListingsText: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginTop: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  contactButton: {
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