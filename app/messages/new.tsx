import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { Send } from 'lucide-react-native';
import { useMessagesStore } from '@/store/messages';
import { Colors } from '@/constants/colors';
import { carListings } from '@/mocks/cars';

export default function NewMessageScreen() {
  const router = useRouter();
  const { carId, receiverId } = useLocalSearchParams<{ carId?: string, receiverId?: string }>();
  const { addMessage } = useMessagesStore();
  const [messageText, setMessageText] = useState('');
  
  const car = carId ? carListings.find(c => c.id === carId) : undefined;
  
  const sendMessage = () => {
    if (!messageText.trim() || !receiverId) return;
    
    const newMessage = {
      id: Date.now().toString(),
      senderId: 'currentUser',
      receiverId,
      carId,
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    
    const conversationId = addMessage(newMessage);
    setMessageText('');
    
    // Navigate to the conversation
    router.replace(`/messages/${conversationId}`);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Neue Nachricht" }} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.content}>
            {car && (
              <View style={styles.carInfo}>
                <Text style={styles.carInfoLabel}>Fahrzeug:</Text>
                <Text style={styles.carInfoValue}>{car.title}</Text>
              </View>
            )}
            
            <View style={styles.recipientInfo}>
              <Text style={styles.recipientInfoLabel}>An:</Text>
              <Text style={styles.recipientInfoValue}>{receiverId}</Text>
            </View>
            
            <TextInput
              style={styles.messageInput}
              placeholder="Schreibe deine Nachricht..."
              value={messageText}
              onChangeText={setMessageText}
              multiline
              autoFocus
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Pressable 
              style={[
                styles.sendButton,
                !messageText.trim() && styles.sendButtonDisabled
              ]} 
              onPress={sendMessage}
              disabled={!messageText.trim()}
            >
              <Send size={20} color={Colors.background} />
              <Text style={styles.sendButtonText}>Senden</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  carInfo: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
  },
  carInfoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  carInfoValue: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  recipientInfo: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
  },
  recipientInfoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  recipientInfoValue: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  messageInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  sendButton: {
    flexDirection: 'row',
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Colors.secondaryText,
  },
  sendButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});