import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { to, message } = await request.json();

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Phone number and message are required' },
        { status: 400 }
      );
    }

    // Check if Twilio credentials are configured
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!accountSid || !authToken || !twilioWhatsAppNumber) {
      // Demo mode - simulate sending
      console.log('Demo mode: Would send WhatsApp message');
      console.log(`To: ${to}`);
      console.log(`Message: ${message}`);

      return NextResponse.json({
        success: true,
        message: 'Message sent (demo mode)',
        demo: true,
        details: {
          to,
          messagePreview: message.substring(0, 50),
        }
      });
    }

    // Real Twilio integration
    const twilio = require('twilio');
    const client = twilio(accountSid, authToken);

    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${twilioWhatsAppNumber}`,
      to: `whatsapp:${to}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      messageId: result.sid,
    });
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      {
        error: 'Failed to send message',
        details: error.message
      },
      { status: 500 }
    );
  }
}
