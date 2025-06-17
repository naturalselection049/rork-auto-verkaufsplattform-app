import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Send, ThumbsUp, MessageSquare } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useForumStore } from '@/store/forum';
import { ForumComment } from '@/types/forum';

export default function ForumPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getPost, addComment, likePost, unlikePost } = useForumStore();
  const [commentText, setCommentText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  
  const post = getPost(id);
  
  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Beitrag nicht gefunden</Text>
      </SafeAreaView>
    );
  }
  
  const isLiked = post.likedBy.includes('currentUser');
  
  const handleLike = () => {
    if (isLiked) {
      unlikePost(id);
    } else {
      likePost(id);
    }
  };
  
  const handleAddComment = () => {
    if (!commentText.trim()) return;
    
    addComment(id, {
      id: Date.now().toString(),
      authorId: 'currentUser',
      author: 'Du',
      content: commentText.trim(),
      createdAt: new Date().toISOString(),
      likedBy: [],
    });
    
    setCommentText('');
    
    // Scroll to bottom after adding comment
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Stack.Screen options={{ title: post.category }} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView 
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.postContainer}>
              <Text style={styles.postTitle}>{post.title}</Text>
              
              <View style={styles.postMeta}>
                <Text style={styles.postAuthor}>{post.author}</Text>
                <Text style={styles.postDate}>{formatDate(post.createdAt)}</Text>
              </View>
              
              <Text style={styles.postContent}>{post.content}</Text>
              
              <View style={styles.postActions}>
                <Pressable style={styles.actionButton} onPress={handleLike}>
                  <ThumbsUp 
                    size={20} 
                    color={isLiked ? Colors.primary : Colors.secondaryText}
                    fill={isLiked ? Colors.primary : 'transparent'}
                  />
                  <Text 
                    style={[
                      styles.actionButtonText,
                      isLiked && styles.actionButtonTextActive
                    ]}
                  >
                    {post.likedBy.length}
                  </Text>
                </Pressable>
                
                <View style={styles.actionButton}>
                  <MessageSquare size={20} color={Colors.secondaryText} />
                  <Text style={styles.actionButtonText}>{post.comments.length}</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.commentsSection}>
              <Text style={styles.commentsTitle}>Kommentare</Text>
              
              {post.comments.length === 0 ? (
                <Text style={styles.noCommentsText}>Noch keine Kommentare. Sei der Erste!</Text>
              ) : (
                post.comments.map((comment: ForumComment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{comment.author}</Text>
                      <Text style={styles.commentDate}>{formatDate(comment.createdAt)}</Text>
                    </View>
                    <Text style={styles.commentContent}>{comment.content}</Text>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Kommentar schreiben..."
              value={commentText}
              onChangeText={setCommentText}
              multiline
            />
            <Pressable 
              style={[
                styles.sendButton,
                !commentText.trim() && styles.sendButtonDisabled
              ]} 
              onPress={handleAddComment}
              disabled={!commentText.trim()}
            >
              <Send size={20} color={Colors.background} />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 24,
    color: Colors.text,
  },
  postContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  postTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.secondaryText,
  },
  postDate: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  postContent: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionButtonText: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginLeft: 4,
  },
  actionButtonTextActive: {
    color: Colors.primary,
  },
  commentsSection: {
    marginBottom: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  noCommentsText: {
    fontSize: 16,
    color: Colors.secondaryText,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 24,
  },
  commentItem: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text,
  },
  commentDate: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  commentContent: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.secondaryText,
  },
});