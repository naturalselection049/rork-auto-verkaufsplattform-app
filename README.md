# Auto-Plattform - React Native App

Eine vollständige Auto-Handelsplattform mit React Native und Expo, die es Benutzern ermöglicht, Fahrzeuge zu kaufen, verkaufen und zu vergleichen.

## 🚀 Features

### Kernfunktionen
- **Fahrzeug-Suche & Filter**: Erweiterte Suchfunktionen mit vielen Filteroptionen
- **Fahrzeug-Anzeigen**: Detaillierte Fahrzeugprofile mit Bildern und Spezifikationen
- **VIN-Lookup**: Automatische Fahrzeugdaten-Erkennung über VIN-Nummer
- **Favoriten**: Fahrzeuge als Favoriten markieren und verwalten
- **Vergleich**: Bis zu 3 Fahrzeuge direkt miteinander vergleichen
- **Forum**: Community-Forum für Diskussionen und Beratung
- **Nachrichten**: Direktnachrichten zwischen Käufern und Verkäufern

### Benutzer-Features
- **Authentifizierung**: Sichere Anmeldung und Registrierung
- **Profil-Management**: Vollständige Profilverwaltung
- **Eigene Anzeigen**: Fahrzeuge inserieren und verwalten
- **Gespeicherte Suchen**: Suchfilter speichern und wiederverwenden
- **Push-Benachrichtigungen**: Benachrichtigungen für neue Nachrichten und Angebote

### Technische Features
- **Offline-Support**: Grundfunktionen auch ohne Internet
- **Responsive Design**: Optimiert für alle Bildschirmgrößen
- **Performance**: Optimierte Bildladung und Caching
- **Sicherheit**: Sichere Datenübertragung und -speicherung

## 📱 Screenshots

[Screenshots würden hier eingefügt werden]

## 🛠 Installation

### Voraussetzungen
- Node.js (v18 oder höher)
- Bun (empfohlen) oder npm
- Expo CLI
- iOS Simulator (für iOS-Entwicklung)
- Android Studio (für Android-Entwicklung)

### Setup

1. **Repository klonen**
   ```bash
   git clone <repository-url>
   cd auto-plattform
   ```

2. **Dependencies installieren**
   ```bash
   bun install
   # oder
   npm install
   ```

3. **Expo-Projekt starten**
   ```bash
   bun expo start
   # oder
   npx expo start
   ```

4. **App auf Gerät/Simulator öffnen**
   - Für iOS: Drücke `i` im Terminal oder scanne QR-Code mit Expo Go
   - Für Android: Drücke `a` im Terminal oder scanne QR-Code mit Expo Go
   - Für Web: Drücke `w` im Terminal

## 🏗 Architektur

### Technologie-Stack
- **Frontend**: React Native mit Expo
- **State Management**: Zustand für App-State, React Query für Server-State
- **Navigation**: Expo Router (File-based Routing)
- **Styling**: React Native StyleSheet
- **Icons**: Lucide React Native
- **Bilder**: Expo Image mit Caching
- **Storage**: AsyncStorage für lokale Daten

### Ordnerstruktur
```
├── app/                    # Expo Router Seiten
│   ├── (tabs)/            # Tab-Navigation
│   ├── auth/              # Authentifizierung
│   ├── car/               # Fahrzeug-Details
│   └── ...
├── components/            # Wiederverwendbare Komponenten
├── constants/             # App-Konstanten
├── mocks/                 # Mock-Daten für Entwicklung
├── services/              # API-Services
├── store/                 # Zustand State Management
├── types/                 # TypeScript-Typen
└── docs/                  # Dokumentation
```

### State Management
- **Zustand**: Für UI-State, Benutzereinstellungen, Filter
- **React Query**: Für Server-Daten, Caching, Synchronisation
- **AsyncStorage**: Für persistente Daten (Auth-Token, Einstellungen)

## 🔧 Konfiguration

### Umgebungsvariablen
Erstelle eine `.env` Datei im Root-Verzeichnis:

```env
# API Configuration
API_BASE_URL=https://your-api.com/api
API_KEY=your-api-key

# External Services
MOBILE_DE_API_KEY=your-mobile-de-key
KLEINANZEIGEN_API_KEY=your-kleinanzeigen-key

# Image Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Analytics
SENTRY_DSN=your-sentry-dsn
```

### App-Konfiguration
Die App-Konfiguration befindet sich in `app.json`:

```json
{
  "expo": {
    "name": "Auto-Plattform",
    "slug": "auto-plattform",
    "version": "1.0.0",
    "platforms": ["ios", "android", "web"],
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    }
  }
}
```

## 🚀 Deployment

### Entwicklung
```bash
# Entwicklungsserver starten
bun expo start

# iOS Simulator
bun expo start --ios

# Android Emulator
bun expo start --android

# Web Browser
bun expo start --web
```

### Produktion

#### EAS Build (Empfohlen)
```bash
# EAS CLI installieren
npm install -g @expo/eas-cli

# EAS-Projekt initialisieren
eas build:configure

# Build für iOS
eas build --platform ios

# Build für Android
eas build --platform android

# App Store Deployment
eas submit --platform ios

# Google Play Store Deployment
eas submit --platform android
```

#### Lokaler Build
```bash
# iOS Build
bun expo run:ios --configuration Release

# Android Build
bun expo run:android --variant release
```

## 🔌 Backend-Integration

Die App ist darauf vorbereitet, mit einem Backend-API zu arbeiten. Siehe `docs/production-strategy.md` für eine vollständige Backend-Implementierung.

### API-Endpunkte
- `POST /api/auth/login` - Benutzer-Anmeldung
- `POST /api/auth/register` - Benutzer-Registrierung
- `GET /api/listings` - Fahrzeug-Anzeigen abrufen
- `POST /api/listings` - Neue Anzeige erstellen
- `GET /api/listings/:id` - Einzelne Anzeige abrufen
- `POST /api/vin/lookup` - VIN-Nummer nachschlagen
- `GET /api/favorites` - Favoriten abrufen
- `POST /api/favorites` - Favorit hinzufügen

### Mock-Daten
Für die Entwicklung werden Mock-Daten verwendet:
- `mocks/cars.ts` - Fahrzeug-Anzeigen
- `mocks/users.ts` - Benutzer-Daten
- `mocks/forum.ts` - Forum-Beiträge

## 🧪 Testing

```bash
# Unit Tests
bun test

# E2E Tests mit Detox
bun detox test

# Type Checking
bun tsc --noEmit
```

## 📊 Performance

### Optimierungen
- **Bilder**: Lazy Loading und Caching mit Expo Image
- **Listen**: FlatList mit getItemLayout für große Listen
- **Navigation**: Lazy Loading von Screens
- **Bundle**: Code Splitting und Tree Shaking

### Monitoring
- **Sentry**: Error Tracking und Performance Monitoring
- **Analytics**: Benutzerverhalten und App-Nutzung
- **Crashlytics**: Crash-Berichte und Stabilität

## 🔒 Sicherheit

### Implementierte Sicherheitsmaßnahmen
- **JWT-Authentifizierung**: Sichere Token-basierte Authentifizierung
- **HTTPS**: Verschlüsselte Datenübertragung
- **Input-Validierung**: Validierung aller Benutzereingaben
- **Secure Storage**: Sichere Speicherung sensibler Daten

### DSGVO-Compliance
- **Datenschutzerklärung**: Vollständige Datenschutzerklärung
- **Cookie-Banner**: Einwilligungsmanagement
- **Datenportabilität**: Export von Benutzerdaten
- **Löschrecht**: Vollständige Datenlöschung

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/amazing-feature`)
3. Committe deine Änderungen (`git commit -m 'Add amazing feature'`)
4. Push zum Branch (`git push origin feature/amazing-feature`)
5. Öffne einen Pull Request

### Code-Standards
- **TypeScript**: Vollständige Typisierung
- **ESLint**: Code-Qualität und Konsistenz
- **Prettier**: Code-Formatierung
- **Conventional Commits**: Standardisierte Commit-Messages

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Siehe `LICENSE` Datei für Details.

## 📞 Support

- **E-Mail**: support@auto-plattform.de
- **GitHub Issues**: [Issues](https://github.com/your-repo/issues)
- **Dokumentation**: [Wiki](https://github.com/your-repo/wiki)

## 🗺 Roadmap

### Version 1.1
- [ ] Push-Benachrichtigungen
- [ ] Offline-Synchronisation
- [ ] Erweiterte Suchfilter
- [ ] Kartenansicht

### Version 1.2
- [ ] Mobile.de Integration
- [ ] Kleinanzeigen.de Integration
- [ ] KI-basierte Preisempfehlungen
- [ ] Augmented Reality Fahrzeug-Viewer

### Version 2.0
- [ ] Händler-Portal
- [ ] Finanzierungsrechner
- [ ] Versicherungsvergleich
- [ ] Blockchain-basierte Fahrzeughistorie

## 🙏 Danksagungen

- **Expo Team**: Für das großartige Framework
- **React Native Community**: Für die vielen hilfreichen Packages
- **Lucide Icons**: Für die schönen Icons
- **Alle Contributors**: Für ihre Beiträge zum Projekt