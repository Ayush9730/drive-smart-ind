import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Mail, Calendar, MapPin, Car, User, CreditCard } from 'lucide-react';
import { Booking } from '../types/rental';

interface BookingConfirmationProps {
  booking: Booking;
  onNewBooking: () => void;
  onViewBookings: () => void;
}

export const BookingConfirmation = ({ booking, onNewBooking, onViewBookings }: BookingConfirmationProps) => {
  const simulateEmailSend = () => {
    // Simulate email sending
    console.log(`
      Email sent to: ${booking.user.email}
      
      Subject: Car Rental Booking Confirmation - ${booking.id}
      
      Dear ${booking.user.name},
      
      Greetings from DriveSmartRental! 
      
      We are delighted to confirm your car rental booking. Your journey starts here, and we're excited to be part of it!
      
      BOOKING DETAILS:
      Booking ID: ${booking.id}
      Car: ${booking.car.name} (${booking.car.category})
      Route: ${booking.fromCity} to ${booking.toCity}
      Duration: ${booking.startDate} to ${booking.endDate} (${booking.duration} days)
      Distance: ${booking.distance} km
      Driver: ${booking.needDriver ? 'Included' : 'Self-drive'}
      Total Amount: ₹${booking.totalAmount.toLocaleString()}
      Deposit: ₹${booking.deposit.toLocaleString()}
      
      Your car will be ready for pickup on ${booking.startDate}. Please carry your driving license and a valid ID for verification.
      
      We hope you have a safe and comfortable journey. Thank you for choosing DriveSmartRental for your travel needs. We look forward to serving you again!
      
      Best regards,
      DriveSmartRental Team
      
      Need help? Contact us anytime!
    `);
  };

  // Simulate email sending on component mount
  React.useEffect(() => {
    simulateEmailSend();
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-primary mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground">Your car rental has been successfully booked.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-center space-x-2">
            <span>Booking ID: {booking.id}</span>
            <Badge variant="outline" className="bg-green-50 text-green-700">Confirmed</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Details */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center">
                <User className="w-4 h-4 mr-2" />
                Customer Details
              </h3>
              <div className="text-sm space-y-1">
                <p><strong>Name:</strong> {booking.user.name}</p>
                <p><strong>Phone:</strong> {booking.user.phone}</p>
                <p><strong>Email:</strong> {booking.user.email}</p>
                <p><strong>License:</strong> {booking.user.drivingLicense}</p>
              </div>
            </div>

            {/* Car Details */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center">
                <Car className="w-4 h-4 mr-2" />
                Car Details
              </h3>
              <div className="text-sm space-y-1">
                <p><strong>Car:</strong> {booking.car.name}</p>
                <p><strong>Category:</strong> {booking.car.category}</p>
                <p><strong>Passengers:</strong> {booking.car.passengers}</p>
                <p><strong>Driver:</strong> {booking.needDriver ? 'Included' : 'Self-drive'}</p>
              </div>
            </div>

            {/* Journey Details */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                Journey Details
              </h3>
              <div className="text-sm space-y-1">
                <p><strong>Route:</strong> {booking.fromCity} → {booking.toCity}</p>
                <p><strong>Distance:</strong> {booking.distance} km</p>
                <p><strong>Duration:</strong> {booking.duration} days</p>
                <p><strong>Dates:</strong> {booking.startDate} to {booking.endDate}</p>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center">
                <CreditCard className="w-4 h-4 mr-2" />
                Payment Details
              </h3>
              <div className="text-sm space-y-1">
                <p><strong>Total Amount:</strong> ₹{booking.totalAmount.toLocaleString()}</p>
                <p><strong>Deposit:</strong> ₹{booking.deposit.toLocaleString()}</p>
                <p><strong>Booking Date:</strong> {booking.bookingDate}</p>
                <p><strong>Booking Time:</strong> {booking.bookingTime}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Confirmation */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-2 text-blue-700">
            <Mail className="w-5 h-5" />
            <span className="font-medium">Confirmation email sent to {booking.user.email}</span>
          </div>
          <p className="text-sm text-blue-600 mt-2">
            Please check your inbox for detailed booking information and pickup instructions.
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button onClick={onNewBooking} className="flex-1 sm:flex-none">
          <Calendar className="w-4 h-4 mr-2" />
          Make New Booking
        </Button>
        <Button variant="outline" onClick={onViewBookings} className="flex-1 sm:flex-none">
          View All Bookings
        </Button>
      </div>
    </div>
  );
};

// Add React import for useEffect
import React from 'react';