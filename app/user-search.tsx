import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Pressable, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Search, MessageCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useDirectMessagesStore } from '@/store/directMessages';
import { mockUsers } from '@/mocks/users';

export default function UserSearchScreen() {
  const router = useRouter();
  const { addMessage, getConversationByParticipants } = useDirectMessagesStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredUsers = mockUsers.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startConversation = (userId: string, username: string) => {
    // Check if conversation already exists
    const existingConversation = getConversationByParticipants(['currentUser', userId]);
    
    if (existingConversation) {
      // Navigate to existing conversation
      router.push(`/direct-messages/${existingConversation.id}`);
    } else {
      // Ask for confirmation to start a new conversation
      Alert.alert(
        "Neue Konversation",
        `Möchtest du eine Konversation mit ${username} starten?`,
        [
          {
            text: "Abbrechen",
            style: "cancel"
          },
          {
            text: "Starten",
            onPress: () => {
              // Create a new message to start the conversation
              const newMessage = {
                id: Date.now().toString(),
                senderId: 'currentUser',
                receiverId: userId,
                content: `Hallo ${username}! Ich würde gerne mit dir chatten.`,
                timestamp: new Date().toISOString(),
                read: false,
              };
              
              // Add the message and get the conversation ID
              const conversationId = addMessage(newMessage);
              
              // Navigate to the new conversation
              router.push(`/direct-messages/${conversationId}`);
            }
          }
        ]
      );
    }
  };

  const renderUserItem = ({ item }: { item: typeof mockUsers[0] }) => (
    <View style={styles.userItem}>
      <Image
        source={{ uri: item.avatar }}
        style={styles.avatar}
      />
      
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      
      <Pressable 
        style={styles.messageButton}
        onPress={() => startConversation(item.id, item.username)}
      >
        <MessageCircle size={20} color={Colors.primary} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Benutzer suchen</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.secondaryText} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Nach Benutzernamen oder Namen suchen"
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
          autoFocus
        />
      </View>
      
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? "Keine Benutzer gefunden. Versuche es mit anderen Suchbegriffen."
                : "Gib einen Benutzernamen oder Namen ein, um zu suchen."}
            </Text>
          </View>
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
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
    padding: 16,
    flexGrow: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.placeholder,
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  name: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
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