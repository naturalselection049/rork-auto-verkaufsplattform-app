import { User } from '@/types/forum';
import { SellerProfile } from '@/types/car';

export const mockUsers: User[] = [
  {
    id: 'user1',
    username: 'FahranfängerMax',
    name: 'Max Müller',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user2',
    username: 'AutoExperte',
    name: 'Thomas Schmidt',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user3',
    username: 'MechanikMeister',
    name: 'Klaus Wagner',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user5',
    username: 'StromFahrer',
    name: 'Lisa Becker',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user6',
    username: 'TeslaFan',
    name: 'Markus Klein',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user9',
    username: 'SchrauberPro',
    name: 'Stefan Huber',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user11',
    username: 'KlassikerFan',
    name: 'Michael Weber',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user12',
    username: 'OldtimerSammler',
    name: 'Jürgen Fischer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user16',
    username: 'TuningFreak',
    name: 'Daniel Schneider',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'user17',
    username: 'GTIFahrer',
    name: 'Tobias Wolf',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
  },
];

export const mockSellerProfiles: SellerProfile[] = [
  {
    id: 'seller1',
    name: 'Premium Sports Cars GmbH',
    type: 'Händler',
    avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    address: {
      street: 'Stuttgarter Str. 123',
      city: 'Stuttgart',
      postalCode: '70174',
      country: 'Deutschland'
    },
    phone: '+49123456789',
    email: 'info@premiumsportscars.de',
    description: 'Spezialisiert auf Premium-Sportwagen und Luxusfahrzeuge. Über 20 Jahre Erfahrung im Automobilhandel.',
    rating: {
      average: 4.8,
      count: 127
    },
    reviews: [
      {
        id: 'review1',
        reviewerId: 'user1',
        reviewerName: 'Max Müller',
        reviewerAvatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
        rating: 5,
        comment: 'Sehr professioneller Händler. Fahrzeug war genau wie beschrieben. Kaufabwicklung reibungslos.',
        createdAt: '2024-01-15T10:30:00Z',
        carId: '1',
        carTitle: 'BMW M3 Competition'
      },
      {
        id: 'review2',
        reviewerId: 'user2',
        reviewerName: 'Thomas Schmidt',
        reviewerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
        rating: 4,
        comment: 'Gute Beratung, faire Preise. Kleine Verzögerung bei der Übergabe, aber sonst alles top.',
        createdAt: '2024-01-10T14:20:00Z'
      }
    ],
    memberSince: '2019-03-15T00:00:00Z',
    responseTime: 'Innerhalb von 2 Stunden',
    activeListings: 23,
    totalSold: 156,
    verified: true
  },
  {
    id: 'seller2',
    name: 'Michael Schmidt',
    type: 'Privat',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    address: {
      street: 'Hamburger Allee 45',
      city: 'Hamburg',
      postalCode: '20146',
      country: 'Deutschland'
    },
    phone: '+49123987456',
    description: 'Verkaufe gelegentlich meine gut gepflegten Fahrzeuge. Alle Autos sind scheckheftgepflegt.',
    rating: {
      average: 4.6,
      count: 8
    },
    reviews: [
      {
        id: 'review3',
        reviewerId: 'user3',
        reviewerName: 'Klaus Wagner',
        reviewerAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
        rating: 5,
        comment: 'Sehr ehrlicher Verkäufer. Auto war in perfektem Zustand, alle Unterlagen vollständig.',
        createdAt: '2024-01-08T16:45:00Z'
      }
    ],
    memberSince: '2021-07-22T00:00:00Z',
    responseTime: 'Innerhalb von 1 Tag',
    activeListings: 1,
    totalSold: 3,
    verified: false
  },
  {
    id: 'seller3',
    name: 'AutoHaus München GmbH',
    type: 'Händler',
    avatar: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
    address: {
      street: 'Maximilianstr. 67',
      city: 'München',
      postalCode: '80539',
      country: 'Deutschland'
    },
    phone: '+498912345678',
    email: 'verkauf@autohaus-muenchen.de',
    description: 'Traditionelles Autohaus mit großer Auswahl an Gebrauchtwagen aller Marken.',
    rating: {
      average: 4.3,
      count: 89
    },
    reviews: [
      {
        id: 'review4',
        reviewerId: 'user5',
        reviewerName: 'Lisa Becker',
        reviewerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80',
        rating: 4,
        comment: 'Solide Beratung, faire Preise. Würde wieder dort kaufen.',
        createdAt: '2024-01-05T11:15:00Z'
      }
    ],
    memberSince: '2018-11-10T00:00:00Z',
    responseTime: 'Innerhalb von 4 Stunden',
    activeListings: 45,
    totalSold: 234,
    verified: true
  }
];