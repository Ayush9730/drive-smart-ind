import { useState, useEffect, useCallback } from 'react';
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
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  const transformBookingFromDB = (row: BookingRow): Booking => {
    // Find car image from car data
    const carData = cars.find(c => c.id === row.car_id);
    
    return {
      id: row.booking_id,
      user: {
        name: (row as any).customer_name || '',
        phone: (row as any).customer_phone || '',
        email: (row as any).customer_email || '',
        drivingLicense: (row as any).customer_driving_license || '',
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

  const checkAdminStatus = useCallback(async () => {
    if (!userId) return false;
    
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }, [userId]);

  const fetchBookings = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Check admin status
      const adminStatus = await checkAdminStatus();
      setIsAdmin(adminStatus);

      // Fetch all bookings - RLS will handle filtering based on user role
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (bookingsError) {
        console.error('Error fetching bookings:', bookingsError);
        // Don't show toast for initial load errors
        if (bookingsError.code !== 'PGRST116') {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch bookings. Please try again.",
          });
        }
        return;
      }

      // Transform bookings (customer details are now stored in booking rows)
      const transformedBookings = (bookingsData || []).map(booking => 
        transformBookingFromDB(booking)
      );
      
      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, checkAdminStatus, toast]);

  const saveBooking = async (booking: Booking): Promise<boolean> => {
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
        
        // Provide more specific error messages
        let errorMessage = "Failed to save booking.";
        if (error.code === '23505') {
          errorMessage = "This booking ID already exists.";
        } else if (error.code === '42501') {
          errorMessage = "You don't have permission to create bookings.";
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast({
          variant: "destructive",
          title: "Booking Error",
          description: errorMessage,
        });
        return false;
      }

      // Update local state with the new booking
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
        description: "Failed to save booking. Please try again.",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return {
    bookings,
    loading,
    isAdmin,
    saveBooking,
    refetchBookings: fetchBookings,
  };
};