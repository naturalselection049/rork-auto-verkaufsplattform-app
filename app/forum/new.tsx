import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useForumStore } from '@/store/forum';

export default function NewForumPostScreen() {
  const router = useRouter();
  const { addPost } = useForumStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Allgemein');
  
  const categories = [
    'Allgemein',
    'Kaufberatung',
    'Technik',
    'Reparatur',
    'Tuning',
    'Elektromobilität',
    'Oldtimer',
  ];
  
  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert("Fehler", "Bitte gib einen Titel ein.");
      return;
    }
    
    if (!content.trim()) {
      Alert.alert("Fehler", "Bitte gib einen Inhalt ein.");
      return;
    }
    
    const newPost = {
      id: Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      category,
      author: 'Du',
      authorId: 'currentUser',
      createdAt: new Date().toISOString(),
      comments: [],
      likedBy: [],
      commentCount: 0,
    };
    
    addPost(newPost);
    
    Alert.alert(
      "Erfolg",
      "Dein Beitrag wurde erfolgreich erstellt.",
      [
        {
          text: "OK",
          onPress: () => router.push('/forum')
        }
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: "Neuer Beitrag" }} />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Kategorie</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
            >
              {categories.map((cat) => (
                <Pressable
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipSelected
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text 
                    style={[
                      styles.categoryChipText,
                      category === cat && styles.categoryChipTextSelected
                    ]}
                  >
                    {cat}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Titel</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Gib einen aussagekräftigen Titel ein"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Inhalt</Text>
            <TextInput
              style={styles.contentInput}
              placeholder="Beschreibe dein Anliegen ausführlich"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
          </View>
          
          <Pressable 
            style={[
              styles.submitButton,
              (!title.trim() || !content.trim()) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!title.trim() || !content.trim()}
          >
            <Text style={styles.submitButtonText}>Beitrag erstellen</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  categoriesContainer: {
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
  titleInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  charCount: {
    fontSize: 12,
    color: Colors.secondaryText,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  contentInput: {
    height: 200,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.secondaryText,
  },
  submitButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});