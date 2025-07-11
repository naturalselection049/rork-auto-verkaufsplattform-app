# Deployment Checklist für Produktionsumgebung

## ✅ Pre-Deployment Checklist

### 1. Code-Qualität
- [ ] Alle TypeScript-Fehler behoben
- [ ] ESLint-Warnungen behoben
- [ ] Unit Tests geschrieben und bestanden
- [ ] E2E Tests durchgeführt
- [ ] Code Review abgeschlossen
- [ ] Performance-Tests durchgeführt

### 2. Sicherheit
- [ ] API-Endpunkte authentifiziert
- [ ] Input-Validierung implementiert
- [ ] HTTPS für alle API-Calls
- [ ] Sensitive Daten verschlüsselt
- [ ] Security Headers konfiguriert
- [ ] Penetration Testing durchgeführt

### 3. Backend-Setup
- [ ] Produktions-Datenbank konfiguriert
- [ ] API-Server deployed
- [ ] Load Balancer konfiguriert
- [ ] CDN für Bilder eingerichtet
- [ ] Backup-Strategie implementiert
- [ ] Monitoring eingerichtet

### 4. Mobile App
- [ ] App Icons erstellt (alle Größen)
- [ ] Splash Screens erstellt
- [ ] App Store Screenshots erstellt
- [ ] App Store Beschreibungen geschrieben
- [ ] Privacy Policy erstellt
- [ ] Terms of Service erstellt

## 🚀 Deployment Steps

### Phase 1: Backend Deployment

#### 1.1 Datenbank Setup
```sql
-- PostgreSQL Produktions-Setup
CREATE DATABASE auto_plattform_prod;
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE auto_plattform_prod TO app_user;

-- Indizes für Performance
CREATE INDEX CONCURRENTLY idx_car_listings_search ON car_listings USING GIN(to_tsvector('german', title || ' ' || description));
CREATE INDEX CONCURRENTLY idx_car_listings_location ON car_listings(location);
CREATE INDEX CONCURRENTLY idx_car_listings_price_year ON car_listings(price, year);
```

#### 1.2 API Server Deployment
```bash
# Docker Deployment
docker build -t auto-plattform-api .
docker run -d \
  --name auto-plattform-api \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://app_user:secure_password@localhost:5432/auto_plattform_prod" \
  -e JWT_SECRET="your-jwt-secret" \
  -e REDIS_URL="redis://localhost:6379" \
  auto-plattform-api

# Kubernetes Deployment
kubectl apply -f k8s/
```

#### 1.3 External Services Setup
```bash
# Elasticsearch für Suche
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -e "discovery.type=single-node" \
  elasticsearch:8.8.0

# Redis für Caching
docker run -d \
  --name redis \
  -p 6379:6379 \
  redis:alpine

# Nginx Load Balancer
docker run -d \
  --name nginx \
  -p 80:80 \
  -p 443:443 \
  -v ./nginx.conf:/etc/nginx/nginx.conf \
  nginx:alpine
```

### Phase 2: Mobile App Deployment

#### 2.1 iOS App Store
```bash
# EAS Build für iOS
eas build --platform ios --profile production

# App Store Connect Upload
eas submit --platform ios --profile production

# TestFlight Beta Testing
eas build --platform ios --profile preview
```

#### 2.2 Google Play Store
```bash
# EAS Build für Android
eas build --platform android --profile production

# Play Console Upload
eas submit --platform android --profile production

# Internal Testing
eas build --platform android --profile preview
```

#### 2.3 Web Deployment
```bash
# Web Build
bun expo export --platform web

# Deploy zu Vercel/Netlify
vercel --prod
# oder
netlify deploy --prod --dir dist
```

### Phase 3: Monitoring & Analytics

#### 3.1 Error Tracking
```javascript
// Sentry Setup
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
});
```

#### 3.2 Analytics
```javascript
// Firebase Analytics
import analytics from '@react-native-firebase/analytics';

await analytics().logEvent('app_open');
await analytics().logEvent('car_view', {
  car_id: carId,
  car_brand: carBrand,
});
```

#### 3.3 Performance Monitoring
```javascript
// New Relic Setup
import NewRelic from 'newrelic-react-native-agent';

NewRelic.startAgent('YOUR_APP_TOKEN');
NewRelic.setUserId(userId);
```

## 🔧 Configuration Management

### Environment Variables
```bash
# Production .env
NODE_ENV=production
API_BASE_URL=https://api.auto-plattform.de
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=your-super-secure-jwt-secret
SENTRY_DSN=https://your-sentry-dsn
CLOUDINARY_CLOUD_NAME=your-cloud-name
MOBILE_DE_API_KEY=your-mobile-de-key
KLEINANZEIGEN_API_KEY=your-kleinanzeigen-key
```

### App Configuration
```json
{
  "expo": {
    "name": "Auto-Plattform",
    "slug": "auto-plattform",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.autoplattform.app",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.autoplattform.app",
      "versionCode": 1
    },
    "web": {
      "favicon": "./assets/images/favicon.png",
      "bundler": "metro"
    },
    "plugins": [
      "expo-router",
      "@sentry/react-native/expo"
    ],
    "extra": {
      "router": {
        "origin": false
      },
      "eas": {
        "projectId": "your-eas-project-id"
      }
    }
  }
}
```

## 📊 Performance Optimization

### 1. Bundle Size Optimization
```bash
# Analyze Bundle
bun expo export --dump-assetmap

# Remove unused dependencies
bun remove unused-package

# Enable Hermes (Android)
# In app.json
"android": {
  "jsEngine": "hermes"
}
```

### 2. Image Optimization
```javascript
// Optimized Image Component
import { Image } from 'expo-image';

<Image
  source={{ uri: imageUrl }}
  style={styles.image}
  contentFit="cover"
  transition={200}
  cachePolicy="memory-disk"
/>
```

### 3. List Performance
```javascript
// Optimized FlatList
<FlatList
  data={listings}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

## 🔒 Security Hardening

### 1. API Security
```javascript
// Rate Limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 2. Data Encryption
```javascript
// Encrypt sensitive data
const crypto = require('crypto');

const encrypt = (text) => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};
```

### 3. Input Validation
```javascript
// Joi validation
const Joi = require('joi');

const carSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  price: Joi.number().positive().required(),
  year: Joi.number().min(1900).max(new Date().getFullYear()).required(),
  mileage: Joi.number().min(0).required(),
});
```

## 📈 Scaling Strategy

### 1. Database Scaling
```sql
-- Read Replicas
CREATE PUBLICATION car_listings_pub FOR TABLE car_listings;

-- Partitioning
CREATE TABLE car_listings_2024 PARTITION OF car_listings
FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### 2. Caching Strategy
```javascript
// Redis Caching
const redis = require('redis');
const client = redis.createClient();

const getCachedListings = async (key) => {
  const cached = await client.get(key);
  return cached ? JSON.parse(cached) : null;
};

const setCachedListings = async (key, data, ttl = 300) => {
  await client.setex(key, ttl, JSON.stringify(data));
};
```

### 3. CDN Configuration
```javascript
// Cloudflare Workers
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const cache = caches.default;
  const cacheKey = new Request(request.url, request);
  
  let response = await cache.match(cacheKey);
  
  if (!response) {
    response = await fetch(request);
    event.waitUntil(cache.put(cacheKey, response.clone()));
  }
  
  return response;
}
```

## 🚨 Incident Response

### 1. Monitoring Alerts
```yaml
# Prometheus Alerts
groups:
- name: auto-plattform
  rules:
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
    for: 5m
    annotations:
      summary: High error rate detected
      
  - alert: DatabaseConnectionFailed
    expr: up{job="postgresql"} == 0
    for: 1m
    annotations:
      summary: Database connection failed
```

### 2. Rollback Strategy
```bash
# Kubernetes Rollback
kubectl rollout undo deployment/auto-plattform-api

# EAS Rollback
eas update --branch production --message "Rollback to previous version"
```

### 3. Emergency Contacts
- **DevOps Team**: devops@auto-plattform.de
- **Backend Team**: backend@auto-plattform.de
- **Mobile Team**: mobile@auto-plattform.de
- **On-Call**: +49-xxx-xxx-xxxx

## ✅ Post-Deployment Verification

### 1. Health Checks
```bash
# API Health Check
curl -f https://api.auto-plattform.de/health || exit 1

# Database Health Check
psql -h localhost -U app_user -d auto_plattform_prod -c "SELECT 1;"

# Redis Health Check
redis-cli ping
```

### 2. Smoke Tests
```javascript
// Automated Smoke Tests
describe('Production Smoke Tests', () => {
  test('API responds to health check', async () => {
    const response = await fetch('https://api.auto-plattform.de/health');
    expect(response.status).toBe(200);
  });
  
  test('Can fetch car listings', async () => {
    const response = await fetch('https://api.auto-plattform.de/api/listings');
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.listings).toBeDefined();
  });
});
```

### 3. Performance Verification
```bash
# Load Testing mit Artillery
artillery run load-test.yml

# Lighthouse Performance Audit
lighthouse https://auto-plattform.de --output=json --output-path=./lighthouse-report.json
```

## 📋 Maintenance Schedule

### Daily
- [ ] Check error rates in Sentry
- [ ] Monitor API response times
- [ ] Verify backup completion
- [ ] Check disk space usage

### Weekly
- [ ] Review performance metrics
- [ ] Update dependencies
- [ ] Security scan
- [ ] Database maintenance

### Monthly
- [ ] Capacity planning review
- [ ] Security audit
- [ ] Disaster recovery test
- [ ] Performance optimization review

Diese Checkliste stellt sicher, dass die App produktionsreif deployed wird und alle wichtigen Aspekte berücksichtigt werden.