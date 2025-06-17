import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Message, Conversation } from '@/types/car';

interface MessagesState {
  conversations: Conversation[];
  messages: Record<string, Message[]>; // conversationId -> messages
  addMessage: (message: Message, conversationId?: string) => string; // returns conversationId
  markConversationAsRead: (conversationId: string) => void;
  getConversation: (conversationId: string) => Conversation | undefined;
  getConversationByParticipants: (participantIds: string[]) => Conversation | undefined;
  getMessages: (conversationId: string) => Message[];
  getUnreadCount: () => number;
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      conversations: [],
      messages: {},
      
      addMessage: (message: Message, conversationId?: string): string => {
        let targetConversationId = conversationId;
        
        // If no conversationId provided, try to find existing conversation or create new one
        if (!targetConversationId) {
          const participantIds = [message.senderId, message.receiverId];
          const existingConversation = get().getConversationByParticipants(participantIds);
          
          if (existingConversation) {
            targetConversationId = existingConversation.id;
          } else {
            // Create new conversation with a guaranteed string ID
            const newConversationId = Date.now().toString();
            targetConversationId = newConversationId;
            
            // Create new conversation
            set((state) => ({
              conversations: [
                ...state.conversations,
                {
                  id: newConversationId,
                  participantIds,
                  lastMessage: message,
                  unreadCount: message.senderId === 'currentUser' ? 0 : 1, // If current user is sender, no unread
                }
              ]
            }));
          }
        }
        
        // Add message to conversation
        set((state) => {
          const conversationMessages = state.messages[targetConversationId!] || [];
          const updatedMessages = {
            ...state.messages,
            [targetConversationId!]: [...conversationMessages, message]
          };
          
          // Update last message and unread count in conversation
          const updatedConversations = state.conversations.map(conv => {
            if (conv.id === targetConversationId) {
              return {
                ...conv,
                lastMessage: message,
                unreadCount: message.senderId === 'currentUser' 
                  ? conv.unreadCount 
                  : conv.unreadCount + 1
              };
            }
            return conv;
          });
          
          return {
            messages: updatedMessages,
            conversations: updatedConversations
          };
        });
        
        return targetConversationId!;
      },
      
      markConversationAsRead: (conversationId: string) => {
        set((state) => ({
          conversations: state.conversations.map(conv => 
            conv.id === conversationId 
              ? { ...conv, unreadCount: 0 } 
              : conv
          ),
          messages: {
            ...state.messages,
            [conversationId]: (state.messages[conversationId] || []).map(msg => 
              msg.receiverId === 'currentUser' ? { ...msg, read: true } : msg
            )
          }
        }));
      },
      
      getConversation: (conversationId: string) => {
        return get().conversations.find(conv => conv.id === conversationId);
      },
      
      getConversationByParticipants: (participantIds: string[]) => {
        const sortedIds = [...participantIds].sort();
        return get().conversations.find(conv => {
          const convIds = [...conv.participantIds].sort();
          return convIds.length === sortedIds.length && 
                 convIds.every((id, index) => id === sortedIds[index]);
        });
      },
      
      getMessages: (conversationId: string) => {
        return get().messages[conversationId] || [];
      },
      
      getUnreadCount: () => {
        return get().conversations.reduce((total, conv) => total + conv.unreadCount, 0);
      }
    }),
    {
      name: 'messages-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);