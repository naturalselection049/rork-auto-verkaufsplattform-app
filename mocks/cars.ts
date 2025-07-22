import { CarListing } from '@/types/car';

export const carListings: CarListing[] = [
  {
    id: '1',
    title: 'BMW 3er 320d M Sport',
    brand: 'BMW',
    model: '3er',
    year: 2020,
    price: 32900,
    mileage: 45000,
    fuelType: 'Diesel',
    transmission: 'Automatik',
    power: 190,
    description: 'Sehr gepflegter BMW 320d M Sport mit umfangreicher Ausstattung. Scheckheftgepflegt, unfallfrei, aus erster Hand.',
    location: 'München',
    sellerType: 'Händler',
    sellerName: 'Premium Automobile GmbH',
    sellerPhone: '+49123456789',
    sellerId: 'seller1',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['Navigationssystem', 'Lederausstattung', 'Sitzheizung', 'LED-Scheinwerfer', 'Parksensoren'],
    createdAt: '2023-05-15T10:30:00Z',
    updatedAt: '2023-05-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Mercedes-Benz C-Klasse C200 AMG Line',
    brand: 'Mercedes-Benz',
    model: 'C-Klasse',
    year: 2021,
    price: 39800,
    mileage: 28000,
    fuelType: 'Benzin',
    transmission: 'Automatik',
    power: 184,
    description: 'Mercedes-Benz C200 AMG Line in hervorragendem Zustand. Garantie bis 2024, alle Serviceleistungen durchgeführt.',
    location: 'Hamburg',
    sellerType: 'Händler',
    sellerName: 'Stern Automobile',
    sellerPhone: '+49987654321',
    sellerId: 'seller3',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617814076668-8dfc6fe159ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['MBUX Multimedia', 'AMG Styling', 'Panoramadach', 'Ambientebeleuchtung', 'Rückfahrkamera'],
    createdAt: '2023-05-10T14:20:00Z',
    updatedAt: '2023-05-10T14:20:00Z'
  },
  {
    id: '3',
    title: 'VW Golf 8 GTI',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2022,
    price: 42500,
    mileage: 15000,
    fuelType: 'Benzin',
    transmission: 'Manuell',
    power: 245,
    description: 'Sportlicher VW Golf 8 GTI mit 6-Gang-Schaltgetriebe. Top-Ausstattung, Erstbesitz, Nichtraucher.',
    location: 'Berlin',
    sellerType: 'Privat',
    sellerName: 'Thomas Müller',
    sellerPhone: '+49123987456',
    sellerId: 'seller2',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['Digitales Cockpit', 'Harman/Kardon Soundsystem', 'Adaptives Fahrwerk', 'Sportfahrwerk', 'Apple CarPlay'],
    createdAt: '2023-05-05T09:15:00Z',
    updatedAt: '2023-05-05T09:15:00Z'
  },
  {
    id: '4',
    title: 'Audi A4 Avant 40 TDI quattro',
    brand: 'Audi',
    model: 'A4',
    year: 2019,
    price: 29900,
    mileage: 62000,
    fuelType: 'Diesel',
    transmission: 'Automatik',
    power: 204,
    description: 'Gepflegter Audi A4 Avant mit Allradantrieb und S-Line Ausstattung. Serviceheft lückenlos, neue Bremsen.',
    location: 'Köln',
    sellerType: 'Händler',
    sellerName: 'Auto Zentrum Köln',
    sellerPhone: '+49555123789',
    sellerId: 'seller3',
    images: [
      'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['MMI Navigation plus', 'Quattro Allrad', 'S-Line Paket', 'Matrix LED', 'Virtual Cockpit'],
    createdAt: '2023-04-28T16:45:00Z',
    updatedAt: '2023-04-28T16:45:00Z'
  },
  {
    id: '5',
    title: 'Tesla Model 3 Long Range',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2021,
    price: 48900,
    mileage: 25000,
    fuelType: 'Elektro',
    transmission: 'Automatik',
    power: 351,
    description: 'Tesla Model 3 Long Range mit Allradantrieb. Reichweite ca. 560km, Autopilot, Premium-Innenausstattung.',
    location: 'Frankfurt',
    sellerType: 'Privat',
    sellerName: 'Lisa Schmidt',
    sellerPhone: '+49777888999',
    sellerId: 'seller2',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551952238-2315a31e1f29?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['Autopilot', 'Premium-Innenausstattung', 'Glasdach', '19" Felgen', 'Schnellladen'],
    createdAt: '2023-04-20T11:30:00Z',
    updatedAt: '2023-04-20T11:30:00Z'
  }
];

export const carBrands = [
  'Audi', 'BMW', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Mazda', 'Mercedes-Benz', 
  'Opel', 'Porsche', 'Renault', 'Seat', 'Skoda', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
];

export const fuelTypes = ['Benzin', 'Diesel', 'Elektro', 'Hybrid', 'LPG', 'Andere'];

export const transmissionTypes = ['Manuell', 'Automatik'];

export const sellerTypes = ['Privat', 'Händler'];