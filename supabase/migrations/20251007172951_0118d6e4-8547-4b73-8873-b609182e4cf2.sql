-- 1) Add snapshot columns to bookings (nullable for safe rollout)
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS customer_name text,
  ADD COLUMN IF NOT EXISTS customer_phone text,
  ADD COLUMN IF NOT EXISTS customer_email text,
  ADD COLUMN IF NOT EXISTS customer_driving_license text;

-- 2) Backfill existing rows from current profiles
UPDATE public.bookings b
SET 
  customer_name = COALESCE(b.customer_name, p.name),
  customer_phone = COALESCE(b.customer_phone, p.phone),
  customer_email = COALESCE(b.customer_email, p.email),
  customer_driving_license = COALESCE(b.customer_driving_license, p.driving_license)
FROM public.profiles p
WHERE b.user_id = p.user_id
  AND (
    b.customer_name IS NULL OR b.customer_phone IS NULL OR b.customer_email IS NULL OR b.customer_driving_license IS NULL
  );

-- 3) Create function to snapshot customer details on insert
CREATE OR REPLACE FUNCTION public.set_booking_customer_snapshot()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.customer_name IS NULL OR NEW.customer_name = '' THEN
    SELECT name, phone, email, driving_license
    INTO NEW.customer_name, NEW.customer_phone, NEW.customer_email, NEW.customer_driving_license
    FROM public.profiles
    WHERE user_id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

-- 4) Trigger to run before insert
DROP TRIGGER IF EXISTS trg_set_booking_customer_snapshot ON public.bookings;
CREATE TRIGGER trg_set_booking_customer_snapshot
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.set_booking_customer_snapshot();