import { NextRequest, NextResponse } from 'next/server';
import { getGoogleAuthUrl } from '@/lib/googleCalendar';

export async function GET(request: NextRequest) {
   try {
      const authUrl = await getGoogleAuthUrl();
      console.log('Generated Auth URL:', authUrl);
      return NextResponse.json({ authUrl });
   } catch (error) {
      console.error('Error getting Google Calendar auth URL:', error);
      return NextResponse.json({ error: 'Failed to get Google Calendar authorization URL' }, { status: 500 });
   }
}