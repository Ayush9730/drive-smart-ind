import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Car, Calendar, MapPin, Users, LogOut } from 'lucide-react';
import { UserRegistration } from './UserRegistration';
import { CarSelection } from './CarSelection';
import { BookingForm } from './BookingForm';
import { BookingConfirmation } from './BookingConfirmation';
import { BookingsList } from './BookingsList';
import { AuthForm } from './AuthForm';
import { User, Car as CarType, Booking, Step } from '../types/rental';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useBookings } from '@/hooks/useBookings';

export const CarRentalSystem = () => {
  const [currentStep, setCurrentStep] = useState<Step>('registration');
  const [selectedCar, setSelectedCar] = useState<CarType | null>(null);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  
  const { user, loading: authLoading, signOut, isAuthenticated } = useAuth();
  const { profile, loading: profileLoading, saveProfile } = useProfile(user?.id);
  const { bookings, loading: bookingsLoading, saveBooking } = useBookings(user?.id);

  const handleUserRegistration = async (userData: User) => {
    const success = await saveProfile(userData);
    if (success) {
      setCurrentStep('car-selection');
    }
  };

  const handleCarSelection = (car: CarType) => {
    setSelectedCar(car);
    setCurrentStep('booking-form');
  };

  const handleBookingComplete = async (booking: Booking) => {
    const success = await saveBooking(booking);
    if (success) {
      setCurrentBooking(booking);
      setCurrentStep('confirmation');
    }
  };

  const handleNewBooking = () => {
    setCurrentStep('registration');
    setSelectedCar(null);
    setCurrentBooking(null);
  };

  const handleViewBookings = () => {
    setCurrentStep('bookings-list');
  };

  const handleBackToRegistration = () => {
    setCurrentStep('registration');
  };

  const handleBackToCarSelection = () => {
    setCurrentStep('car-selection');
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setCurrentStep('registration');
    setSelectedCar(null);
    setCurrentBooking(null);
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  // Show auth form if not authenticated
  if (!isAuthenticated || showAuth) {
    return <AuthForm onAuthSuccess={handleAuthSuccess} />;
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'registration':
        return (
          <UserRegistration 
            onComplete={handleUserRegistration}
            initialData={profile || undefined}
          />
        );
      
      case 'car-selection':
        return (
          <CarSelection 
            onSelect={handleCarSelection}
            onBack={handleBackToRegistration}
            selectedCarId={selectedCar?.id}
          />
        );
      
      case 'booking-form':
        return profile && selectedCar ? (
          <BookingForm 
            user={profile}
            car={selectedCar}
            onComplete={handleBookingComplete}
            onBack={handleBackToCarSelection}
          />
        ) : null;
      
      case 'confirmation':
        return currentBooking ? (
          <BookingConfirmation 
            booking={currentBooking}
            onNewBooking={handleNewBooking}
            onViewBookings={handleViewBookings}
          />
        ) : null;
      
      case 'bookings-list':
        return (
          <BookingsList 
            bookings={bookings}
            onBack={handleNewBooking}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-6 mb-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Car className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">DriveSmartRental</h1>
                <p className="text-primary-foreground/80">Your Journey, Our Cars</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {currentStep !== 'bookings-list' && bookings.length > 0 && (
                <Button 
                  variant="secondary"
                  onClick={handleViewBookings}
                  className="flex items-center space-x-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>View All Bookings ({bookings.length})</span>
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        {currentStep === 'registration' && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">
                Rent Your Perfect Car Today
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Choose from our premium fleet of vehicles for your journey across India. 
                Professional service, competitive rates, and memorable experiences.
              </p>
              
              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Car className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Premium Fleet</h3>
                    <p className="text-sm text-muted-foreground">
                      From hatchbacks to luxury cars, find the perfect vehicle for your needs
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Pan-India Service</h3>
                    <p className="text-sm text-muted-foreground">
                      Available across 8 major Indian cities with transparent pricing
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Professional Drivers</h3>
                    <p className="text-sm text-muted-foreground">
                      Optional professional drivers available for a comfortable journey
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
        
        {/* Current Step Content */}
        {renderCurrentStep()}
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-16 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Car className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold">DriveSmartRental</span>
          </div>
          <p className="text-muted-foreground">
            © 2024 DriveSmartRental. Making your journeys memorable across India.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Available in Mumbai • Delhi • Bengaluru • Chennai • Kolkata • Hyderabad • Pune • Ahmedabad
          </p>
        </div>
      </footer>
    </div>
  );
};