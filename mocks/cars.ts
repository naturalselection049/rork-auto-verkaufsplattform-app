import { CarListing } from '@/types/car';

export const carListings: CarListing[] = [
  {
    id: '1',
    title: 'BMW 320d xDrive M Sport Touring',
    brand: 'BMW',
    model: '3er',
    year: 2022,
    price: 47900,
    mileage: 18500,
    fuelType: 'Diesel',
    transmission: 'Automatik',
    power: 190,
    description: 'BMW 320d xDrive M Sport Touring in Mineralgrau metallic. Vollausstattung mit M Sportpaket, Harman Kardon Soundsystem, Panoramadach und Head-Up Display. Scheckheftgepflegt, unfallfrei, Nichtraucherfahrzeug. Garantie bis 03/2025.',
    location: 'München',
    sellerType: 'Händler',
    sellerName: 'BMW Autohaus Müller GmbH',
    sellerPhone: '+49 89 123456789',
    sellerId: 'seller1',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['M Sportpaket', 'xDrive Allrad', 'Harman Kardon Sound', 'Panoramadach', 'Head-Up Display', 'LED-Scheinwerfer', 'Navigationssystem Professional', 'Sitzheizung', 'Lederausstattung Dakota', 'Parksensoren vorn/hinten'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Mercedes-Benz C 220 d AMG Line 4MATIC',
    brand: 'Mercedes-Benz',
    model: 'C-Klasse',
    year: 2023,
    price: 52800,
    mileage: 12000,
    fuelType: 'Diesel',
    transmission: 'Automatik',
    power: 200,
    description: 'Mercedes-Benz C 220 d AMG Line 4MATIC in Obsidianschwarz metallic. Neuestes MBUX System, Multibeam LED, Burmester Surround Sound. Fahrzeug ist wie neu, alle Services bei Mercedes durchgeführt. Garantie bis 2026.',
    location: 'Hamburg',
    sellerType: 'Händler',
    sellerName: 'Mercedes-Benz Zentrum Hamburg',
    sellerPhone: '+49 40 987654321',
    sellerId: 'seller3',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617814076668-8dfc6fe159ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['AMG Line Exterieur', '4MATIC Allrad', 'MBUX Multimedia', 'Multibeam LED', 'Burmester Surround Sound', 'Panorama-Schiebedach', 'Ambientebeleuchtung', 'Rückfahrkamera', 'Totwinkel-Assistent', 'Aktiver Park-Assistent'],
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z'
  },
  {
    id: '3',
    title: 'Volkswagen Golf 8 GTI Performance',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2023,
    price: 44900,
    mileage: 8500,
    fuelType: 'Benzin',
    transmission: 'Manuell',
    power: 265,
    description: 'VW Golf 8 GTI Performance in Tornado Rot. 6-Gang Schaltgetriebe, DCC Fahrwerk, Akrapovic Sportauspuff ab Werk. Fahrzeug ist in Top-Zustand, Erstbesitz, alle Wartungen bei VW. Performance Paket mit 265 PS.',
    location: 'Berlin',
    sellerType: 'Privat',
    sellerName: 'Thomas Müller',
    sellerPhone: '+49 30 123987456',
    sellerId: 'seller2',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['Performance Paket', 'DCC Fahrwerk', 'Akrapovic Sportauspuff', 'Digital Cockpit Pro', 'Harman/Kardon Soundsystem', 'IQ.LIGHT Matrix LED', 'Keyless Access', 'Climatronic 3-Zonen', 'App-Connect', 'Rückfahrkamera'],
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z'
  },
  {
    id: '4',
    title: 'Audi A4 Avant 45 TFSI quattro S line',
    brand: 'Audi',
    model: 'A4',
    year: 2022,
    price: 49900,
    mileage: 22000,
    fuelType: 'Benzin',
    transmission: 'Automatik',
    power: 265,
    description: 'Audi A4 Avant 45 TFSI quattro S line in Navarrablau metallic. Mild-Hybrid System, S tronic Getriebe, Virtual Cockpit plus. Fahrzeug ist gepflegt und technisch einwandfrei. Alle Services bei Audi durchgeführt.',
    location: 'Köln',
    sellerType: 'Händler',
    sellerName: 'Audi Zentrum Köln',
    sellerPhone: '+49 221 555123789',
    sellerId: 'seller4',
    images: [
      'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['S line Exterieur', 'quattro Allrad', 'S tronic 7-Gang', 'Virtual Cockpit plus', 'MMI Navigation plus', 'Matrix LED Scheinwerfer', 'Bang & Olufsen Sound', 'Panorama-Glasdach', 'Assistenzpaket Tour', 'Komfortsitze vorn'],
    createdAt: '2023-12-28T16:45:00Z',
    updatedAt: '2023-12-28T16:45:00Z'
  },
  {
    id: '5',
    title: 'Tesla Model 3 Performance',
    brand: 'Tesla',
    model: 'Model 3',
    year: 2023,
    price: 59900,
    mileage: 15000,
    fuelType: 'Elektro',
    transmission: 'Automatik',
    power: 513,
    description: 'Tesla Model 3 Performance in Perlweiß Multi-Coat. Allradantrieb, 0-100 km/h in 3,3s, Reichweite bis 547 km. Enhanced Autopilot, Premium Connectivity, 20" Überturbine Felgen. Fahrzeug ist unfallfrei und technisch perfekt.',
    location: 'Frankfurt am Main',
    sellerType: 'Privat',
    sellerName: 'Lisa Schmidt',
    sellerPhone: '+49 69 777888999',
    sellerId: 'seller5',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551952238-2315a31e1f29?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['Performance Upgrade', 'Enhanced Autopilot', 'Premium Connectivity', '20" Überturbine Felgen', 'Glasdach', 'Premium Audio', 'Supercharging', 'Over-the-Air Updates', 'Sentry Mode', 'Mobile Connector'],
    createdAt: '2023-12-20T11:30:00Z',
    updatedAt: '2023-12-20T11:30:00Z'
  },
  {
    id: '6',
    title: 'Porsche 911 Carrera S Cabriolet',
    brand: 'Porsche',
    model: '911',
    year: 2021,
    price: 139900,
    mileage: 12500,
    fuelType: 'Benzin',
    transmission: 'Automatik',
    power: 450,
    description: 'Porsche 911 Carrera S Cabriolet in Carrara Weiß metallic. PDK Getriebe, Sport Chrono Paket, BOSE Surround Sound. Fahrzeug ist in Sammlerqualität, alle Services bei Porsche. Soft-Top Verdeck, 20/21" Carrera S Räder.',
    location: 'Stuttgart',
    sellerType: 'Händler',
    sellerName: 'Porsche Zentrum Stuttgart',
    sellerPhone: '+49 711 456789123',
    sellerId: 'seller6',
    images: [
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['PDK 8-Gang Doppelkupplung', 'Sport Chrono Paket', 'BOSE Surround Sound', '20/21" Carrera S Räder', 'Soft-Top Verdeck', 'Porsche Communication Management', 'LED Matrix Hauptscheinwerfer', 'Sportabgasanlage', 'Porsche Active Suspension Management', 'Leder Vollausstattung'],
    createdAt: '2023-12-15T13:20:00Z',
    updatedAt: '2023-12-15T13:20:00Z'
  },
  {
    id: '7',
    title: 'Ford Mustang Mach-E GT',
    brand: 'Ford',
    model: 'Mustang Mach-E',
    year: 2022,
    price: 67900,
    mileage: 8900,
    fuelType: 'Elektro',
    transmission: 'Automatik',
    power: 487,
    description: 'Ford Mustang Mach-E GT in Grabber Blue metallic. Allradantrieb, 0-100 km/h in 3,7s, Reichweite bis 490 km. MagneRide Dämpfer, B&O Sound System, 20" Brembo Bremsen. Fahrzeug ist neuwertig und vollständig.',
    location: 'Düsseldorf',
    sellerType: 'Händler',
    sellerName: 'Ford Autohaus Rhein',
    sellerPhone: '+49 211 333444555',
    sellerId: 'seller7',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551952238-2315a31e1f29?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['GT Performance Paket', 'MagneRide Dämpfer', 'B&O Sound System', '20" Brembo Bremsen', 'Panorama Glasdach', 'SYNC 4A Infotainment', 'Ford Co-Pilot360', 'Wireless Charging Pad', 'Hands-Free Liftgate', 'Ambient Lighting'],
    createdAt: '2023-12-10T15:45:00Z',
    updatedAt: '2023-12-10T15:45:00Z'
  },
  {
    id: '8',
    title: 'Toyota GR Supra 3.0',
    brand: 'Toyota',
    model: 'Supra',
    year: 2023,
    price: 72900,
    mileage: 3500,
    fuelType: 'Benzin',
    transmission: 'Automatik',
    power: 387,
    description: 'Toyota GR Supra 3.0 in Storm Gray metallic. 8-Gang Automatik, adaptives Fahrwerk, JBL Premium Audio. Fahrzeug ist praktisch neu, alle Optionen ab Werk. Limitierte A91-CF Edition mit Carbon-Elementen.',
    location: 'Nürnberg',
    sellerType: 'Privat',
    sellerName: 'Michael Weber',
    sellerPhone: '+49 911 666777888',
    sellerId: 'seller8',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['A91-CF Edition', '8-Gang Automatik', 'Adaptives Fahrwerk', 'JBL Premium Audio', 'Carbon Fiber Elemente', 'Launch Control', 'Track Mode', 'Brembo Bremsen', 'Michelin Pilot Sport 4S', 'Alcantara Innenausstattung'],
    createdAt: '2023-12-05T10:15:00Z',
    updatedAt: '2023-12-05T10:15:00Z'
  },
  {
    id: '9',
    title: 'Hyundai IONIQ 5 Lounge AWD',
    brand: 'Hyundai',
    model: 'IONIQ 5',
    year: 2023,
    price: 54900,
    mileage: 6800,
    fuelType: 'Elektro',
    transmission: 'Automatik',
    power: 325,
    description: 'Hyundai IONIQ 5 Lounge AWD in Cyber Gray metallic. 77,4 kWh Batterie, Reichweite bis 481 km, 800V Schnellladetechnik. Vehicle-to-Load Funktion, Bose Premium Sound, Panoramadach. Fahrzeug ist wie neu.',
    location: 'Leipzig',
    sellerType: 'Händler',
    sellerName: 'Hyundai Autohaus Leipzig',
    sellerPhone: '+49 341 888999000',
    sellerId: 'seller9',
    images: [
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551952238-2315a31e1f29?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['Lounge Ausstattung', 'Allradantrieb', '800V Schnellladetechnik', 'Vehicle-to-Load', 'Bose Premium Sound', 'Panorama Glasdach', '20" Alufelgen', 'Digitales Cockpit', 'Wireless Charging', 'Highway Driving Assist 2'],
    createdAt: '2023-11-30T12:30:00Z',
    updatedAt: '2023-11-30T12:30:00Z'
  },
  {
    id: '10',
    title: 'Volvo XC90 T8 Inscription',
    brand: 'Volvo',
    model: 'XC90',
    year: 2022,
    price: 79900,
    mileage: 19500,
    fuelType: 'Hybrid',
    transmission: 'Automatik',
    power: 455,
    description: 'Volvo XC90 T8 Inscription in Crystal White Pearl. Plug-in Hybrid, 7-Sitzer, Luftfederung, Bowers & Wilkins Sound. Fahrzeug ist gepflegt und vollständig ausgestattet. Alle Services bei Volvo durchgeführt.',
    location: 'Dresden',
    sellerType: 'Händler',
    sellerName: 'Volvo Autohaus Dresden',
    sellerPhone: '+49 351 111222333',
    sellerId: 'seller10',
    images: [
      'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ],
    features: ['Inscription Ausstattung', 'T8 Plug-in Hybrid', '7-Sitzer Konfiguration', 'Luftfederung', 'Bowers & Wilkins Sound', 'Panorama Glasdach', 'Pilot Assist', 'Massage Sitze', '21" Alufelgen', 'Kristall Schaltknauf'],
    createdAt: '2023-11-25T14:45:00Z',
    updatedAt: '2023-11-25T14:45:00Z'
  }
];

export const carBrands = [
  'Audi', 'BMW', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Mazda', 'Mercedes-Benz', 
  'Opel', 'Porsche', 'Renault', 'Seat', 'Skoda', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
];

export const fuelTypes = ['Benzin', 'Diesel', 'Elektro', 'Hybrid', 'LPG', 'Andere'];

export const transmissionTypes = ['Manuell', 'Automatik'];

export const sellerTypes = ['Privat', 'Händler'];