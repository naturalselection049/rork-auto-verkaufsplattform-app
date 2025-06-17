import { CarListing } from '@/types/car';

// This service would integrate with external APIs in a real implementation
// For demo purposes, we'll simulate fetching from different sources

export enum ListingSource {
  INTERNAL = 'internal',
  MOBILE_DE = 'mobile.de',
  KLEINANZEIGEN = 'kleinanzeigen.de'
}

export async function fetchListingsFromAllSources(): Promise<CarListing[]> {
  try {
    // In a real app, these would be actual API calls
    const [internalListings, mobileDeListings, kleinanzeigenListings] = await Promise.all([
      fetchInternalListings(),
      fetchMobileDeListings(),
      fetchKleinanzeigenListings()
    ]);
    
    return [...internalListings, ...mobileDeListings, ...kleinanzeigenListings];
  } catch (error) {
    console.error('Error fetching listings from all sources:', error);
    return [];
  }
}

async function fetchInternalListings(): Promise<CarListing[]> {
  // In a real app, this would fetch from your backend
  // For demo, we'll use the mock data but add source information
  const { carListings } = await import('@/mocks/cars');
  
  return carListings.map(car => ({
    ...car,
    source: ListingSource.INTERNAL
  }));
}

export async function fetchMobileDeListings(): Promise<CarListing[]> {
  // Mock data for mobile.de
  return [
    {
      id: 'mobile-1',
      title: 'Porsche 911 Carrera S',
      brand: 'Porsche',
      model: '911',
      year: 2021,
      price: 129900,
      mileage: 15000,
      fuelType: 'Benzin',
      transmission: 'Automatik',
      power: 450,
      description: 'Porsche 911 Carrera S in ausgezeichnetem Zustand. Sportabgasanlage, Sportchrono-Paket, LED-Matrix-Scheinwerfer.',
      location: 'Stuttgart',
      sellerType: 'Händler',
      sellerName: 'Premium Sports Cars GmbH',
      sellerPhone: '+49123456789',
      images: [
        'https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      features: ['Sport Chrono Paket', 'Sportabgasanlage', 'LED-Matrix', 'Sportsitze Plus', 'BOSE Soundsystem'],
      createdAt: '2023-06-10T08:30:00Z',
      updatedAt: '2023-06-10T08:30:00Z',
      source: ListingSource.MOBILE_DE
    },
    {
      id: 'mobile-2',
      title: 'Audi RS6 Avant',
      brand: 'Audi',
      model: 'RS6',
      year: 2022,
      price: 139800,
      mileage: 12000,
      fuelType: 'Benzin',
      transmission: 'Automatik',
      power: 600,
      description: 'Audi RS6 Avant mit umfangreicher Ausstattung. Carbon-Paket, Bang & Olufsen Sound, Panoramadach.',
      location: 'München',
      sellerType: 'Händler',
      sellerName: 'Audi Zentrum München',
      sellerPhone: '+49987654321',
      images: [
        'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1606220589611-4f29769271a0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      features: ['Carbon-Paket', 'Bang & Olufsen', 'Panoramadach', 'Dynamik-Paket plus', 'Head-up-Display'],
      createdAt: '2023-06-15T10:15:00Z',
      updatedAt: '2023-06-15T10:15:00Z',
      source: ListingSource.MOBILE_DE
    }
  ];
}

export async function fetchKleinanzeigenListings(): Promise<CarListing[]> {
  // Mock data for kleinanzeigen.de
  return [
    {
      id: 'kleinanzeigen-1',
      title: 'VW Golf 7 GTI Performance',
      brand: 'Volkswagen',
      model: 'Golf',
      year: 2019,
      price: 28500,
      mileage: 45000,
      fuelType: 'Benzin',
      transmission: 'Manuell',
      power: 245,
      description: 'VW Golf 7 GTI Performance mit 6-Gang-Schaltgetriebe. Scheckheftgepflegt, unfallfrei, Nichtraucherfahrzeug.',
      location: 'Hamburg',
      sellerType: 'Privat',
      sellerName: 'Michael Schmidt',
      sellerPhone: '+49123987456',
      images: [
        'https://images.unsplash.com/photo-1624551349356-9c1f1aaeb344?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1624551349356-9c1f1aaeb344?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      features: ['Navigationssystem', 'Sitzheizung', 'Einparkhilfe', 'Klimaautomatik', 'Bluetooth'],
      createdAt: '2023-06-20T14:45:00Z',
      updatedAt: '2023-06-20T14:45:00Z',
      source: ListingSource.KLEINANZEIGEN
    },
    {
      id: 'kleinanzeigen-2',
      title: 'BMW X3 xDrive20d',
      brand: 'BMW',
      model: 'X3',
      year: 2020,
      price: 42900,
      mileage: 35000,
      fuelType: 'Diesel',
      transmission: 'Automatik',
      power: 190,
      description: 'BMW X3 xDrive20d mit M-Sportpaket. Sehr gepflegter Zustand, alle Inspektionen bei BMW durchgeführt.',
      location: 'Berlin',
      sellerType: 'Privat',
      sellerName: 'Julia Weber',
      sellerPhone: '+49777888999',
      images: [
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      ],
      features: ['M-Sportpaket', 'Lederausstattung', 'Panoramadach', 'Navigationssystem Professional', 'Rückfahrkamera'],
      createdAt: '2023-06-25T09:30:00Z',
      updatedAt: '2023-06-25T09:30:00Z',
      source: ListingSource.KLEINANZEIGEN
    }
  ];
}