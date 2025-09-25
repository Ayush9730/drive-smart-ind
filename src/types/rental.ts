export interface User {
  name: string;
  phone: string;
  email: string;
  drivingLicense: string;
}

export interface Car {
  id: string;
  name: string;
  category: 'hatchback' | 'sedan' | 'xl' | 'luxury';
  passengers: number;
  image: string;
  basePrice: number; // per day
  pricePerKm: number;
  available: boolean;
}

export interface Booking {
  id: string;
  user: User;
  car: Car;
  fromCity: string;
  toCity: string;
  startDate: string;
  endDate: string;
  duration: number; // in days
  needDriver: boolean;
  driverCharges: number;
  distance: number; // in km
  totalAmount: number;
  deposit: number;
  bookingDate: string;
  bookingTime: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface CityDistance {
  [key: string]: { [key: string]: number };
}

export type Step = 'registration' | 'car-selection' | 'booking-form' | 'confirmation' | 'bookings-list';