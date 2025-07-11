import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable, ScrollView, Switch, Alert, Modal, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { 
  Settings, MessageCircle, Car, Bell, Shield, 
  HelpCircle, LogOut, ChevronRight, Camera
} from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import * as ImagePicker from 'expo-image-picker';
import { useProfileStore } from '@/store/profile';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, updateProfile, updateSettings } = useProfileStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showMyListingsModal, setShowMyListingsModal] = useState(false);
  const [showForumPostsModal, setShowForumPostsModal] = useState(false);
  
  const [editName, setEditName] = useState(`${user?.firstName || ''} ${user?.lastName || ''}`);
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const pickProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        "Galerie-Berechtigung erforderlich",
        "Bitte erlaube den Zugriff auf deine Fotos, um ein Profilbild auszuwählen."
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        updateProfile({ ...profile, avatar: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Fehler", "Beim Auswählen des Bildes ist ein Fehler aufgetreten.");
    }
  };
  
  const saveProfileChanges = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      updateProfile({ ...profile, name: editName, email: editEmail });
      setShowEditModal(false);
      setIsLoading(false);
      Alert.alert("Erfolg", "Deine Profiländerungen wurden gespeichert.");
    }, 1000);
  };
  
  const handleLogout = () => {
    Alert.alert(
      "Abmelden",
      "Möchtest du dich wirklich abmelden?",
      [
        {
          text: "Abbrechen",
          style: "cancel"
        },
        {
          text: "Abmelden",
          onPress: async () => {
            setIsLoading(true);
            try {
              await logout();
              router.replace('/auth/login');
            } catch (error) {
              Alert.alert("Fehler", "Beim Abmelden ist ein Fehler aufgetreten.");
            } finally {
              setIsLoading(false);
            }
          }
        }
      ]
    );
  };
  
  const navigateToMyListings = () => {
    setShowMyListingsModal(true);
  };
  
  const navigateToForumPosts = () => {
    setShowForumPostsModal(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      )}
      
      <ScrollView>
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <Pressable style={styles.avatarContainer} onPress={pickProfileImage}>
              <Image
                source={{ uri: profile.avatar }}
                style={styles.avatar}
              />
              <View style={styles.cameraIconContainer}>
                <Camera size={16} color={Colors.background} />
              </View>
            </Pressable>
            <View>
              <Text style={styles.name}>{user?.firstName} {user?.lastName}</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
          </View>
          <Pressable style={styles.editButton} onPress={() => setShowEditModal(true)}>
            <Text style={styles.editButtonText}>Bearbeiten</Text>
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mein Konto</Text>
          
          <MenuItem 
            icon={<Car size={22} color={Colors.primary} />}
            title="Meine Inserate"
            subtitle="Verwalte deine Fahrzeuganzeigen"
            onPress={navigateToMyListings}
          />
          
          <MenuItem 
            icon={<MessageCircle size={22} color={Colors.primary} />}
            title="Forum-Beiträge"
            subtitle="Verwalte deine Beiträge im Forum"
            onPress={navigateToForumPosts}
          />
          
          <MenuItem 
            icon={<Bell size={22} color={Colors.primary} />}
            title="Benachrichtigungen"
            subtitle="Verwalte deine Benachrichtigungen"
            onPress={() => setShowNotificationsModal(true)}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Einstellungen</Text>
          
          <MenuItem 
            icon={<Settings size={22} color={Colors.secondaryText} />}
            title="App-Einstellungen"
            onPress={() => setShowSettingsModal(true)}
          />
          
          <MenuItem 
            icon={<Shield size={22} color={Colors.secondaryText} />}
            title="Datenschutz & Sicherheit"
            onPress={() => setShowPrivacyModal(true)}
          />
          
          <MenuItem 
            icon={<HelpCircle size={22} color={Colors.secondaryText} />}
            title="Hilfe & Support"
            onPress={() => setShowHelpModal(true)}
          />
        </View>
        
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={22} color={Colors.notification} />
          <Text style={styles.logoutText}>Abmelden</Text>
        </Pressable>
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
      
      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profil bearbeiten</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Dein Name"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-Mail</Text>
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                keyboardType="email-address"
                placeholder="deine.email@beispiel.de"
              />
            </View>
            
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.modalButtonCancelText}>Abbrechen</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={saveProfileChanges}
              >
                <Text style={styles.modalButtonSaveText}>Speichern</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Settings Modal */}
      <Modal
        visible={showSettingsModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>App-Einstellungen</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Dunkelmodus</Text>
              <Switch
                value={profile.settings.darkMode}
                onValueChange={(value) => updateSettings({ ...profile.settings, darkMode: value })}
                trackColor={{ false: Colors.border, true: Colors.primary }}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Push-Benachrichtigungen</Text>
              <Switch
                value={profile.settings.pushNotifications}
                onValueChange={(value) => updateSettings({ ...profile.settings, pushNotifications: value })}
                trackColor={{ false: Colors.border, true: Colors.primary }}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Standort-Dienste</Text>
              <Switch
                value={profile.settings.locationServices}
                onValueChange={(value) => updateSettings({ ...profile.settings, locationServices: value })}
                trackColor={{ false: Colors.border, true: Colors.primary }}
              />
            </View>
            
            <Pressable 
              style={styles.closeModalButton}
              onPress={() => setShowSettingsModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Schließen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      {/* Notifications Modal */}
      <Modal
        visible={showNotificationsModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Benachrichtigungen</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Neue Nachrichten</Text>
              <Switch
                value={profile.notifications.messages}
                onValueChange={(value) => updateProfile({
                  ...profile,
                  notifications: { ...profile.notifications, messages: value }
                })}
                trackColor={{ false: Colors.border, true: Colors.primary }}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Forum-Antworten</Text>
              <Switch
                value={profile.notifications.forumReplies}
                onValueChange={(value) => updateProfile({
                  ...profile,
                  notifications: { ...profile.notifications, forumReplies: value }
                })}
                trackColor={{ false: Colors.border, true: Colors.primary }}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Neue Fahrzeuge</Text>
              <Switch
                value={profile.notifications.newListings}
                onValueChange={(value) => updateProfile({
                  ...profile,
                  notifications: { ...profile.notifications, newListings: value }
                })}
                trackColor={{ false: Colors.border, true: Colors.primary }}
              />
            </View>
            
            <Pressable 
              style={styles.closeModalButton}
              onPress={() => setShowNotificationsModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Schließen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      {/* Privacy Modal */}
      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Datenschutz & Sicherheit</Text>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Profil öffentlich sichtbar</Text>
              <Switch
                value={profile.privacy.publicProfile}
                onValueChange={(value) => updateProfile({
                  ...profile,
                  privacy: { ...profile.privacy, publicProfile: value }
                })}
                trackColor={{ false: Colors.border, true: Colors.primary }}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Aktivitäten anzeigen</Text>
              <Switch
                value={profile.privacy.showActivity}
                onValueChange={(value) => updateProfile({
                  ...profile,
                  privacy: { ...profile.privacy, showActivity: value }
                })}
                trackColor={{ false: Colors.border, true: Colors.primary }}
              />
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Daten für Werbung nutzen</Text>
              <Switch
                value={profile.privacy.dataForAds}
                onValueChange={(value) => updateProfile({
                  ...profile,
                  privacy: { ...profile.privacy, dataForAds: value }
                })}
                trackColor={{ false: Colors.border, true: Colors.primary }}
              />
            </View>
            
            <Pressable 
              style={styles.closeModalButton}
              onPress={() => setShowPrivacyModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Schließen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      {/* Help Modal */}
      <Modal
        visible={showHelpModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Hilfe & Support</Text>
            
            <Pressable style={styles.helpItem} onPress={() => Alert.alert("FAQ", "Hier findest du Antworten auf häufig gestellte Fragen.")}>
              <Text style={styles.helpItemText}>Häufig gestellte Fragen</Text>
              <ChevronRight size={20} color={Colors.secondaryText} />
            </Pressable>
            
            <Pressable style={styles.helpItem} onPress={() => Alert.alert("Kontakt", "Kontaktiere unseren Support per E-Mail oder Telefon.")}>
              <Text style={styles.helpItemText}>Kontakt zum Support</Text>
              <ChevronRight size={20} color={Colors.secondaryText} />
            </Pressable>
            
            <Pressable style={styles.helpItem} onPress={() => Alert.alert("Nutzungsbedingungen", "Hier findest du unsere Nutzungsbedingungen.")}>
              <Text style={styles.helpItemText}>Nutzungsbedingungen</Text>
              <ChevronRight size={20} color={Colors.secondaryText} />
            </Pressable>
            
            <Pressable style={styles.helpItem} onPress={() => Alert.alert("Datenschutz", "Hier findest du unsere Datenschutzrichtlinien.")}>
              <Text style={styles.helpItemText}>Datenschutzrichtlinien</Text>
              <ChevronRight size={20} color={Colors.secondaryText} />
            </Pressable>
            
            <Pressable 
              style={styles.closeModalButton}
              onPress={() => setShowHelpModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Schließen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      {/* My Listings Modal */}
      <Modal
        visible={showMyListingsModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Meine Inserate</Text>
            
            <View style={styles.listingItem}>
              <Text style={styles.listingTitle}>BMW 3er 320d</Text>
              <Text style={styles.listingDetails}>€24.500 • 45.000 km • 2019</Text>
              <View style={styles.listingStatus}>
                <Text style={styles.listingStatusText}>Aktiv</Text>
              </View>
            </View>
            
            <View style={styles.listingItem}>
              <Text style={styles.listingTitle}>VW Golf 7 GTI</Text>
              <Text style={styles.listingDetails}>€18.900 • 65.000 km • 2017</Text>
              <View style={[styles.listingStatus, styles.listingStatusPending]}>
                <Text style={styles.listingStatusText}>In Prüfung</Text>
              </View>
            </View>
            
            <Pressable 
              style={styles.closeModalButton}
              onPress={() => setShowMyListingsModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Schließen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      {/* Forum Posts Modal */}
      <Modal
        visible={showForumPostsModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Meine Forum-Beiträge</Text>
            
            <View style={styles.forumPostItem}>
              <Text style={styles.forumPostTitle}>Erfahrungen mit BMW 3er G20?</Text>
              <Text style={styles.forumPostDetails}>Kaufberatung • 12 Antworten • vor 2 Tagen</Text>
            </View>
            
            <View style={styles.forumPostItem}>
              <Text style={styles.forumPostTitle}>Probleme mit AdBlue-System</Text>
              <Text style={styles.forumPostDetails}>Technik • 5 Antworten • vor 1 Woche</Text>
            </View>
            
            <View style={styles.forumPostItem}>
              <Text style={styles.forumPostTitle}>Welche Winterreifen für Audi A4?</Text>
              <Text style={styles.forumPostDetails}>Kaufberatung • 8 Antworten • vor 3 Wochen</Text>
            </View>
            
            <Pressable 
              style={styles.closeModalButton}
              onPress={() => setShowForumPostsModal(false)}
            >
              <Text style={styles.closeModalButtonText}>Schließen</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function MenuItem({ 
  icon, 
  title, 
  subtitle,
  onPress
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        {icon}
        <View style={styles.menuItemTextContainer}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <ChevronRight size={20} color={Colors.secondaryText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.placeholder,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.card,
    borderRadius: 20,
  },
  editButtonText: {
    color: Colors.primary,
    fontWeight: '500',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTextContainer: {
    marginLeft: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    color: Colors.text,
    fontWeight: '500',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 16,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.notification,
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 32,
    fontSize: 14,
    color: Colors.secondaryText,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    backgroundColor: Colors.card,
    marginRight: 8,
  },
  modalButtonCancelText: {
    color: Colors.secondaryText,
    fontSize: 16,
    fontWeight: '500',
  },
  modalButtonSave: {
    backgroundColor: Colors.primary,
    marginLeft: 8,
  },
  modalButtonSaveText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLabel: {
    fontSize: 16,
    color: Colors.text,
  },
  closeModalButton: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    marginTop: 20,
  },
  closeModalButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '500',
  },
  helpItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  helpItemText: {
    fontSize: 16,
    color: Colors.text,
  },
  listingItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 12,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  listingDetails: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 8,
  },
  listingStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  listingStatusPending: {
    backgroundColor: Colors.secondaryText,
  },
  listingStatusText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '500',
  },
  forumPostItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 12,
  },
  forumPostTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  forumPostDetails: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
});