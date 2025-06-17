import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Search, MessageSquare, MessageCircle, Plus } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useForumStore } from '@/store/forum';
import { ForumPost } from '@/types/forum';

export default function ForumScreen() {
  const { posts } = useForumStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPostItem = ({ item }: { item: ForumPost }) => (
    <Link href={`/forum/${item.id}`} asChild>
      <Pressable style={styles.postItem}>
        <View style={styles.postHeader}>
          <Text style={styles.postCategory}>{item.category}</Text>
          <Text style={styles.postDate}>{formatDate(item.createdAt)}</Text>
        </View>
        
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postContent} numberOfLines={2}>{item.content}</Text>
        
        <View style={styles.postFooter}>
          <View style={styles.postAuthor}>
            <Text style={styles.postAuthorName}>{item.author}</Text>
          </View>
          
          <View style={styles.postStats}>
            <View style={styles.postStat}>
              <MessageSquare size={14} color={Colors.secondaryText} />
              <Text style={styles.postStatText}>{item.commentCount}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If post is from today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If post is from this week, show day name
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Suche im Forum"
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
        </View>
        
        <Link href="/direct-messages" asChild>
          <Pressable style={styles.messagesButton}>
            <MessageCircle size={22} color={Colors.primary} />
          </Pressable>
        </Link>
      </View>
      
      <FlatList
        data={filteredPosts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>Kategorien</Text>
            <ScrollableCategories />
            
            <View style={styles.forumHeader}>
              <Text style={styles.forumTitle}>Neueste Beiträge</Text>
              <Link href="/forum/new" asChild>
                <Pressable style={styles.newPostButton}>
                  <Plus size={16} color={Colors.background} />
                  <Text style={styles.newPostButtonText}>Neuer Beitrag</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? "Keine Beiträge gefunden. Versuche es mit anderen Suchbegriffen."
                : "Noch keine Beiträge im Forum. Erstelle den ersten Beitrag!"}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function ScrollableCategories() {
  const categories = [
    { id: '1', name: 'Alle' },
    { id: '2', name: 'Kaufberatung' },
    { id: '3', name: 'Technik' },
    { id: '4', name: 'Reparatur' },
    { id: '5', name: 'Tuning' },
    { id: '6', name: 'Elektromobilität' },
    { id: '7', name: 'Oldtimer' },
  ];
  
  const [selectedCategory, setSelectedCategory] = useState('1');
  
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoriesScrollContent}
    >
      {categories.map((category) => (
        <Pressable
          key={category.id}
          style={[
            styles.categoryChip,
            selectedCategory === category.id && styles.categoryChipSelected
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Text 
            style={[
              styles.categoryChipText,
              selectedCategory === category.id && styles.categoryChipTextSelected
            ]}
          >
            {category.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchContainer: {
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
  messagesButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    flexGrow: 1,
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  categoriesScrollContent: {
    paddingBottom: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    color: Colors.text,
  },
  categoryChipTextSelected: {
    color: Colors.background,
  },
  forumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  forumTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  newPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  newPostButtonText: {
    color: Colors.background,
    fontWeight: '600',
    marginLeft: 4,
  },
  postItem: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  postCategory: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  postDate: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  postContent: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAuthorName: {
    fontSize: 14,
    color: Colors.secondaryText,
    fontWeight: '500',
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  postStatText: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: 'center',
  },
});