import { createClient } from '@supabase/supabase-js';
import Table from 'cli-table3';
import { config } from 'dotenv';

// Load environment variables
config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Error: Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function viewBookings() {
  try {
    console.log('Fetching bookings from database...\n');

    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error.message);
      process.exit(1);
    }

    if (!bookings || bookings.length === 0) {
      console.log('No bookings found in the database.');
      return;
    }

    // Create table for bookings
    const table = new Table({
      head: [
        'Booking ID',
        'Customer Name',
        'Phone',
        'Email',
        'Car',
        'From',
        'To',
        'Start Date',
        'End Date',
        'Total Amount',
        'Status'
      ],
      colWidths: [15, 20, 15, 25, 20, 15, 15, 12, 12, 12, 12]
    });

    // Add rows to table
    bookings.forEach(booking => {
      table.push([
        booking.booking_id,
        booking.customer_name || 'N/A',
        booking.customer_phone || 'N/A',
        booking.customer_email || 'N/A',
        booking.car_name,
        booking.from_city,
        booking.to_city,
        booking.start_date,
        booking.end_date,
        `₹${booking.total_amount}`,
        booking.status
      ]);
    });

    console.log(table.toString());
    console.log(`\nTotal Bookings: ${bookings.length}\n`);

    // Summary statistics
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
    const totalRevenue = bookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + parseFloat(b.total_amount), 0);

    console.log('Summary:');
    console.log(`- Confirmed: ${confirmedBookings}`);
    console.log(`- Pending: ${pendingBookings}`);
    console.log(`- Cancelled: ${cancelledBookings}`);
    console.log(`- Total Revenue (Confirmed): ₹${totalRevenue.toFixed(2)}\n`);

  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

viewBookings();
