import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, MapPin, Car, User, CreditCard, Phone, RefreshCw } from 'lucide-react';
import { Booking } from '../types/rental';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookingConfirmationProps {
  booking: Booking;
  onNewBooking: () => void;
  onViewBookings: () => void;
}

export const BookingConfirmation = ({ booking, onNewBooking, onViewBookings }: BookingConfirmationProps) => {
  const { toast } = useToast();
  const [smsStatus, setSmsStatus] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  const sendBookingSMS = useCallback(async () => {
    // Validate phone number before attempting to send
    if (!booking.user.phone || booking.user.phone.length < 10) {
      console.log('Invalid phone number, skipping SMS');
      setSmsStatus('failed');
      return;
    }

    setSmsStatus('sending');
    
    try {
      console.log('Sending SMS to:', booking.user.phone);
      
      const { data, error } = await supabase.functions.invoke('send-booking-sms', {
        body: {
          phoneNumber: booking.user.phone,
          bookingDetails: {
            bookingId: booking.id,
            carName: booking.car.name,
            fromCity: booking.fromCity,
            toCity: booking.toCity,
            startDate: booking.startDate,
            endDate: booking.endDate,
            totalAmount: booking.totalAmount,
            customerName: booking.user.name,
          },
        },
      });

      if (error) {
        console.error('SMS sending error:', error);
        setSmsStatus('failed');
        // Don't show error toast for SMS failure - it's not critical
        console.log('SMS failed but booking is confirmed');
        return;
      }

      console.log('SMS sent successfully:', data);
      setSmsStatus('sent');
      toast({
        title: "SMS Sent",
        description: "Booking confirmation sent to your phone!",
      });
    } catch (error) {
      console.error('Error sending SMS:', error);
      setSmsStatus('failed');
    }
  }, [booking, toast]);

  // Send SMS on component mount
  useEffect(() => {
    sendBookingSMS();
  }, [sendBookingSMS]);

  const retrySMS = () => {
    sendBookingSMS();
  };

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
              <div className="text-sm space-y-1 text-left">
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
              <div className="text-sm space-y-1 text-left">
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
              <div className="text-sm space-y-1 text-left">
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
              <div className="text-sm space-y-1 text-left">
                <p><strong>Total Amount:</strong> ₹{booking.totalAmount.toLocaleString()}</p>
                <p><strong>Deposit:</strong> ₹{booking.deposit.toLocaleString()}</p>
                <p><strong>Booking Date:</strong> {booking.bookingDate}</p>
                <p><strong>Booking Time:</strong> {booking.bookingTime}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMS Confirmation */}
      <Card className={`mb-6 ${smsStatus === 'sent' ? 'bg-green-50 border-green-200' : smsStatus === 'failed' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
        <CardContent className="p-4">
          <div className={`flex items-center justify-center space-x-2 ${smsStatus === 'sent' ? 'text-green-700' : smsStatus === 'failed' ? 'text-yellow-700' : 'text-blue-700'}`}>
            <Phone className="w-5 h-5" />
            <span className="font-medium">
              {smsStatus === 'idle' && 'Preparing to send SMS...'}
              {smsStatus === 'sending' && `Sending SMS to ${booking.user.phone}...`}
              {smsStatus === 'sent' && `Booking confirmation SMS sent to ${booking.user.phone}`}
              {smsStatus === 'failed' && `SMS notification unavailable`}
            </span>
          </div>
          <p className={`text-sm mt-2 ${smsStatus === 'sent' ? 'text-green-600' : smsStatus === 'failed' ? 'text-yellow-600' : 'text-blue-600'}`}>
            {smsStatus === 'idle' && 'Initializing...'}
            {smsStatus === 'sending' && 'Please wait while we send your booking details...'}
            {smsStatus === 'sent' && 'Check your phone for booking details and pickup information.'}
            {smsStatus === 'failed' && 'Your booking is confirmed! You can take a screenshot of this page for your records.'}
          </p>
          {smsStatus === 'failed' && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={retrySMS}
              className="mt-2"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry SMS
            </Button>
          )}
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