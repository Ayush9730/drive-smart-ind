-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  driving_license TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id TEXT NOT NULL UNIQUE,
  car_id TEXT NOT NULL,
  car_name TEXT NOT NULL,
  car_category TEXT NOT NULL,
  car_passengers INTEGER NOT NULL,
  car_base_price DECIMAL(10,2) NOT NULL,
  car_price_per_km DECIMAL(10,2) NOT NULL,
  from_city TEXT NOT NULL,
  to_city TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration INTEGER NOT NULL,
  need_driver BOOLEAN NOT NULL DEFAULT false,
  driver_charges DECIMAL(10,2) NOT NULL DEFAULT 0,
  distance INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  deposit DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  booking_date DATE NOT NULL DEFAULT CURRENT_DATE,
  booking_time TIME NOT NULL DEFAULT CURRENT_TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" 
  ON public.bookings 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings" 
  ON public.bookings 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" 
  ON public.bookings 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  -- This function can be used to automatically create a profile when needed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;