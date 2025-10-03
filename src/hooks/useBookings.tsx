import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Booking } from '@/types/rental';
import { Database } from '@/integrations/supabase/types';
import { cars } from '@/data/carData';

type BookingInsert = Database['public']['Tables']['bookings']['Insert'];
type BookingRow = Database['public']['Tables']['bookings']['Row'];

export const useBookings = (userId: string | undefined) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const transformBookingFromDB = (row: BookingRow, userProfile?: { name: string; phone: string; email: string; driving_license: string }): Booking => {
    // Find car image from car data
    const carData = cars.find(c => c.id === row.car_id);
    
    return {
      id: row.booking_id,
      user: {
        name: userProfile?.name || '',
        phone: userProfile?.phone || '',
        email: userProfile?.email || '',
        drivingLicense: userProfile?.driving_license || '',
      },
      car: {
        id: row.car_id,
        name: row.car_name,
        category: row.car_category as 'hatchback' | 'sedan' | 'xl' | 'luxury',
        passengers: row.car_passengers,
        image: carData?.image || '',
        basePrice: parseFloat(row.car_base_price.toString()),
        pricePerKm: parseFloat(row.car_price_per_km.toString()),
        available: true,
      },
      fromCity: row.from_city,
      toCity: row.to_city,
      startDate: row.start_date,
      endDate: row.end_date,
      duration: row.duration,
      needDriver: row.need_driver,
      driverCharges: parseFloat(row.driver_charges.toString()),
      distance: row.distance,
      totalAmount: parseFloat(row.total_amount.toString()),
      deposit: parseFloat(row.deposit.toString()),
      bookingDate: row.booking_date,
      bookingTime: row.booking_time,
      status: row.status as 'confirmed' | 'pending' | 'cancelled',
    };
  };

  const fetchBookings = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch bookings.",
        });
        return;
      }

      // Get all unique user IDs from bookings
      const userIds = [...new Set(bookingsData.map(b => b.user_id))];

      // Fetch all profiles for these users
      const { data: profilesData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profiles:', profileError);
      }

      // Create a map of user_id to profile
      const profileMap = new Map(
        (profilesData || []).map(p => [p.user_id, p])
      );

      // Transform bookings with their respective user profile data
      const transformedBookings = bookingsData.map(booking => {
        const userProfile = profileMap.get(booking.user_id);
        return transformBookingFromDB(booking, userProfile);
      });
      
      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch bookings.",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveBooking = async (booking: Booking) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to save bookings.",
      });
      return false;
    }

    try {
      const bookingData: BookingInsert = {
        user_id: userId,
        booking_id: booking.id,
        car_id: booking.car.id,
        car_name: booking.car.name,
        car_category: booking.car.category,
        car_passengers: booking.car.passengers,
        car_base_price: booking.car.basePrice,
        car_price_per_km: booking.car.pricePerKm,
        from_city: booking.fromCity,
        to_city: booking.toCity,
        start_date: booking.startDate,
        end_date: booking.endDate,
        duration: booking.duration,
        need_driver: booking.needDriver,
        driver_charges: booking.driverCharges,
        distance: booking.distance,
        total_amount: booking.totalAmount,
        deposit: booking.deposit,
        status: booking.status,
        booking_date: booking.bookingDate,
        booking_time: booking.bookingTime,
      };

      const { error } = await supabase
        .from('bookings')
        .insert(bookingData);

      if (error) {
        console.error('Error saving booking:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to save booking.",
        });
        return false;
      }

      setBookings(prev => [booking, ...prev]);
      toast({
        title: "Success",
        description: "Booking saved successfully!",
      });
      return true;
    } catch (error) {
      console.error('Error saving booking:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save booking.",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId]);

  return {
    bookings,
    loading,
    saveBooking,
    refetchBookings: fetchBookings,
  };
};