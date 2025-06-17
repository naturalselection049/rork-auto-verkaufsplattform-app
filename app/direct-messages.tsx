import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Search, Plus } from 'lucide-react-native';
import { useDirectMessagesStore } from '@/store/directMessages';
import { Colors } from '@/constants/colors';
import { EmptyState } from '@/components/EmptyState';
import { Conversation } from '@/types/forum';

export default function DirectMessagesScreen() {
  const { conversations } = useDirectMessagesStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sort conversations by last message timestamp (newest first)
  const sortedConversations = [...conversations].sort((a, b) => {
    return new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime();
  });
  
  // Filter conversations based on search query
  const filteredConversations = sortedConversations.filter(conv => {
    const otherParticipant = conv.participantIds.find(id => id !== 'currentUser') || '';
    return otherParticipant.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const renderConversationItem = ({ item }: { item: Conversation }) => {
    const otherParticipant = item.participantIds.find(id => id !== 'currentUser') || '';
    
    return (
      <Link href={`/direct-messages/${item.id}`} asChild>
        <Pressable style={styles.conversationItem}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80' }}
            style={styles.avatar}
          />
          
          <View style={styles.conversationContent}>
            <View style={styles.conversationHeader}>
              <Text style={styles.conversationName}>{otherParticipant}</Text>
              <Text style={styles.conversationTime}>
                {formatMessageTime(item.lastMessage.timestamp)}
              </Text>
            </View>
            
            <View style={styles.conversationFooter}>
              <Text 
                style={[
                  styles.conversationLastMessage,
                  item.unreadCount > 0 && styles.conversationLastMessageUnread
                ]}
                numberOfLines={1}
              >
                {item.lastMessage.content}
              </Text>
              
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </View>
        </Pressable>
      </Link>
    );
  };
  
  const formatMessageTime = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    
    // If message is from today, show time
    if (messageDate.toDateString() === now.toDateString()) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If message is from this week, show day name
    const diffDays = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return messageDate.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show date
    return messageDate.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Direktnachrichten</Text>
        <Link href="/user-search" asChild>
          <Pressable style={styles.newMessageButton}>
            <Plus size={20} color={Colors.background} />
          </Pressable>
        </Link>
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.secondaryText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Nach Benutzern suchen"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>
      
      <FlatList
        data={filteredConversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState 
            title="Keine Nachrichten"
            message="Hier werden deine Direktnachrichten mit anderen Benutzern angezeigt."
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  newMessageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    marginHorizontal: 16,
    marginBottom: 16,
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
  listContent: {
    flexGrow: 1,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: Colors.placeholder,
  },
  conversationContent: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  conversationTime: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationLastMessage: {
    flex: 1,
    fontSize: 14,
    color: Colors.secondaryText,
  },
  conversationLastMessageUnread: {
    fontWeight: '500',
    color: Colors.text,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 6,
  },
});