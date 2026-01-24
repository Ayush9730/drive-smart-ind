import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { User, Car, Booking } from '../types/rental';
import { cities, cityDistances } from '../data/carData';

interface BookingFormProps {
  user: User;
  car: Car;
  onComplete: (booking: Booking) => void;
  onBack: () => void;
}

export const BookingForm = ({ user, car, onComplete, onBack }: BookingFormProps) => {
  const [formData, setFormData] = useState({
    fromCity: '',
    toCity: '',
    startDate: '',
    endDate: '',
    needDriver: false,
  });

  const [errors, setErrors] = useState<any>({});

  const calculateBooking = () => {
    if (!formData.fromCity || !formData.toCity || !formData.startDate || !formData.endDate) {
      return null;
    }

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (duration <= 0) return null;

    const distance = cityDistances[formData.fromCity][formData.toCity] || 0;
    const baseAmount = car.basePrice * duration;
    const distanceAmount = car.pricePerKm * distance;
    const driverCharges = formData.needDriver ? 500 * duration : 0;
    const totalAmount = baseAmount + distanceAmount + driverCharges;
    const deposit = Math.round(totalAmount * 0.2); // 20% deposit

    return {
      duration,
      distance,
      baseAmount,
      distanceAmount,
      driverCharges,
      totalAmount,
      deposit,
    };
  };

  const booking = calculateBooking();

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.fromCity) newErrors.fromCity = 'From city is required';
    if (!formData.toCity) newErrors.toCity = 'To city is required';
    if (formData.fromCity === formData.toCity) newErrors.toCity = 'From and To cities must be different';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (start < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && booking;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && booking) {
      const now = new Date();
      // Format date as YYYY-MM-DD for PostgreSQL
      const bookingDate = now.toISOString().split('T')[0];
      // Format time as HH:MM:SS for PostgreSQL
      const bookingTime = now.toTimeString().split(' ')[0];
      
      const bookingData: Booking = {
        id: `BK${Date.now()}`,
        user,
        car,
        fromCity: formData.fromCity,
        toCity: formData.toCity,
        startDate: formData.startDate,
        endDate: formData.endDate,
        duration: booking.duration,
        needDriver: formData.needDriver,
        driverCharges: booking.driverCharges,
        distance: booking.distance,
        totalAmount: booking.totalAmount,
        deposit: booking.deposit,
        bookingDate,
        bookingTime,
        status: 'confirmed',
      };
      onComplete(bookingData);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" onClick={onBack}>
          ← Back to Car Selection
        </Button>
        <h2 className="text-2xl font-bold text-primary">Book Your Rental</h2>
        <div />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fromCity">From City</Label>
                  <Select value={formData.fromCity} onValueChange={(value) => handleInputChange('fromCity', value)}>
                    <SelectTrigger className={errors.fromCity ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select from city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.fromCity && <p className="text-sm text-destructive mt-1">{errors.fromCity}</p>}
                </div>

                <div>
                  <Label htmlFor="toCity">To City</Label>
                  <Select value={formData.toCity} onValueChange={(value) => handleInputChange('toCity', value)}>
                    <SelectTrigger className={errors.toCity ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select to city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.toCity && <p className="text-sm text-destructive mt-1">{errors.toCity}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className={errors.startDate ? 'border-destructive' : ''}
                  />
                  {errors.startDate && <p className="text-sm text-destructive mt-1">{errors.startDate}</p>}
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    className={errors.endDate ? 'border-destructive' : ''}
                  />
                  {errors.endDate && <p className="text-sm text-destructive mt-1">{errors.endDate}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="needDriver"
                  checked={formData.needDriver}
                  onCheckedChange={(checked) => handleInputChange('needDriver', checked)}
                />
                <Label htmlFor="needDriver">Need Driver (+₹500/day)</Label>
              </div>

              <Button type="submit" className="w-full" disabled={!booking}>
                Confirm Booking
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Selected Car & Price Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Selected Car</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <img src={car.image} alt={car.name} className="w-20 h-15 object-cover rounded" />
                <div>
                  <h3 className="font-semibold">{car.name}</h3>
                  <Badge className="mt-1">{car.category}</Badge>
                  <p className="text-sm text-muted-foreground mt-1">👥 {car.passengers} passengers</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {booking && (
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{booking.duration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span>{booking.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base rent:</span>
                    <span>₹{booking.baseAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance charges:</span>
                    <span>₹{booking.distanceAmount.toLocaleString()}</span>
                  </div>
                  {formData.needDriver && (
                    <div className="flex justify-between">
                      <span>Driver charges:</span>
                      <span>₹{booking.driverCharges.toLocaleString()}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount:</span>
                    <span>₹{booking.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Deposit (20%):</span>
                    <span>₹{booking.deposit.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};