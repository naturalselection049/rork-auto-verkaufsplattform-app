import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Alert, Platform, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, Upload, ChevronRight, Image as ImageIcon, Search, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';

// Mock VIN lookup service
const lookupVinData = (vin: string) => {
  // In a real app, this would be an API call
  return new Promise<{
    brand: string;
    model: string;
    year: string;
    fuelType: string;
    transmission?: string;
    power?: string;
    color?: string;
    bodyType?: string;
    doors?: string;
    seats?: string;
    engineSize?: string;
    success: boolean;
    message?: string;
  }>((resolve) => {
    setTimeout(() => {
      // Simulate successful lookup for specific VIN
      if (vin === 'WVWZZZ1KZAM123456') {
        resolve({
          brand: 'Volkswagen',
          model: 'Golf',
          year: '2020',
          fuelType: 'Benzin',
          transmission: 'Automatik',
          power: '150',
          color: 'Schwarz',
          bodyType: 'Limousine',
          doors: '5',
          seats: '5',
          engineSize: '1.5',
          success: true
        });
      } else if (vin === 'WAUZZZ8K9DA123456') {
        resolve({
          brand: 'Audi',
          model: 'A3',
          year: '2019',
          fuelType: 'Diesel',
          transmission: 'Manuell',
          power: '150',
          color: 'Silber',
          bodyType: 'Limousine',
          doors: '5',
          seats: '5',
          engineSize: '2.0',
          success: true
        });
      } else if (vin.length === 17) {
        // Random data for valid VIN format
        const brands = ['BMW', 'Mercedes-Benz', 'Volkswagen', 'Audi', 'Porsche'];
        const models = ['3er', 'C-Klasse', 'Golf', 'A4', '911'];
        const years = ['2018', '2019', '2020', '2021', '2022'];
        const fuelTypes = ['Benzin', 'Diesel', 'Hybrid', 'Elektro'];
        const transmissions = ['Automatik', 'Manuell'];
        const colors = ['Schwarz', 'Weiß', 'Silber', 'Blau', 'Rot'];
        const bodyTypes = ['Limousine', 'Kombi', 'SUV', 'Coupé', 'Cabrio'];
        
        const randomIndex = Math.floor(Math.random() * 5);
        
        resolve({
          brand: brands[randomIndex],
          model: models[randomIndex],
          year: years[Math.floor(Math.random() * years.length)],
          fuelType: fuelTypes[Math.floor(Math.random() * fuelTypes.length)],
          transmission: transmissions[Math.floor(Math.random() * transmissions.length)],
          power: String(Math.floor(Math.random() * 200) + 100),
          color: colors[Math.floor(Math.random() * colors.length)],
          bodyType: bodyTypes[Math.floor(Math.random() * bodyTypes.length)],
          doors: String(Math.floor(Math.random() * 2) + 3),
          seats: String(Math.floor(Math.random() * 3) + 4),
          engineSize: (Math.random() * 3 + 1).toFixed(1),
          success: true
        });
      } else {
        resolve({
          brand: '',
          model: '',
          year: '',
          fuelType: '',
          success: false,
          message: 'Ungültige VIN. Bitte gib eine 17-stellige VIN ein.'
        });
      }
    }, 1500);
  });
};

export default function AddListingScreen() {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const [images, setImages] = useState<string[]>([]);
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [power, setPower] = useState('');
  const [color, setColor] = useState('');
  const [bodyType, setBodyType] = useState('');
  const [doors, setDoors] = useState('');
  const [seats, setSeats] = useState('');
  const [engineSize, setEngineSize] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [sellerType, setSellerType] = useState('');
  const [vin, setVin] = useState('');
  const [isLookingUpVin, setIsLookingUpVin] = useState(false);
  const [showManualDataForm, setShowManualDataForm] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  
  const cameraRef = useRef<any>(null);

  const openCamera = async () => {
    if (!cameraPermission?.granted) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert(
          "Kamera-Berechtigung erforderlich",
          "Bitte erlaube den Zugriff auf die Kamera, um Fotos aufzunehmen."
        );
        return;
      }
    }
    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setImages([...images, photo.uri]);
        setShowCamera(false);
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Fehler", "Beim Aufnehmen des Fotos ist ein Fehler aufgetreten.");
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        "Galerie-Berechtigung erforderlich",
        "Bitte erlaube den Zugriff auf deine Fotos, um Bilder auszuwählen."
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImages([...images, result.assets[0].uri]);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Fehler", "Beim Auswählen des Bildes ist ein Fehler aufgetreten.");
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };
  
  const lookupVin = async () => {
    if (!vin || vin.length !== 17) {
      Alert.alert("Fehler", "Bitte gib eine gültige 17-stellige VIN ein.");
      return;
    }
    
    setIsLookingUpVin(true);
    
    try {
      const result = await lookupVinData(vin);
      
      if (result.success) {
        setBrand(result.brand);
        setModel(result.model);
        setYear(result.year);
        setFuelType(result.fuelType);
        if (result.transmission) setTransmission(result.transmission);
        if (result.power) setPower(result.power);
        if (result.color) setColor(result.color);
        if (result.bodyType) setBodyType(result.bodyType);
        if (result.doors) setDoors(result.doors);
        if (result.seats) setSeats(result.seats);
        if (result.engineSize) setEngineSize(result.engineSize);
        Alert.alert("Erfolg", "Fahrzeugdaten wurden erfolgreich abgerufen.");
      } else {
        Alert.alert("Fehler", result.message || "Fahrzeugdaten konnten nicht abgerufen werden.");
      }
    } catch (error) {
      console.error("Error looking up VIN:", error);
      Alert.alert("Fehler", "Bei der Abfrage der Fahrzeugdaten ist ein Fehler aufgetreten.");
    } finally {
      setIsLookingUpVin(false);
    }
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...features];
    newFeatures.splice(index, 1);
    setFeatures(newFeatures);
  };

  if (showCamera) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <CameraView
          style={styles.camera}
          facing={cameraType}
          ref={cameraRef}
        >
          <View style={styles.cameraControls}>
            <Pressable 
              style={styles.flipButton}
              onPress={() => setCameraType(current => (current === 'back' ? 'front' : 'back'))}
            >
              <Text style={styles.flipButtonText}>Kamera wechseln</Text>
            </Pressable>
            
            <Pressable 
              style={styles.captureButton}
              onPress={takePicture}
            >
              <View style={styles.captureButtonInner} />
            </Pressable>
            
            <Pressable 
              style={styles.cancelButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.cancelButtonText}>Abbrechen</Text>
            </Pressable>
          </View>
        </CameraView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Fahrzeug inserieren</Text>
        <Text style={styles.subtitle}>Verkaufe dein Auto schnell und einfach</Text>
        
        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>Fotos hinzufügen</Text>
          <Text style={styles.sectionSubtitle}>Gute Fotos erhöhen deine Verkaufschancen</Text>
          
          {images.length > 0 && (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagePreviewContainer}
            >
              {images.map((uri, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image source={{ uri }} style={styles.previewImage} />
                  <Pressable 
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
                  >
                    <Text style={styles.removeImageButtonText}>X</Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}
          
          <View style={styles.photoButtons}>
            <Pressable style={styles.photoButton} onPress={openCamera}>
              <Camera size={24} color={Colors.primary} />
              <Text style={styles.photoButtonText}>Kamera</Text>
            </Pressable>
            
            <Pressable style={styles.photoButton} onPress={pickImage}>
              <Upload size={24} color={Colors.primary} />
              <Text style={styles.photoButtonText}>Galerie</Text>
            </Pressable>
          </View>
        </View>
        
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Fahrzeug per VIN identifizieren</Text>
          <Text style={styles.sectionSubtitle}>Gib die Fahrzeug-Identifikationsnummer ein, um Daten automatisch zu laden</Text>
          
          <View style={styles.vinContainer}>
            <TextInput
              style={styles.vinInput}
              placeholder="17-stellige VIN eingeben"
              value={vin}
              onChangeText={setVin}
              maxLength={17}
              autoCapitalize="characters"
            />
            <Pressable 
              style={[styles.vinButton, isLookingUpVin && styles.vinButtonDisabled]}
              onPress={lookupVin}
              disabled={isLookingUpVin}
            >
              {isLookingUpVin ? (
                <ActivityIndicator size="small" color={Colors.background} />
              ) : (
                <Search size={20} color={Colors.background} />
              )}
            </Pressable>
          </View>
          
          <Text style={styles.vinHelp}>Die VIN findest du in deinem Fahrzeugschein oder an der Windschutzscheibe</Text>
        </View>
        
        <Pressable 
          style={styles.manualDataButton}
          onPress={() => setShowManualDataForm(true)}
        >
          <Text style={styles.manualDataButtonText}>Manuelle Fahrzeugdaten eingeben</Text>
          <ChevronRight size={20} color={Colors.primary} />
        </Pressable>
        
        <Pressable 
          style={[styles.submitButton, (!brand || !model || !year || !mileage || !fuelType) && styles.submitButtonDisabled]}
          disabled={!brand || !model || !year || !mileage || !fuelType}
          onPress={() => Alert.alert("Erfolg", "Deine Anzeige wurde erstellt und wird geprüft.")}
        >
          <Text style={styles.submitButtonText}>Weiter</Text>
        </Pressable>
      </ScrollView>
      
      {/* Manual Data Entry Modal */}
      <Modal
        visible={showManualDataForm}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Fahrzeugdaten</Text>
            
            <ScrollView style={styles.modalScrollContent}>
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Marke*</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Wähle eine Marke"
                  value={brand}
                  onChangeText={setBrand}
                />
              </View>
              
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Modell*</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Wähle ein Modell"
                  value={model}
                  onChangeText={setModel}
                />
              </View>
              
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Baujahr*</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Wähle ein Baujahr"
                  keyboardType="numeric"
                  value={year}
                  onChangeText={setYear}
                />
              </View>
              
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Kilometerstand*</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Gib den Kilometerstand ein"
                  keyboardType="numeric"
                  value={mileage}
                  onChangeText={setMileage}
                />
              </View>
              
              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Kraftstoffart*</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Wähle eine Kraftstoffart"
                  value={fuelType}
                  onChangeText={setFuelType}
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Getriebe</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Automatik oder Manuell"
                  value={transmission}
                  onChangeText={setTransmission}
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Leistung (PS)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="z.B. 150"
                  keyboardType="numeric"
                  value={power}
                  onChangeText={setPower}
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Farbe</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="z.B. Schwarz"
                  value={color}
                  onChangeText={setColor}
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Fahrzeugtyp</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="z.B. Limousine, SUV, Kombi"
                  value={bodyType}
                  onChangeText={setBodyType}
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Anzahl Türen</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="z.B. 5"
                  keyboardType="numeric"
                  value={doors}
                  onChangeText={setDoors}
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Anzahl Sitze</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="z.B. 5"
                  keyboardType="numeric"
                  value={seats}
                  onChangeText={setSeats}
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Hubraum (L)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="z.B. 2.0"
                  keyboardType="numeric"
                  value={engineSize}
                  onChangeText={setEngineSize}
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Preis (€)*</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Gib den Verkaufspreis ein"
                  keyboardType="numeric"
                  value={price}
                  onChangeText={setPrice}
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Standort*</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="z.B. Berlin"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Anbietertyp*</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Privat oder Händler"
                  value={sellerType}
                  onChangeText={setSellerType}
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Beschreibung</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Beschreibe dein Fahrzeug"
                  multiline
                  numberOfLines={4}
                  value={description}
                  onChangeText={setDescription}
                />
              </View>

              <View style={styles.formItem}>
                <Text style={styles.formLabel}>Ausstattungsmerkmale</Text>
                <View style={styles.featureInputContainer}>
                  <TextInput
                    style={styles.featureInput}
                    placeholder="z.B. Klimaanlage"
                    value={featureInput}
                    onChangeText={setFeatureInput}
                  />
                  <Pressable 
                    style={styles.addFeatureButton}
                    onPress={addFeature}
                  >
                    <Text style={styles.addFeatureButtonText}>+</Text>
                  </Pressable>
                </View>
                
                {features.length > 0 && (
                  <View style={styles.featuresList}>
                    {features.map((feature, index) => (
                      <View key={index} style={styles.featureTag}>
                        <Text style={styles.featureTagText}>{feature}</Text>
                        <Pressable 
                          style={styles.removeFeatureButton}
                          onPress={() => removeFeature(index)}
                        >
                          <X size={12} color={Colors.secondaryText} />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}
              </View>

              <Text style={styles.requiredFieldsNote}>* Pflichtfelder</Text>
            </ScrollView>
            
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowManualDataForm(false)}
              >
                <Text style={styles.modalButtonCancelText}>Abbrechen</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={() => setShowManualDataForm(false)}
              >
                <Text style={styles.modalButtonSaveText}>Speichern</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.secondaryText,
    marginBottom: 24,
  },
  photoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginBottom: 16,
  },
  imagePreviewContainer: {
    marginBottom: 16,
    gap: 12,
  },
  imagePreview: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageButtonText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: '700',
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    height: 100,
    backgroundColor: Colors.card,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  photoButtonText: {
    marginTop: 8,
    color: Colors.primary,
    fontWeight: '500',
  },
  formSection: {
    marginBottom: 24,
  },
  vinContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  vinInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  vinButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vinButtonDisabled: {
    backgroundColor: Colors.secondaryText,
  },
  vinHelp: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 16,
  },
  manualDataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  manualDataButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
  formItem: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  formInput: {
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  featureInputContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  featureInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  addFeatureButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addFeatureButtonText: {
    color: Colors.background,
    fontSize: 20,
    fontWeight: '600',
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  featureTagText: {
    fontSize: 14,
    color: Colors.text,
    marginRight: 4,
  },
  removeFeatureButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requiredFieldsNote: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginBottom: 16,
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
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    padding: 20,
  },
  flipButton: {
    alignSelf: 'flex-end',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  flipButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '600',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.background,
  },
  cancelButton: {
    alignSelf: 'flex-end',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  cancelButtonText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: '600',
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
    maxHeight: '90%',
  },
  modalScrollContent: {
    maxHeight: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
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
});