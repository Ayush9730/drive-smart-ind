import { Car, CityDistance } from '../types/rental';
import marutiSwift from '../assets/maruti-swift.jpg';
import marutiDzire from '../assets/maruti-dzire.jpg';
import toyotaInnova from '../assets/toyota-innova.jpg';
import mercedesGlc from '../assets/mercedes-glc.jpg';

export const cars: Car[] = [
  {
    id: '1',
    name: 'Maruti Swift',
    category: 'hatchback',
    passengers: 4,
    image: marutiSwift,
    basePrice: 1200,
    pricePerKm: 12,
    available: true,
  },
  {
    id: '2',
    name: 'Maruti Swift Dzire',
    category: 'sedan',
    passengers: 5,
    image: marutiDzire,
    basePrice: 1500,
    pricePerKm: 15,
    available: true,
  },
  {
    id: '3',
    name: 'Toyota Innova',
    category: 'xl',
    passengers: 6,
    image: toyotaInnova,
    basePrice: 2500,
    pricePerKm: 25,
    available: true,
  },
  {
    id: '4',
    name: 'Mercedes GLC',
    category: 'luxury',
    passengers: 3,
    image: mercedesGlc,
    basePrice: 5000,
    pricePerKm: 50,
    available: true,
  },
];

export const cities = [
  'Mumbai',
  'Delhi',
  'Bengaluru',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad'
];

export const cityDistances: CityDistance = {
  Mumbai: {
    Mumbai: 0,
    Delhi: 1400,
    Bengaluru: 980,
    Chennai: 1340,
    Kolkata: 1980,
    Hyderabad: 710,
    Pune: 150,
    Ahmedabad: 530
  },
  Delhi: {
    Mumbai: 1400,
    Delhi: 0,
    Bengaluru: 2150,
    Chennai: 2180,
    Kolkata: 1470,
    Hyderabad: 1570,
    Pune: 1460,
    Ahmedabad: 950
  },
  Bengaluru: {
    Mumbai: 980,
    Delhi: 2150,
    Bengaluru: 0,
    Chennai: 350,
    Kolkata: 1870,
    Hyderabad: 570,
    Pune: 840,
    Ahmedabad: 1320
  },
  Chennai: {
    Mumbai: 1340,
    Delhi: 2180,
    Bengaluru: 350,
    Chennai: 0,
    Kolkata: 1670,
    Hyderabad: 630,
    Pune: 1180,
    Ahmedabad: 1680
  },
  Kolkata: {
    Mumbai: 1980,
    Delhi: 1470,
    Bengaluru: 1870,
    Chennai: 1670,
    Kolkata: 0,
    Hyderabad: 1500,
    Pune: 1950,
    Ahmedabad: 2050
  },
  Hyderabad: {
    Mumbai: 710,
    Delhi: 1570,
    Bengaluru: 570,
    Chennai: 630,
    Kolkata: 1500,
    Hyderabad: 0,
    Pune: 560,
    Ahmedabad: 900
  },
  Pune: {
    Mumbai: 150,
    Delhi: 1460,
    Bengaluru: 840,
    Chennai: 1180,
    Kolkata: 1950,
    Hyderabad: 560,
    Pune: 0,
    Ahmedabad: 660
  },
  Ahmedabad: {
    Mumbai: 530,
    Delhi: 950,
    Bengaluru: 1320,
    Chennai: 1680,
    Kolkata: 2050,
    Hyderabad: 900,
    Pune: 660,
    Ahmedabad: 0
  }
};