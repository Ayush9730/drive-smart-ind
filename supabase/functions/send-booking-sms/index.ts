import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BookingSMSRequest {
  phoneNumber: string;
  bookingDetails: {
    bookingId: string;
    carName: string;
    fromCity: string;
    toCity: string;
    startDate: string;
    endDate: string;
    totalAmount: number;
    customerName: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, bookingDetails }: BookingSMSRequest = await req.json();

    console.log('Sending SMS to:', phoneNumber);

    // Format the SMS message (shortened for trial account limits)
    const message = `Booking Confirmed!
ID: ${bookingDetails.bookingId}
Car: ${bookingDetails.carName}
${bookingDetails.fromCity}-${bookingDetails.toCity}
${bookingDetails.startDate} to ${bookingDetails.endDate}
Total: ₹${bookingDetails.totalAmount}`;

    // Send SMS using Twilio API
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`;
    
    const formData = new URLSearchParams();
    formData.append('To', phoneNumber);
    formData.append('From', TWILIO_PHONE_NUMBER!);
    formData.append('Body', message);

    const twilioResponse = await fetch(twilioUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    const twilioData = await twilioResponse.json();

    if (!twilioResponse.ok) {
      console.error('Twilio error:', twilioData);
      throw new Error(`Failed to send SMS: ${twilioData.message || 'Unknown error'}`);
    }

    console.log('SMS sent successfully:', twilioData.sid);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageSid: twilioData.sid,
        message: 'SMS sent successfully' 
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error('Error in send-booking-sms function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
});
